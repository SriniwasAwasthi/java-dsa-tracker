@echo off
title Java DSA Mentor
color 0A

echo.
echo  =============================================
echo    Java DSA Mentor - Website Launcher
echo  =============================================
echo.

:: Set the exact path to Node.js
set NODE_PATH=C:\Users\sriaw\OneDrive\Desktop\Want to code ..!!
set PATH=%NODE_PATH%;%PATH%

:: Step 1: Move to project folder
cd /d "e:\W c One Drive\DSC"
if errorlevel 1 (
    echo  [ERROR] Could not find project folder.
    pause
    exit /b
)
echo  [OK] Project folder found.

:: Step 2: Verify Node.js works
"%NODE_PATH%\node.exe" -v >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found at expected location.
    echo  Location checked: %NODE_PATH%
    pause
    exit /b
)
echo  [OK] Node.js is ready.

:: Step 3: Install packages if missing (first time only)
if not exist "node_modules" (
    echo.
    echo  [INFO] First time setup - Installing packages...
    echo  Please wait 2-3 minutes...
    echo.
    "%NODE_PATH%\npm.cmd" install
    echo  [OK] Packages installed.
)
echo  [OK] All packages ready.

:: Step 4: Launch
echo.
echo  =============================================
echo   Opening website at: http://localhost:3000
echo   Browser opens in 3 seconds...
echo   Press Ctrl+C to stop the website.
echo  =============================================
echo.

timeout /t 3 /nobreak > nul
start "" "http://localhost:3000"

:: Start the server
if exist "dist\server.cjs" (
    "%NODE_PATH%\node.exe" dist/server.cjs
) else (
    "%NODE_PATH%\npm.cmd" run dev
)

pause
