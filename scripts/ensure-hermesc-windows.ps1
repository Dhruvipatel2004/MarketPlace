# Creates the folder where hermesc.exe must be placed for Android release builds on Windows.
# Run from project root: .\scripts\ensure-hermesc-windows.ps1
# Then obtain hermesc.exe (build from Hermes source or use WSL to build the APK) and place it in the created folder.

$dir = Join-Path $PSScriptRoot "..\node_modules\hermes-compiler\hermesc\win64-bin"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "Created: $dir"
} else {
    Write-Host "Exists: $dir"
}

if (-not (Test-Path (Join-Path $dir "hermesc.exe"))) {
    Write-Host ""
    Write-Host "hermesc.exe is not in the folder. To build Android release on Windows:" -ForegroundColor Yellow
    Write-Host "  1. Build hermesc from source (Visual Studio + CMake): see https://github.com/facebook/hermes/tree/main/doc#building-and-running"
    Write-Host "  2. Or build the release APK from WSL (Linux): open the project in WSL and run ./gradlew assembleRelease from android/"
    Write-Host "  3. Place hermesc.exe in: $dir"
    Write-Host ""
} else {
    Write-Host "hermesc.exe found. You can run: cd android && ./gradlew assembleRelease"
}
