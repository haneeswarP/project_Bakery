# Home Bakery Order Management System - One-Command Startup Script
# This script starts both the Spring Boot backend and React frontend in separate windows

Write-Host "=============================================" -ForegroundColor Green
Write-Host "🧁 Home Bakery Order Management System" -ForegroundColor Green
Write-Host "   One-Command Startup Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ ERROR: Please run this script from the project root directory." -ForegroundColor Red
    Write-Host "   Make sure both 'backend' and 'frontend' folders exist." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit..."
    exit 1
}

# Prompt for MySQL password securely
Write-Host "🔐 Please enter your MySQL root password:" -ForegroundColor Yellow
$securePassword = Read-Host -AsSecureString
$mysqlPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Validate password is not empty
if ([string]::IsNullOrWhiteSpace($mysqlPassword)) {
    Write-Host "❌ ERROR: MySQL password cannot be empty." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting Home Bakery Order Management System..." -ForegroundColor Green
Write-Host ""

# Start Backend (Spring Boot) in a new PowerShell window
Write-Host "📊 Starting Backend (Spring Boot)..." -ForegroundColor Cyan
Write-Host "   - Port: 8080" -ForegroundColor Gray
Write-Host "   - Database: MySQL (bakery_db)" -ForegroundColor Gray
Write-Host "   - Opening separate terminal window..." -ForegroundColor Gray

$backendScript = @"
Write-Host '=============================================' -ForegroundColor Green
Write-Host '📊 Home Bakery Backend (Spring Boot)' -ForegroundColor Green
Write-Host '   Port: 8080' -ForegroundColor Green
Write-Host '   Database: MySQL (bakery_db)' -ForegroundColor Green
Write-Host '=============================================' -ForegroundColor Green
Write-Host ''
Write-Host '🔄 Setting up environment...' -ForegroundColor Yellow
`$env:MYSQL_PASSWORD='$mysqlPassword'
Write-Host '✅ MySQL password configured' -ForegroundColor Green
Write-Host ''
Write-Host '🚀 Starting Spring Boot application...' -ForegroundColor Yellow
Write-Host ''
cd backend
.\mvnw.cmd spring-boot:run
Write-Host ''
Write-Host '⚠️  Backend stopped. Press Enter to close this window...' -ForegroundColor Yellow
Read-Host
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a moment for backend to start initializing
Write-Host "   ⏳ Waiting 3 seconds for backend initialization..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Start Frontend (React) in a new PowerShell window
Write-Host "🌐 Starting Frontend (React)..." -ForegroundColor Cyan
Write-Host "   - Port: 3000" -ForegroundColor Gray
Write-Host "   - Opening separate terminal window..." -ForegroundColor Gray

$frontendScript = @"
Write-Host '=============================================' -ForegroundColor Green
Write-Host '🌐 Home Bakery Frontend (React)' -ForegroundColor Green
Write-Host '   Port: 3000' -ForegroundColor Green
Write-Host '=============================================' -ForegroundColor Green
Write-Host ''
Write-Host '📦 Checking dependencies...' -ForegroundColor Yellow
cd frontend
if (-not (Test-Path 'node_modules')) {
    Write-Host '⚠️  Installing npm dependencies...' -ForegroundColor Yellow
    npm install
}
Write-Host ''
Write-Host '🚀 Starting React development server...' -ForegroundColor Yellow
Write-Host ''
npm start
Write-Host ''
Write-Host '⚠️  Frontend stopped. Press Enter to close this window...' -ForegroundColor Yellow
Read-Host
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Clear the password from memory
$mysqlPassword = $null
$securePassword = $null

Write-Host ""
Write-Host "✅ Startup initiated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Application Information:" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:8080" -ForegroundColor Gray
Write-Host "   • Frontend:    http://localhost:3000" -ForegroundColor Gray
Write-Host "   • Database:    MySQL (bakery_db)" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Quick Access URLs:" -ForegroundColor White
Write-Host "   • Customer Orders:  http://localhost:3000" -ForegroundColor Gray
Write-Host "   • Baker Dashboard:  http://localhost:3000/baker-dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Both applications will open in separate terminal windows" -ForegroundColor Gray
Write-Host "   • Wait for 'Compiled successfully!' message from React" -ForegroundColor Gray
Write-Host "   • Wait for 'Started HomeBakeryApplication' message from Spring Boot" -ForegroundColor Gray
Write-Host "   • Close terminal windows to stop the applications" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Home Bakery Order Management System is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to close this launcher window..." -ForegroundColor White
Read-Host