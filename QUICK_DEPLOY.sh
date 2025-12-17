#!/bin/bash
# Quick Deployment Script for IBM Skills Network Lab
# This deploys what exists in GitHub and gets basic screenshots

set -e  # Exit on error

echo "=========================================="
echo "GiftLink Quick Deploy - IBM Skills Network"
echo "=========================================="

# Step 1: Clone Repository
echo ""
echo "STEP 1: Cloning repository..."
cd /home/project
rm -rf giftlink-project 2>/dev/null || true
git clone https://github.com/IloveChanel/giftlink-project.git
cd giftlink-project

# Step 2: Get Namespace
echo ""
echo "STEP 2: Setting up IBM Cloud namespace..."
export MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo "Using namespace: $MY_NAMESPACE"

# Step 3: Deploy MongoDB
echo ""
echo "STEP 3: Deploying MongoDB..."
kubectl apply -f deploymongo.yml
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=available --timeout=120s deployment/mongodb

# Step 4: Build and Deploy Backend
echo ""
echo "STEP 4: Building backend Docker image..."
cd giftlink-backend
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp
docker push us.icr.io/$MY_NAMESPACE/giftapp

echo "Updating deployment.yml..."
sed -i "s|image: .*|image: us.icr.io/$MY_NAMESPACE/giftapp|g" deployment.yml

echo "Deploying backend..."
kubectl apply -f deployment.yml
kubectl wait --for=condition=available --timeout=120s deployment/giftapp

# Step 5: Get Backend URL
echo ""
echo "STEP 5: Setting up port forwarding..."
pkill -f "port-forward" 2>/dev/null || true
kubectl port-forward deployment.apps/giftapp 3060:3060 &
sleep 5

# Test backend
echo "Testing backend..."
curl -s http://localhost:3060/api/gifts && echo "" || echo "Backend not responding yet"

# Step 6: Build Frontend
echo ""
echo "STEP 6: Building frontend..."
cd /home/project/giftlink-project/giftlink-frontend

# Install dependencies
npm install

# Build React app
npm run build

# Copy build to giftwebsite
cp -r build ../giftwebsite/

# Step 7: Deploy Frontend Docker Image
echo ""
echo "STEP 7: Building and pushing frontend image..."
cd ../giftwebsite
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite
docker push us.icr.io/$MY_NAMESPACE/giftwebsite

# Step 8: Deploy to Code Engine
echo ""
echo "STEP 8: Deploying to IBM Code Engine..."

# Check if app exists
if ibmcloud ce app get --name giftwebsite &>/dev/null; then
  echo "Updating existing Code Engine app..."
  ibmcloud ce app update --name giftwebsite --image us.icr.io/$MY_NAMESPACE/giftwebsite --port 9000
else
  echo "Creating new Code Engine app..."
  ibmcloud ce application create --name giftwebsite \
    --image us.icr.io/$MY_NAMESPACE/giftwebsite \
    --registry-secret icr-secret \
    --port 9000
fi

# Get Code Engine URL
echo ""
echo "=========================================="
echo "DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Backend: http://localhost:3060/api/gifts"
echo "Frontend URL:"
ibmcloud ce app get --name giftwebsite | grep URL
echo ""
echo "READY FOR SCREENSHOTS:"
echo "1. backend_deployment.png - Run: kubectl get deployments"
echo "2. deployed_landingpage.png - Open frontend URL"
echo "3. deployed_mainpage.png - Same URL (basic page exists)"
echo ""
echo "CANNOT GET (missing code):"
echo "- registration.png (no RegisterPage component)"
echo "- deployed_loggedin.png (no auth system)"
echo "- deployed_gift_detail.png (no detail component)"
echo "- deployed_search_gift.png (search exists but basic)"
echo ""
echo "=========================================="
