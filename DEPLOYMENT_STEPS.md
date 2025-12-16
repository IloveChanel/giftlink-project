# GiftLink Deployment Guide

## Prerequisites
Before starting, ensure you're in the IBM Cloud Code Engine lab environment (not your local Windows machine).

## Step-by-Step Deployment Instructions

### 1. Clean Up Previous Sessions (if any)

```bash
# Check for existing deployments
kubectl get deployments | grep sn-labs-$USERNAME

# Delete if exists
kubectl delete deployment mongodb
kubectl delete deployment giftapp

# Check for existing images
ibmcloud cr images

# Delete if exists
ibmcloud cr image-rm us.icr.io/sn-labs-$USERNAME/mongodb:latest && docker rmi us.icr.io/sn-labs-$USERNAME/mongodb:latest
ibmcloud cr image-rm us.icr.io/sn-labs-$USERNAME/giftapp:latest && docker rmi us.icr.io/sn-labs-$USERNAME/giftapp:latest
```

### 2. Clone Your Repository

```bash
cd /home/project
git clone https://github.com/IloveChanel/giftlink-project.git
cd giftlink-project
```

### 3. Deploy MongoDB on Kubernetes

```bash
# Apply MongoDB deployment
kubectl apply -f deploymongo.yml

# Check deployment status
kubectl get deployments
```

Wait until MongoDB is ready (1/1 READY).

### 4. Set Up and Deploy Backend

```bash
cd giftlink-backend

# Export your namespace
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE

# Build Docker image
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp

# Push to IBM Container Registry
docker push us.icr.io/$MY_NAMESPACE/giftapp

# Update deployment.yml with your actual image name
# Replace <YOUR_USERNAME> in deployment.yml with your actual namespace

# Apply deployment
kubectl apply -f deployment.yml

# Port forward to test
kubectl port-forward deployment.apps/giftapp 3060:3060
```

In a new terminal:
```bash
# Test the backend
curl http://localhost:3060/api/gifts
```

Copy the full URL (without /api/gifts) for the frontend configuration.

### 5. Set Up Frontend Build Environment

```bash
cd /home/project/giftlink-project

# Create giftwebsite directory (should already exist from git clone)
cd giftlink-frontend

# Update .env file with your backend URL
# Edit REACT_APP_BACKEND_URL to point to your backend URL from step 4

# Install dependencies
npm install

# Update package.json to add postbuild script
# Add this line in scripts section after "build":
# "postbuild": "cp -r build ../giftwebsite/",

# Build the frontend
npm run build
```

### 6. Deploy Frontend to Kubernetes

```bash
cd ../giftwebsite

# Verify build files are copied
ls build/

# Export namespace again
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE

# Build Docker image
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite

# Push to registry
docker push us.icr.io/$MY_NAMESPACE/giftwebsite

# Test locally first
docker run -p 9000:9000 us.icr.io/$MY_NAMESPACE/giftwebsite
```

Access via Skills Network Toolbox > OTHER > Launch Application > Port 9000 > Suffix: /home.html

### 7. Deploy Frontend to Code Engine

```bash
# Start Code Engine (use the UI to create project if needed)
# Once Code Engine CLI is ready:

ibmcloud ce application create --name giftwebsite --image us.icr.io/${SN_ICR_NAMESPACE}/giftwebsite --registry-secret icr-secret --port 9000
```

Copy the generated URL for your submission.

## Screenshots Required

1. **backend_deployment.png** - Terminal showing MongoDB and backend deployments ready
2. **deployed_landingpage.png** - Landing page with URL visible
3. **deployed_mainpage.png** - Main gifts page with URL visible
4. **registration.png** - Registration form filled out
5. **deployed_loggedin.png** - Home page with logged-in username
6. **deployed_gift_detail.png** - Gift detail page
7. **deployed_search_gift.png** - Search results for "Older gifts in Living room"

## Important Notes

- Ensure address bar is visible in all screenshots
- Use the same URL (from Code Engine deployment) in all screenshots
- Update .env files with correct URLs before building
- Wait for pods to be ready before testing
- If port 30007 is taken, change to 30008 in deploymongo.yml

## Troubleshooting

```bash
# Check pod status
kubectl get pods

# Describe pod for details
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check Code Engine apps
ibmcloud ce app list

# Get Code Engine app details
ibmcloud ce app get --name giftwebsite
```
