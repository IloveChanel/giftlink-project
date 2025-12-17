#!/bin/bash
# Complete GiftLink Deployment Script for IBM Skills Network Lab
# This script follows the exact assignment steps

echo "=========================================="
echo "GiftLink Complete Deployment"
echo "=========================================="
echo ""

# Step 1: Clone repository
echo "Step 1: Cloning repository..."
cd /home/project
rm -rf giftlink-project 2>/dev/null || true
git clone https://github.com/IloveChanel/giftlink-project.git
cd giftlink-project
echo "✓ Repository cloned"
echo ""

# Step 2: Deploy MongoDB
echo "Step 2: Deploying MongoDB..."
kubectl apply -f deploymongo.yml
echo "Waiting for MongoDB to be ready..."
sleep 10
kubectl wait --for=condition=available --timeout=120s deployment/mongodb 2>/dev/null || echo "MongoDB deployment in progress..."
echo "✓ MongoDB deployed"
echo ""

# Step 3: Set up backend
echo "Step 3: Setting up backend..."
cd giftlink-backend

# Export namespace
export MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs- | head -n 1)
echo "Using namespace: $MY_NAMESPACE"

# Create .env file
cat > .env << 'EOF'
MONGO_URI=mongodb://mongodb-service:27017/giftlink
JWT_SECRET=mysecret
PORT=3060
NODE_ENV=production
EOF
echo "✓ .env file created"

# Build backend Docker image
echo "Building backend Docker image..."
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp
echo "✓ Backend image built"

# Push to registry
echo "Pushing backend image to registry..."
docker push us.icr.io/$MY_NAMESPACE/giftapp
echo "✓ Backend image pushed"

# Update deployment.yml
sed -i "s|image: .*|image: us.icr.io/$MY_NAMESPACE/giftapp|g" deployment.yml

# Deploy backend
echo "Deploying backend to Kubernetes..."
kubectl apply -f deployment.yml
echo "Waiting for backend to be ready..."
sleep 15
kubectl wait --for=condition=available --timeout=120s deployment/giftapp 2>/dev/null || echo "Backend deployment in progress..."
echo "✓ Backend deployed"
echo ""

# Step 4: Check deployments
echo "Step 4: Checking deployment status..."
kubectl get deployments
echo ""

# Step 5: Port forward backend
echo "Step 5: Starting port forwarding..."
pkill -f "port-forward" 2>/dev/null || true
sleep 2
kubectl port-forward deployment.apps/giftapp 3000:3000 > /dev/null 2>&1 &
sleep 5
echo "✓ Port forwarding started on 3000"
echo ""

echo "=========================================="
echo "IMPORTANT: Get Your Backend URL"
echo "=========================================="
echo "1. Click 'Skills Network' → OTHER → Launch Application"
echo "2. Enter port: 3000"
echo "3. Add /api/gifts to test"
echo "4. Copy the BASE URL (without /api/gifts)"
echo ""
read -p "Press Enter after copying backend URL, then paste it: " BACKEND_URL
echo ""

# Step 6: Build frontend
echo "Step 6: Building frontend..."
cd ../giftlink-frontend

# Create .env with backend URL
cat > .env << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
EOF
echo "✓ Frontend .env created with: $BACKEND_URL"

# Install dependencies
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps
echo "✓ Dependencies installed"

# Build React app
echo "Building React application..."
npm run build
echo "✓ Frontend built"
echo ""

# Step 7: Set up giftwebsite
echo "Step 7: Setting up giftwebsite..."
cd ../giftwebsite

# Verify build files
if [ -d "build" ]; then
  echo "✓ Build files copied successfully"
else
  echo "Copying build files..."
  cp -r ../giftlink-frontend/build .
  echo "✓ Build files copied"
fi

# Build giftwebsite Docker image
echo "Building giftwebsite Docker image..."
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite
echo "✓ Giftwebsite image built"

# Push to registry
echo "Pushing giftwebsite image to registry..."
docker push us.icr.io/$MY_NAMESPACE/giftwebsite
echo "✓ Giftwebsite image pushed"
echo ""

# Step 8: Deploy to Code Engine
echo "Step 8: Deploying to IBM Code Engine..."
echo "This may take 2-3 minutes..."

# Check if app exists
if ibmcloud ce app get --name giftwebsite &>/dev/null; then
  echo "Updating existing Code Engine app..."
  ibmcloud ce app update --name giftwebsite \
    --image us.icr.io/$MY_NAMESPACE/giftwebsite \
    --port 9000
else
  echo "Creating new Code Engine app..."
  ibmcloud ce application create --name giftwebsite \
    --image us.icr.io/$MY_NAMESPACE/giftwebsite \
    --registry-secret icr-secret \
    --port 9000
fi

echo ""
echo "=========================================="
echo "DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""

# Get Code Engine URL
echo "Your Code Engine URL:"
ibmcloud ce app get --name giftwebsite | grep URL || echo "Run: ibmcloud ce app get --name giftwebsite"
echo ""

echo "Kubernetes Backend URL: $BACKEND_URL"
echo ""

echo "=========================================="
echo "SCREENSHOTS TO TAKE:"
echo "=========================================="
echo ""
echo "1. backend_deployment.png"
echo "   Run: kubectl get deployments"
echo ""
echo "2. deployed_landingpage.png"
echo "   Open Code Engine URL (show address bar)"
echo ""
echo "3. deployed_mainpage.png"
echo "   Click 'Get Started' (show address bar)"
echo ""
echo "4. registration.png"
echo "   Fill registration form (show address bar)"
echo ""
echo "5. deployed_loggedin.png"
echo "   After login, show username (show address bar)"
echo ""
echo "6. deployed_gift_detail.png"
echo "   Click any gift (show address bar)"
echo ""
echo "7. deployed_search_gift.png"
echo "   Search 'Older gifts Living room' (show address bar)"
echo ""
echo "=========================================="
echo ""
echo "To seed MongoDB with 16 documents:"
echo "  cd /home/project/giftlink-project/giftlink-backend"
echo "  npm install"
echo "  node seedData.js"
echo ""
echo "=========================================="
