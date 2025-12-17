# GiftLink Deployment Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] IBM Cloud CLI installed and configured
- [ ] Docker installed and running
- [ ] kubectl CLI installed and configured
- [ ] Kubernetes cluster access verified
- [ ] IBM Cloud Container Registry access verified
- [ ] Node.js and npm installed

### Clean Previous Deployments
- [ ] Checked for existing deployments: `kubectl get deployments`
- [ ] Deleted old MongoDB deployment (if exists)
- [ ] Deleted old giftapp deployment (if exists)
- [ ] Checked Container Registry: `ibmcloud cr images`
- [ ] Deleted old images (if exists)
- [ ] Verified namespace: `ibmcloud cr namespaces`

## Deployment Tasks

### Part 1: MongoDB Deployment
- [ ] Applied MongoDB deployment: `kubectl apply -f deploymongo.yml`
- [ ] Verified MongoDB is running: `kubectl get deployments`
- [ ] MongoDB pods are ready (READY 1/1)
- [ ] Screenshot: MongoDB service running

### Part 2: Backend Deployment
- [ ] Navigated to giftlink-backend directory
- [ ] Updated .env file with correct MongoDB URI
- [ ] Set JWT_SECRET in .env file
- [ ] Set namespace variable: `$MY_NAMESPACE`
- [ ] Built backend Docker image
- [ ] Pushed backend image to Container Registry
- [ ] Updated deployment.yml with correct image name
- [ ] Applied backend deployment: `kubectl apply -f deployment.yml`
- [ ] Verified backend is running: `kubectl get deployments`
- [ ] Backend pods are ready (READY 2/2)
- [ ] Started port forwarding: `kubectl port-forward deployment.apps/giftapp 3060:3060`
- [ ] Tested backend API: `curl http://localhost:3060/api/gifts`
- [ ] Backend returns JSON response
- [ ] Saved backend URL for frontend configuration
- [ ] Screenshot: Backend deployment running in terminal

### Part 3: Frontend Build
- [ ] Navigated to giftlink-frontend directory
- [ ] Updated .env with backend URL
- [ ] Installed dependencies: `npm install`
- [ ] Built React app: `npm run build`
- [ ] Verified build files copied to ../giftwebsite/build
- [ ] No build errors

### Part 4: Frontend Containerization
- [ ] Navigated to giftwebsite directory
- [ ] Verified Dockerfile exists
- [ ] Verified index.js exists
- [ ] Verified package.json exists
- [ ] Built frontend Docker image
- [ ] Pushed frontend image to Container Registry
- [ ] Tested locally: `docker run -p 9000:9000 us.icr.io/$MY_NAMESPACE/giftwebsite`
- [ ] Verified website loads on port 9000

### Part 5: Code Engine Deployment
- [ ] Started Code Engine CLI
- [ ] Code Engine environment is active
- [ ] Deployed to Code Engine: `ibmcloud ce application create --name giftwebsite...`
- [ ] Deployment completed successfully
- [ ] Received public URL for Code Engine app
- [ ] Saved Code Engine URL for submission
- [ ] Verified website loads on Code Engine URL

## Testing Checklist

### Backend Testing
- [ ] Backend health check responds: `/health`
- [ ] Get all gifts endpoint works: `/api/gifts`
- [ ] Get specific gift works: `/api/gifts/:id`
- [ ] Search endpoint works (if implemented): `/api/search`

### Frontend Testing
- [ ] Landing page loads correctly
- [ ] Navigation works
- [ ] "Get Started" button works
- [ ] Main page displays gifts
- [ ] User registration form displays
- [ ] Login functionality works
- [ ] Gift details page works
- [ ] Search functionality works

## Screenshot Requirements

### Required Screenshots (Address Bar Must Be Visible!)
- [ ] **deployed_landingpage.png** - Landing page with address bar
- [ ] **deployed_mainpage.png** - Main page with gifts after "Get Started"
- [ ] **registration.png** - Registration form with user details entered
- [ ] **deployed_loggedin.png** - Home page showing logged-in username
- [ ] **deployed_gift_detail.png** - Individual gift detail page
- [ ] **deployed_search_gift.png** - Search results for "Older gifts in Living room category"
- [ ] **backend_deployment.png/jpg** - Terminal showing MongoDB and backend deployments

### Screenshot Verification
- [ ] All screenshots have visible address bar
- [ ] Address bar shows correct URL (matches submission)
- [ ] Screenshots are clear and readable
- [ ] All required functionality is demonstrated
- [ ] Files are saved with correct names

## Submission Checklist

### URLs to Submit
- [ ] Kubernetes cluster URL (backend) copied
- [ ] Code Engine URL (frontend) copied
- [ ] Both URLs verified and working

### Files to Submit
- [ ] deployed_landingpage.png
- [ ] deployed_mainpage.png
- [ ] registration.png
- [ ] deployed_loggedin.png
- [ ] deployed_gift_detail.png
- [ ] deployed_search_gift.png
- [ ] backend_deployment.png (or .jpg)

### Final Verification
- [ ] All screenshots taken and saved
- [ ] All URLs documented
- [ ] Application fully functional
- [ ] Backend API responding correctly
- [ ] Frontend connects to backend
- [ ] All features tested
- [ ] Ready to submit

## Troubleshooting Reference

### If MongoDB Won't Start
```powershell
kubectl get pods | grep mongodb
kubectl describe pod <mongodb-pod-name>
kubectl logs <mongodb-pod-name>
```

### If Backend Won't Start
```powershell
kubectl get pods | grep giftapp
kubectl describe pod <giftapp-pod-name>
kubectl logs <giftapp-pod-name>
```

### If Port Already Allocated
Edit deploymongo.yml and change nodePort from 30007 to 30008

### If Image Push Fails
```powershell
ibmcloud login
ibmcloud cr login
ibmcloud cr namespaces
```

### If Frontend Build Fails
```powershell
cd giftlink-frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

## Notes Section

### Important Information
- Namespace: _________________
- Backend URL: _________________
- Code Engine URL: _________________
- JWT Secret Used: _________________

### Issues Encountered
- Issue 1: _________________
- Resolution: _________________

- Issue 2: _________________
- Resolution: _________________

### Deployment Time Log
- Started: _________________
- MongoDB deployed: _________________
- Backend deployed: _________________
- Frontend built: _________________
- Code Engine deployed: _________________
- Completed: _________________
- Total Time: _________________

---

**Status: [ ] Not Started  [ ] In Progress  [ ] Completed**

Last Updated: _________________
