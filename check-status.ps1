# GiftLink Project Status Checker
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GiftLink Project Readiness Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$missing = @()
$warnings = @()

# Check Backend Files
Write-Host "Checking Backend..." -ForegroundColor Yellow
if (Test-Path "giftlink-backend/app.js") {
    Write-Host "  OK app.js found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING app.js" -ForegroundColor Red
    $missing += "giftlink-backend/app.js"
}

if (Test-Path "giftlink-backend/Dockerfile") {
    Write-Host "  OK Dockerfile found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING Dockerfile" -ForegroundColor Red
    $missing += "giftlink-backend/Dockerfile"
}

if (Test-Path "giftlink-backend/deployment.yml") {
    Write-Host "  OK deployment.yml found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING deployment.yml" -ForegroundColor Red
    $missing += "giftlink-backend/deployment.yml"
}

if (Test-Path "giftlink-backend/.env") {
    Write-Host "  OK .env found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING .env (CRITICAL)" -ForegroundColor Red
    $missing += "giftlink-backend/.env"
}

if (Test-Path "giftlink-backend/package.json") {
    Write-Host "  OK package.json found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING package.json" -ForegroundColor Red
    $missing += "giftlink-backend/package.json"
}

Write-Host ""

# Check Frontend Files
Write-Host "Checking Frontend..." -ForegroundColor Yellow
if (Test-Path "giftlink-frontend/.env") {
    Write-Host "  OK .env found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING .env (IMPORTANT)" -ForegroundColor Red
    $missing += "giftlink-frontend/.env"
}

if (Test-Path "giftlink-frontend/package.json") {
    Write-Host "  OK package.json found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING package.json" -ForegroundColor Red
    $missing += "giftlink-frontend/package.json"
}

if (Test-Path "giftlink-frontend/build") {
    Write-Host "  OK build folder found" -ForegroundColor Green
}
else {
    Write-Host "  WARNING build folder not found" -ForegroundColor Yellow
    $warnings += "Frontend not built yet"
}

Write-Host ""

# Check giftwebsite
Write-Host "Checking giftwebsite..." -ForegroundColor Yellow
if (Test-Path "giftwebsite/Dockerfile") {
    Write-Host "  OK Dockerfile found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING Dockerfile" -ForegroundColor Red
    $missing += "giftwebsite/Dockerfile"
}

if (Test-Path "giftwebsite/index.js") {
    Write-Host "  OK index.js found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING index.js" -ForegroundColor Red
    $missing += "giftwebsite/index.js"
}

if (Test-Path "giftwebsite/build") {
    Write-Host "  OK build folder found" -ForegroundColor Green
}
else {
    Write-Host "  WARNING build folder not found" -ForegroundColor Yellow
    $warnings += "Frontend build not copied to giftwebsite yet"
}

Write-Host ""

# Check MongoDB deployment
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
if (Test-Path "deploymongo.yml") {
    Write-Host "  OK deploymongo.yml found" -ForegroundColor Green
}
else {
    Write-Host "  MISSING deploymongo.yml" -ForegroundColor Red
    $missing += "deploymongo.yml"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($missing.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "All files present! Ready to deploy!" -ForegroundColor Green
}
else {
    if ($missing.Count -gt 0) {
        Write-Host "MISSING FILES:" -ForegroundColor Red
        foreach ($item in $missing) {
            Write-Host "  - $item" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "WARNINGS:" -ForegroundColor Yellow
        foreach ($item in $warnings) {
            Write-Host "  - $item" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "To fix: Copy .env.example files to .env and configure them" -ForegroundColor Cyan
Write-Host ""
