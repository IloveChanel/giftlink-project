# GiftLink Application - Kubernetes and IBM Code Engine Deployment Guide

## Prerequisites Checklist
- [ ] Kubernetes cluster access configured
- [ ] IBM Cloud CLI installed and configured
- [ ] Docker installed
- [ ] kubectl CLI installed
- [ ] IBM Cloud Container Registry access

## Part 1: Clean Up Previous Deployments

### 1.1 Check and Remove Existing Kubernetes Deployments
```bash
# Check for existing deployments
kubectl get deployments | grep sn-labs-$USERNAME

# If mongodb deployment exists, delete it
kubectl delete deployment mongodb

# If giftapp deployment exists, delete it
kubectl delete deployment giftapp
```

### 1.2 Check and Remove Existing Container Images
```bash
# List existing images
ibmcloud cr images

# If mongodb image exists, delete it
ibmcloud cr image-rm us.icr.io/sn-labs-$USERNAME/mongodb:latest
docker rmi us.icr.io/sn-labs-$USERNAME/mongodb:latest

# If giftapp image exists, delete it
ibmcloud cr image-rm us.icr.io/sn-labs-$USERNAME/giftapp:latest
docker rmi us.icr.io/sn-labs-$USERNAME/giftapp:latest
```

### 1.3 Get Your Namespace
```bash
# Method 1
oc project

# Method 2
ibmcloud cr namespaces
# Look for the one in format: sn-labs-$USERNAME
```

## Part 2: Deploy MongoDB on Kubernetes

### 2.1 MongoDB Deployment
The `deploymongo.yml` file is already created in the root directory.

```bash
# Apply MongoDB deployment
kubectl apply -f deploymongo.yml
```

**Note:** If you get an error "port already allocated", edit `deploymongo.yml` and change `nodePort` from `30007` to `30008`.

### 2.2 Verify MongoDB Deployment
```bash
# Check deployment status
kubectl get deployments

# Wait until MongoDB deployment shows READY 1/1
# This may take a minute or two
```

## Part 3: Deploy Backend Server

### 3.1 Navigate to Backend Directory
```bash
cd giftlink-backend
```

### 3.2 Configure Environment Variables
Edit the `.env` file (already created) and update:
- `MONGO_URI`: Should be `mongodb://mongodb-service:27017/giftlink`
- `JWT_SECRET`: Change to a secure random string for production

**Current .env contents:**
```
PORT=3060
MONGO_URI=mongodb://mongodb-service:27017/giftlink
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=production
```

### 3.3 Set Your Namespace
```bash
# Export your namespace
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE
```

### 3.4 Build and Push Backend Docker Image
```bash
# Build the Docker image
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp

# Push to IBM Container Registry
docker push us.icr.io/$MY_NAMESPACE/giftapp
```

### 3.5 Update Deployment File
Edit `deployment.yml` and replace `<the-name-of-your-image>` with your actual image:
```yaml
image: us.icr.io/$MY_NAMESPACE/giftapp
```

Or use sed to replace it:
```bash
sed -i "s|us.icr.io/sn-labs-<YOUR_USERNAME>/giftapp|us.icr.io/$MY_NAMESPACE/giftapp|g" deployment.yml
```

### 3.6 Deploy Backend to Kubernetes
```bash
# Apply the deployment
kubectl apply -f deployment.yml

# Wait for pods to be ready (this may take a few minutes)
kubectl get deployments
kubectl get pods

# If you encounter errors, check pod details:
kubectl describe pod <pod-name>
```

### 3.7 Port Forward to Access Backend
```bash
# Forward port 3060
kubectl port-forward deployment.apps/giftapp 3060:3060
```

**Keep this terminal open!**

### 3.8 Test Backend
Open a new terminal and test:
```bash
# Test the backend API
curl http://localhost:3060/api/gifts
```

Or use the Skills Network button:
1. Click "Skills Network" button → "OTHER" → "Launch Application"
2. Enter port: `3060`
3. Append `/api/gifts` to the URL
4. You should see JSON response with gifts data

**Save the base URL (without /api/gifts) for the next steps!**

## Part 4: Deploy Frontend Server

### 4.1 Configure Frontend Environment
Navigate back to project root and edit `giftlink-frontend/.env`:
```bash
cd ..
```

Update the `.env` file with the backend URL you saved from Part 3.8:
```
REACT_APP_BACKEND_URL=<your-backend-url-from-part-3.8>
```

### 4.2 Install Frontend Dependencies and Build
```bash
cd giftlink-frontend

# Install dependencies
npm install

# Build the React app (this will automatically copy to ../giftwebsite/build)
npm run build
```

The `postbuild` script in `package.json` will automatically copy the build files to `../giftwebsite/build`.

## Part 5: Containerize and Deploy Frontend

### 5.1 Navigate to giftwebsite Directory
```bash
cd ../giftwebsite
```

### 5.2 Set Namespace (if not already set)
```bash
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE
```

### 5.3 Build and Push Frontend Docker Image
```bash
# Build the Docker image
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite

# Push to IBM Container Registry
docker push us.icr.io/$MY_NAMESPACE/giftwebsite
```

### 5.4 Test Frontend Locally
```bash
# Run the container
docker run -p 9000:9000 us.icr.io/$MY_NAMESPACE/giftwebsite
```

**Test the website:**
1. Click "Skills Network" button → "OTHER" → "Launch Application"
2. Enter port: `9000`
3. Suffix URL with `/home.html`
4. Test all endpoints and functionality

## Part 6: Deploy Frontend on IBM Code Engine

### 6.1 Start Code Engine
1. Click on Code Engine CLI in your environment
2. Wait for Code Engine setup to complete (progress shown in setup panel)
3. Once active, the CLI will be preconfigured with project and Kubeconfig

### 6.2 Deploy Application on Code Engine
```bash
# Deploy the giftwebsite application
ibmcloud ce application create --name giftwebsite \
  --image us.icr.io/${SN_ICR_NAMESPACE}/giftwebsite \
  --registry-secret icr-secret \
  --port 9000
```

**Note:** This will take a few minutes to complete.

### 6.3 Get Application URL
After deployment completes, Code Engine will provide a public URL. Copy this URL for submission.

## Part 7: Testing and Screenshots

### 7.1 Test the Deployed Application
Access the application using the Code Engine URL and verify all functionality works:
- Landing page loads
- Can view gifts
- User registration works
- Login functionality works
- Gift details display correctly
- Search functionality works

### 7.2 Required Screenshots (with address bar visible)

Take the following screenshots ensuring the address bar is visible and matches the submitted URL:

1. **deployed_landingpage.png** - Landing page
2. **deployed_mainpage.png** - Main page showing gifts after clicking "Get Started"
3. **registration.png** - Registration page with new user details entered
4. **deployed_loggedin.png** - Home page with logged-in username visible
5. **deployed_gift_detail.png** - Detail page of a specific gift
6. **deployed_search_gift.png** - Search results for "Older gifts in Living room category"
7. **backend_deployment.png/jpg** - Terminal showing MongoDB and backend services running

## Part 8: Submission Checklist

- [ ] Copy Kubernetes cluster URL (backend) for submission
- [ ] Copy Code Engine URL (frontend) for submission
- [ ] All 7 screenshots taken with visible address bars
- [ ] Screenshots saved with correct filenames
- [ ] Verified all application functionality works
- [ ] Backend API responding correctly
- [ ] Frontend connects to backend successfully

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB pod status
kubectl get pods | grep mongodb

# View MongoDB logs
kubectl logs <mongodb-pod-name>
```

### Backend Deployment Issues
```bash
# Check backend pods
kubectl get pods | grep giftapp

# View backend logs
kubectl logs <giftapp-pod-name>

# Describe pod for detailed error information
kubectl describe pod <giftapp-pod-name>
```

### Frontend Build Issues
```bash
# If build fails, check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Image Issues
```bash
# List local images
docker images

# Remove an image if needed
docker rmi <image-id>

# Check Container Registry
ibmcloud cr images
```

## Important Notes

1. **Environment Variables**: Make sure to update the `.env` files with correct values before building
2. **JWT Secret**: Change the JWT_SECRET to a secure value in production
3. **Port Forwarding**: Keep the port-forward terminal running while testing
4. **Namespace**: Always verify your namespace before pushing images
5. **Build Directory**: Ensure the React build completes successfully before containerizing
6. **Image Pull Secrets**: The Kubernetes deployment uses `icr` secret for pulling images from IBM Container Registry

## Quick Reference Commands

```bash
# Check all deployments
kubectl get deployments

# Check all pods
kubectl get pods

# Check all services
kubectl get services

# View logs
kubectl logs <pod-name>

# Delete deployment
kubectl delete deployment <deployment-name>

# List images in registry
ibmcloud cr images

# Code Engine application list
ibmcloud ce application list

# Code Engine application logs
ibmcloud ce application logs --name giftwebsite
```

## Files Overview

### Backend Files
- `giftlink-backend/Dockerfile` - Backend container configuration
- `giftlink-backend/deployment.yml` - Kubernetes deployment configuration
- `giftlink-backend/.env` - Environment variables for backend
- `giftlink-backend/app.js` - Main application file

### Frontend Files
- `giftlink-frontend/package.json` - With postbuild script
- `giftlink-frontend/.env` - Backend URL configuration
- `giftwebsite/Dockerfile` - Frontend container configuration
- `giftwebsite/index.js` - Express server for serving React app

### MongoDB Files
- `deploymongo.yml` - MongoDB Kubernetes deployment configuration

---

**Deployment Complete!** Your GiftLink application is now containerized and deployed on both Kubernetes and IBM Code Engine.
