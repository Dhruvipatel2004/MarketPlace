# Build Android Release APK on Windows
# This script tries WSL first, then provides instructions if WSL is not available

param(
    [switch]$UseWSL
)

$ErrorActionPreference = "Stop"

Write-Host "Building Android Release APK..." -ForegroundColor Cyan
Write-Host ""

# Check if WSL is available
$wslAvailable = $false
try {
    $null = wsl --status 2>&1
    if ($LASTEXITCODE -eq 0) {
        $wslAvailable = $true
        Write-Host "WSL detected. Using WSL to build (recommended for Windows)." -ForegroundColor Green
    }
} catch {
    # WSL not available
}

if ($wslAvailable -or $UseWSL) {
    Write-Host ""
    Write-Host "Building release APK in WSL..." -ForegroundColor Yellow
    
    # Convert Windows path to WSL path
    $projectPath = (Get-Location).Path
    $wslPath = $projectPath -replace '^([A-Z]):', '/mnt/$1' -replace '\\', '/'
    $wslPath = $wslPath.ToLower()
    
    Write-Host "Project path in WSL: $wslPath" -ForegroundColor Gray
    Write-Host ""
    
    # Run build in WSL
    wsl bash -c "cd '$wslPath/android' && ./gradlew assembleRelease"
    
    if ($LASTEXITCODE -eq 0) {
        $apkPath = Join-Path (Get-Location) "android\app\build\outputs\apk\release\app-release.apk"
        Write-Host ""
        Write-Host "Build successful!" -ForegroundColor Green
        Write-Host "APK location: $apkPath" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To install on device:" -ForegroundColor Yellow
        Write-Host "  cd android" -ForegroundColor Gray
        Write-Host "  ./gradlew installRelease" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "Build failed. Check the error messages above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "WSL is not available. You need hermesc.exe for Windows builds." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPTION 1 - Install WSL (Recommended):" -ForegroundColor Cyan
    Write-Host "  1. Run in PowerShell (as Administrator):" -ForegroundColor White
    Write-Host "     wsl --install" -ForegroundColor Gray
    Write-Host "  2. Restart your computer" -ForegroundColor White
    Write-Host "  3. Run this script again: .\scripts\build-release-windows.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 2 - Get hermesc.exe:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\scripts\ensure-hermesc-windows.ps1" -ForegroundColor White
    Write-Host "  2. Build hermesc from source (requires Visual Studio + CMake)" -ForegroundColor White
    Write-Host "     See: https://github.com/facebook/hermes/blob/main/doc/BuildingAndRunning.md" -ForegroundColor Gray
    Write-Host "  3. Place hermesc.exe in the folder shown by the script" -ForegroundColor White
    Write-Host "  4. Run:" -ForegroundColor White
    Write-Host "     cd android" -ForegroundColor Gray
    Write-Host "     ./gradlew assembleRelease" -ForegroundColor Gray
    Write-Host ""
    Write-Host "OPTION 3 - Build on a Mac/Linux machine:" -ForegroundColor Cyan
    Write-Host "  The build works automatically on Mac/Linux." -ForegroundColor White
    Write-Host ""
    exit 1
}
