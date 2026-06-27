@echo off
setlocal
cd /d "%~dp0"
echo ==================================================
echo   CodeMetrix Billing  -  starting the application
echo ==================================================

rem use the project's virtual environment if present, else fall back to system python
if exist "%~dp0.venv\Scripts\python.exe" (
  set "PY=%~dp0.venv\Scripts\python.exe"
) else (
  set "PY=python"
)

echo.
echo The app will open at  http://127.0.0.1:8000
echo Press  Ctrl+C  in this window to stop the app.
echo.

rem open the browser a few seconds after the server has had time to start
start "" cmd /c "timeout /t 3 >nul & start "" http://127.0.0.1:8000"

rem start the web server (this keeps running until you press Ctrl+C)
"%PY%" manage.py runserver

echo.
echo Application stopped.
pause
