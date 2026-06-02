@echo off
setlocal

cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 goto run_python

where py >nul 2>nul
if %errorlevel%==0 goto run_py

echo Python was not found.
echo Install Python and try again.
pause
goto end

:run_python
start "Local Server" cmd.exe /k "cd /d %~dp0 && python serve.py"
timeout /t 2 >nul
start "" "http://127.0.0.1:8888/index.html"
goto end

:run_py
start "Local Server" cmd.exe /k "cd /d %~dp0 && py serve.py"
timeout /t 2 >nul
start "" "http://127.0.0.1:8888/index.html"
goto end

:end
endlocal
