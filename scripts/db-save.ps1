<#
  Option B - save the local PostgreSQL database to db\snapshot.sql, the file
  that is committed to Git and passed between teammates.

  Run this when you FINISH your session, then commit and push:
      powershell -ExecutionPolicy Bypass -File scripts\db-save.ps1
      git add db/snapshot.sql
      git commit -m "data: <your name> <date>"
      git push

  DB credentials are read from .env, so nothing secret lives in this script.
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

# --- locate pg_dump.exe ---
$pgDump = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\pg_dump.exe" -ErrorAction SilentlyContinue |
          Select-Object -First 1 -ExpandProperty FullName
if (-not $pgDump) { throw "pg_dump.exe not found under C:\Program Files\PostgreSQL\*\bin" }

# --- dump to db\snapshot.sql ---
#   --clean --if-exists : the snapshot drops and recreates objects on restore
#   --no-owner          : avoids 'role does not exist' errors across machines
$dbDir = Join-Path $root 'db'
New-Item -ItemType Directory -Force -Path $dbDir | Out-Null
$out = Join-Path $dbDir 'snapshot.sql'

$env:PGPASSWORD = $cfg.DB_PASSWORD
try {
  & $pgDump -U $cfg.DB_USER -h $cfg.DB_HOST -p $cfg.DB_PORT `
            --clean --if-exists --no-owner -f $out $cfg.DB_NAME
  if ($LASTEXITCODE -ne 0) { throw "pg_dump failed (exit $LASTEXITCODE)" }
} finally {
  Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

$kb = [math]::Round((Get-Item $out).Length / 1KB, 1)
Write-Host "Saved db\snapshot.sql ($kb KB)." -ForegroundColor Green
Write-Host "Next: git add db/snapshot.sql; git commit -m 'data: <name>'; git push"
