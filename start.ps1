Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Chess Tournament Platform Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Installing smart contract dependencies..." -ForegroundColor Yellow
Set-Location "contract"
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install contract dependencies" -ForegroundColor Red
        Read-Host "Press Enter to continue"
        exit 1
    }
    Write-Host "✅ Contract dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Error installing contract dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Compiling smart contracts..." -ForegroundColor Yellow
try {
    npm run compile
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
        Read-Host "Press Enter to continue"
        exit 1
    }
    Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error compiling contracts" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "..\client"
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to continue"
        exit 1
    }
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Error installing frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "[4/4] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Starting Chess Tournament Platform..." -ForegroundColor Green
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Smart contracts are ready for deployment" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev 