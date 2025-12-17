#!/bin/bash

# GiftLink Deployment Quick Start Script
# This script helps you deploy the GiftLink application step by step

echo "================================================"
echo "GiftLink Application Deployment Script"
echo "================================================"
echo ""

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo "✓ Success"
    else
        echo "✗ Failed - Please check the error above"
        exit 1
    fi
}

# Get namespace
echo "Step 1: Getting your IBM Cloud namespace..."
export MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
if [ -z "$MY_NAMESPACE" ]; then
    echo "✗ Error: Could not find namespace. Please ensure you're logged in to IBM Cloud."
    exit 1
fi
echo "✓ Namespace found: $MY_NAMESPACE"
echo ""

# Deploy MongoDB
echo "Step 2: Deploying MongoDB to Kubernetes..."
kubectl apply -f deploymongo.yml
check_status
echo ""

echo "Waiting for MongoDB to be ready (this may take a minute)..."
kubectl wait --for=condition=available --timeout=120s deployment/mongodb-deployment
check_status
echo ""

# Build and push backend
echo "Step 3: Building and pushing backend Docker image..."
cd giftlink-backend
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp
check_status
docker push us.icr.io/$MY_NAMESPACE/giftapp
check_status
echo ""

# Update deployment.yml with namespace
echo "Step 4: Updating deployment configuration..."
sed -i "s|us.icr.io/sn-labs-<YOUR_USERNAME>/giftapp|us.icr.io/$MY_NAMESPACE/giftapp|g" deployment.yml
echo "✓ Configuration updated"
echo ""

# Deploy backend
echo "Step 5: Deploying backend to Kubernetes..."
kubectl apply -f deployment.yml
check_status
echo ""

echo "Waiting for backend to be ready (this may take a minute)..."
kubectl wait --for=condition=available --timeout=120s deployment/giftapp
check_status
echo ""

# Get backend URL
echo "Step 6: Setting up port forwarding for backend..."
echo "Run this command in a separate terminal:"
echo "kubectl port-forward deployment.apps/giftapp 3060:3060"
echo ""
echo "Press Enter when port forwarding is active..."
read

# Build frontend
echo "Step 7: Building frontend application..."
cd ../giftlink-frontend
npm install
check_status
npm run build
check_status
echo ""

# Build and push frontend container
echo "Step 8: Building and pushing frontend Docker image..."
cd ../giftwebsite
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite
check_status
docker push us.icr.io/$MY_NAMESPACE/giftwebsite
check_status
echo ""

# Deploy to Code Engine
echo "Step 9: Deploying to IBM Code Engine..."
echo "Run this command:"
echo "ibmcloud ce application create --name giftwebsite --image us.icr.io/$MY_NAMESPACE/giftwebsite --registry-secret icr-secret --port 9000"
echo ""

echo "================================================"
echo "Deployment Steps Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Deploy the frontend to Code Engine using the command above"
echo "2. Access your application using the provided URL"
echo "3. Take required screenshots for submission"
echo ""
echo "To check deployment status:"
echo "  kubectl get deployments"
echo "  kubectl get pods"
echo "  kubectl get services"
echo ""
