# GiftLink Deployment Quick Start Script for Windows PowerShell
# This script helps you deploy the GiftLink application step by step

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "GiftLink Application Deployment Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check command success
function Check-Status {
    param($message)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $message" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Failed - Please check the error above" -ForegroundColor Red
        return $false
    }
}

# Get namespace
Write-Host "Step 1: Getting your IBM Cloud namespace..." -ForegroundColor Yellow
$namespaces = ibmcloud cr namespaces 2>$null
$MY_NAMESPACE = $namespaces | Select-String -Pattern "sn-labs-" | Select-Object -First 1
if (-not $MY_NAMESPACE) {
    Write-Host "✗ Error: Could not find namespace. Please ensure you're logged in to IBM Cloud." -ForegroundColor Red
    exit 1
}
$MY_NAMESPACE = $MY_NAMESPACE.ToString().Trim()
$env:MY_NAMESPACE = $MY_NAMESPACE
Write-Host "✓ Namespace found: $MY_NAMESPACE" -ForegroundColor Green
Write-Host ""

# Deploy MongoDB
Write-Host "Step 2: Deploying MongoDB to Kubernetes..." -ForegroundColor Yellow
kubectl apply -f deploymongo.yml
if (-not (Check-Status "MongoDB deployment created")) { exit 1 }
Write-Host ""

Write-Host "Waiting for MongoDB to be ready (this may take a minute)..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=120s deployment/mongodb-deployment 2>$null
if (-not (Check-Status "MongoDB is ready")) {
    Write-Host "Note: MongoDB might still be starting. Check with: kubectl get pods" -ForegroundColor Yellow
}
Write-Host ""

# Build and push backend
Write-Host "Step 3: Building and pushing backend Docker image..." -ForegroundColor Yellow
Set-Location giftlink-backend
docker build . -t "us.icr.io/$MY_NAMESPACE/giftapp"
if (-not (Check-Status "Backend image built")) { exit 1 }

docker push "us.icr.io/$MY_NAMESPACE/giftapp"
if (-not (Check-Status "Backend image pushed")) { exit 1 }
Write-Host ""

# Update deployment.yml with namespace
Write-Host "Step 4: Updating deployment configuration..." -ForegroundColor Yellow
$deploymentContent = Get-Content deployment.yml -Raw
$deploymentContent = $deploymentContent -replace 'us.icr.io/sn-labs-<YOUR_USERNAME>/giftapp', "us.icr.io/$MY_NAMESPACE/giftapp"
Set-Content deployment.yml -Value $deploymentContent
Write-Host "✓ Configuration updated" -ForegroundColor Green
Write-Host ""

# Deploy backend
Write-Host "Step 5: Deploying backend to Kubernetes..." -ForegroundColor Yellow
kubectl apply -f deployment.yml
if (-not (Check-Status "Backend deployment created")) { exit 1 }
Write-Host ""

Write-Host "Waiting for backend to be ready (this may take a minute)..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=120s deployment/giftapp 2>$null
if (-not (Check-Status "Backend is ready")) {
    Write-Host "Note: Backend might still be starting. Check with: kubectl get pods" -ForegroundColor Yellow
}
Write-Host ""

# Instructions for port forwarding
Write-Host "Step 6: Setting up port forwarding for backend..." -ForegroundColor Yellow
Write-Host "Open a NEW PowerShell terminal and run this command:" -ForegroundColor Cyan
Write-Host "kubectl port-forward deployment.apps/giftapp 3060:3060" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter when port forwarding is active..." -ForegroundColor Yellow
Read-Host

# Build frontend
Write-Host "Step 7: Building frontend application..." -ForegroundColor Yellow
Set-Location ../giftlink-frontend
npm install
if (-not (Check-Status "Frontend dependencies installed")) { exit 1 }

npm run build
if (-not (Check-Status "Frontend built")) { exit 1 }
Write-Host ""

# Build and push frontend container
Write-Host "Step 8: Building and pushing frontend Docker image..." -ForegroundColor Yellow
Set-Location ../giftwebsite
docker build . -t "us.icr.io/$MY_NAMESPACE/giftwebsite"
if (-not (Check-Status "Frontend image built")) { exit 1 }

docker push "us.icr.io/$MY_NAMESPACE/giftwebsite"
if (-not (Check-Status "Frontend image pushed")) { exit 1 }
Write-Host ""

# Deploy to Code Engine
Write-Host "Step 9: Deploying to IBM Code Engine..." -ForegroundColor Yellow
Write-Host "Run this command in the Code Engine CLI:" -ForegroundColor Cyan
Write-Host "ibmcloud ce application create --name giftwebsite --image us.icr.io/$env:SN_ICR_NAMESPACE/giftwebsite --registry-secret icr-secret --port 9000" -ForegroundColor White
Write-Host ""
Write-Host "Or if using your own namespace:" -ForegroundColor Cyan
Write-Host "ibmcloud ce application create --name giftwebsite --image us.icr.io/$MY_NAMESPACE/giftwebsite --registry-secret icr-secret --port 9000" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Deployment Steps Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy the frontend to Code Engine using the command above" -ForegroundColor White
Write-Host "2. Access your application using the provided URL" -ForegroundColor White
Write-Host "3. Take required screenshots for submission" -ForegroundColor White
Write-Host ""
Write-Host "To check deployment status:" -ForegroundColor Yellow
Write-Host "  kubectl get deployments" -ForegroundColor White
Write-Host "  kubectl get pods" -ForegroundColor White
Write-Host "  kubectl get services" -ForegroundColor White
Write-Host ""

Set-Location ..
