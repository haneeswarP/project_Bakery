# Home Bakery Order Management System - Stop Script
# This script helps stop all related processes

Write-Host "=============================================" -ForegroundColor Red
Write-Host "🛑 Home Bakery Order Management System" -ForegroundColor Red
Write-Host "   Stop Script" -ForegroundColor Red
Write-Host "=============================================" -ForegroundColor Red
Write-Host ""

Write-Host "🔍 Looking for Home Bakery processes..." -ForegroundColor Yellow

# Stop Java processes (Spring Boot)
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*spring-boot*" -or $_.CommandLine -like "*mvnw*" }
if ($javaProcesses) {
    Write-Host "🛑 Stopping Spring Boot backend processes..." -ForegroundColor Yellow
    $javaProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Stopped process ID: $($_.Id)" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ No Spring Boot processes found" -ForegroundColor Green
}

# Stop Node.js processes (React)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*react-scripts*" }
if ($nodeProcesses) {
    Write-Host "🛑 Stopping React frontend processes..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Stopped process ID: $($_.Id)" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ No React processes found" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Stop script completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Note: You can also manually close the terminal windows" -ForegroundColor Yellow
Write-Host "   or press Ctrl+C in each terminal to stop the applications." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to close..."