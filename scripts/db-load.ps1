<#
  Option B - restore db\snapshot.sql into the local PostgreSQL database, then
  apply any newer migrations from the pulled code.

  Run this when you START your session, AFTER 'git pull':
      git pull
      powershell -ExecutionPolicy Bypass -File scripts\db-load.ps1

  WARNING: this REPLACES your local database contents with the snapshot from Git.
  DB credentials are read from .env.
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

# --- load DB settings from .env ---
$cfg = @{ DB_NAME='codemetrix_billing'; DB_USER='postgres'; DB_PASSWORD='';
          DB_HOST='localhost'; DB_PORT='5432' }
$envFile = Join-Path $root '.env'
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"').Trim("'")
    }
  }
}

# --- locate the PostgreSQL client tools ---
$bin = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin" -Directory -ErrorAction SilentlyContinue |
       Select-Object -First 1 -ExpandProperty FullName
if (-not $bin) { throw "PostgreSQL bin folder not found under C:\Program Files\PostgreSQL\*" }
$psql     = Join-Path $bin 'psql.exe'
$createdb = Join-Path $bin 'createdb.exe'

$snap = Join-Path $root 'db\snapshot.sql'
if (-not (Test-Path $snap)) { throw "db\snapshot.sql not found - run 'git pull' first" }

$env:PGPASSWORD = $cfg.DB_PASSWORD
try {
  # ensure the database exists
  $exists = & $psql -U $cfg.DB_USER -h $cfg.DB_HOST -p $cfg.DB_PORT -d postgres -tAc `
            "SELECT 1 FROM pg_database WHERE datname='$($cfg.DB_NAME)'"
  if ("$exists".Trim() -ne '1') {
    & $createdb -U $cfg.DB_USER -h $cfg.DB_HOST -p $cfg.DB_PORT $cfg.DB_NAME
    Write-Host "Created database $($cfg.DB_NAME)"
  }

  # restore the snapshot (drops and recreates objects via --clean in the dump)
  & $psql -U $cfg.DB_USER -h $cfg.DB_HOST -p $cfg.DB_PORT -d $cfg.DB_NAME `
          -v ON_ERROR_STOP=1 -f $snap
  if ($LASTEXITCODE -ne 0) { throw "psql restore failed (exit $LASTEXITCODE)" }
} finally {
  Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "Restored db\snapshot.sql into $($cfg.DB_NAME)." -ForegroundColor Green

# --- apply any newer migrations from the pulled code ---
$py = Join-Path $root '.venv\Scripts\python.exe'
if (Test-Path $py) {
  & $py (Join-Path $root 'manage.py') migrate
} else {
  Write-Host "(.venv not found - run 'python manage.py migrate' yourself if needed)"
}
