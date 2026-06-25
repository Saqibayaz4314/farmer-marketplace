@echo off
echo ========================================
echo   🌾 Farmer Marketplace Launcher
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm detected
echo.

REM Get the current directory
set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

echo 📂 Project Directory: %ROOT_DIR%
echo.

REM Check if backend directory exists
if not exist "%BACKEND_DIR%" (
    echo ❌ ERROR: Backend directory not found!
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "%FRONTEND_DIR%" (
    echo ❌ ERROR: Frontend directory not found!
    pause
    exit /b 1
)

echo ========================================
echo   📦 Installing Dependencies
echo ========================================
echo.

REM Check and install backend dependencies
echo 🔧 Checking backend dependencies...
if not exist "%BACKEND_DIR%\node_modules" (
    echo Installing backend dependencies...
    cd "%BACKEND_DIR%"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ ERROR: Failed to install backend dependencies!
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already installed
)
echo.

REM Check and install frontend dependencies
echo 🔧 Checking frontend dependencies...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo Installing frontend dependencies...
    cd "%FRONTEND_DIR%"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ ERROR: Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)
echo.

REM Check for .env files
echo 🔍 Checking environment files...
if not exist "%BACKEND_DIR%\.env" (
    echo ⚠️  WARNING: Backend .env file not found!
    echo Please create backend\.env with required variables
    echo.
)

if not exist "%FRONTEND_DIR%\.env" (
    echo ⚠️  WARNING: Frontend .env file not found!
    echo Please create frontend\.env with required variables
    echo.
)

echo ========================================
echo   🚀 Starting Servers
echo ========================================
echo.
echo 🔹 Backend will run on: http://localhost:5000
echo 🔹 Frontend will run on: http://localhost:5173
echo.
echo ⚡ Press Ctrl+C in this window to stop both servers
echo.
timeout /t 3 /nobreak >nul

REM Start backend in a new window
echo 🟢 Starting Backend Server...
start "Farmer Marketplace - Backend" cmd /k "cd /d "%BACKEND_DIR%" && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
echo 🟢 Starting Frontend Server...
start "Farmer Marketplace - Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo ========================================
echo   ✅ Servers Starting!
echo ========================================
echo.
echo 🌐 Backend:  http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo 📌 Two terminal windows have been opened:
echo    1. Backend Server (Node.js/Express)
echo    2. Frontend Server (Vite/React)
echo.
echo 💡 TIP: Keep both windows open while using the app
echo.
echo 🛑 To stop servers: Close both terminal windows or press Ctrl+C
echo.
echo ========================================

REM Keep this window open
echo Press any key to exit this launcher window...
pause >nul
