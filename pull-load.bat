@echo off
setlocal
cd /d "%~dp0"
echo ==================================================
echo   START SESSION  -  git pull + load DB snapshot
echo ==================================================

echo.
echo [1/2] git pull ...
git pull origin prod
if errorlevel 1 goto err

echo.
echo [2/2] restoring db\snapshot.sql into the local database ...
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0scripts\db-load.ps1"
if errorlevel 1 goto err

echo.
echo Done. You now have the latest data - you may start working.
goto end

:err
echo.
echo *** Something failed (see the messages above). Fix it before working. ***

:end
echo.
pause
