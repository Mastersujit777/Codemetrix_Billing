@echo off
setlocal
cd /d "%~dp0"
echo ==================================================
echo   END SESSION  -  save snapshot + commit + push
echo ==================================================

echo.
echo [1/4] saving local database to db\snapshot.sql ...
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0scripts\db-save.ps1"
if errorlevel 1 goto err

echo.
echo [2/4] staging db\snapshot.sql ...
git add db/snapshot.sql
if errorlevel 1 goto err

rem build a readable "YYYY-MM-DD HH:MM:SS" stamp for the commit message
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set "STAMP=%%i"

echo.
echo [3/4] committing  ( db snapshot: %STAMP% ) ...
git diff --cached --quiet && ( echo    No snapshot changes to commit. & goto push )
git commit -m "db snapshot: %STAMP%"
if errorlevel 1 goto err

:push
echo.
echo [4/4] git push ...
git push origin prod
if errorlevel 1 goto err

echo.
echo Done. Snapshot pushed - the next person can pull.
goto end

:err
echo.
echo *** Something failed (see the messages above). ***

:end
echo.
pause
