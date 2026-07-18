@echo off
title BBS Dev Server
echo Starting BBS development servers...

start "BBS-Server" cmd /c "cd /d "%~dp0bbs-server" && npm run dev"
timeout /t 2 /nobreak >nul
start "BBS-Client" cmd /c "cd /d "%~dp0bbs-client" && npm run dev"

echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo Press any key to close this window (servers will keep running)
pause >nul