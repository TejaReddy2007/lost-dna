@echo off
title LOST DNA
cd /d "%~dp0"
where node >/dev/null 2>/dev/null || (echo Node.js is not installed. Get the LTS version from https://nodejs.org and run this again. & pause & exit /b 1)
if not exist node_modules (
  echo Installing packages - first time only, takes 1-3 minutes...
  call npm install || (echo npm install failed. & pause & exit /b 1)
)
echo Starting LOST DNA... your browser will open in a few seconds.
start "" cmd /c "timeout /t 8 >/dev/null & start http://localhost:5173"
call npm run dev
pause
