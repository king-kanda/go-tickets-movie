@echo off
REM Movie Ticket Booking System - Start Script for Windows

echo.
echo =========================================================
echo      Movie Ticket Booking System - Startup Script
echo =========================================================
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo [ERROR] Backend directory not found!
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo [ERROR] Frontend directory not found!
    exit /b 1
)

REM Check if Go is installed
where go >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Go is not installed. Please install Go 1.24 or higher.
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

echo [OK] Prerequisites check passed
echo.

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
if not exist "go.sum" (
    go mod download
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)
cd ..

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    call npm install
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..

echo.
echo [INFO] Starting servers...
echo.

REM Start backend in a new window
echo [INFO] Starting backend server on http://localhost:8080
start "Backend Server" cmd /k "cd backend && go run main.go"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
echo [INFO] Starting frontend server on http://localhost:3000
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [OK] All servers are starting!
echo.
echo =========================================================
echo.
echo [INFO] Access the application:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo.
echo [INFO] Default Admin Credentials:
echo   Email:    admin@ticketing.com
echo   Password: admin123
echo.
echo =========================================================
echo.
echo [INFO] Close the server windows to stop the servers
echo.
pause
