@echo off
echo ========================================
echo   Chess Tournament Platform Startup
echo ========================================
echo.

echo [1/4] Installing smart contract dependencies...
cd contract
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install contract dependencies
    pause
    exit /b 1
)
echo ✅ Contract dependencies installed

echo.
echo [2/4] Compiling smart contracts...
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
)
echo ✅ Contracts compiled successfully

echo.
echo [3/4] Installing frontend dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo.
echo [4/4] Starting development server...
echo.
echo 🎉 Starting Chess Tournament Platform...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔗 Smart contracts are ready for deployment
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev 