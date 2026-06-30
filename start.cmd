@echo off
chcp 65001 >nul
title BBS 开发服务器
echo ========================================
echo   BBS 开发服务器启动中...
echo ========================================
echo.

:: 启动后端
echo [1/2] 启动后端服务器 (bbs-server)...
start "BBS-Server" cmd /c "cd /d "%~dp0bbs-server" && echo 后端服务器已启动 (端口 3000) && npm run dev"

:: 等待一下确保端口释放
timeout /t 2 /nobreak >nul

:: 启动前端
echo [2/2] 启动前端开发服务器 (bbs-client)...
start "BBS-Client" cmd /c "cd /d "%~dp0bbs-client" && echo 前端服务器已启动 (端口 5173) && npm run dev"

echo.
echo ========================================
echo   后端: http://localhost:3000
echo   前端: http://localhost:5173
echo   按任意键关闭此窗口（不会关闭服务）
echo ========================================
echo.
pause >nul
