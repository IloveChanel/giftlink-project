# GiftLink Deployment - Quick Reference Card

## 🚀 Quick Deployment Commands

### 1. Set Namespace
```powershell
$MY_NAMESPACE = (ibmcloud cr namespaces | Select-String "sn-labs-").ToString().Trim()
$env:MY_NAMESPACE = $MY_NAMESPACE
echo $MY_NAMESPACE
```

### 2. Deploy MongoDB
```powershell
kubectl apply -f deploymongo.yml
kubectl get deployments
```

### 3. Deploy Backend
```powershell
cd giftlink-backend
docker build . -t "us.icr.io/$MY_NAMESPACE/giftapp"
docker push "us.icr.io/$MY_NAMESPACE/giftapp"

# Update deployment.yml image name, then:
kubectl apply -f deployment.yml
kubectl get pods
```

### 4. Port Forward Backend
**Open NEW terminal:**
```powershell
kubectl port-forward deployment.apps/giftapp 3060:3060
```

### 5. Build Frontend
```powershell
cd ..\giftlink-frontend
npm install
npm run build
```

### 6. Deploy Frontend Container
```powershell
cd ..\giftwebsite
docker build . -t "us.icr.io/$MY_NAMESPACE/giftwebsite"
docker push "us.icr.io/$MY_NAMESPACE/giftwebsite"
```

### 7. Deploy to Code Engine
```powershell
ibmcloud ce application create --name giftwebsite --image us.icr.io/$MY_NAMESPACE/giftwebsite --registry-secret icr-secret --port 9000
```

## 📋 Quick Status Checks

```powershell
# Check all deployments
kubectl get deployments

# Check all pods
kubectl get pods

# Check services
kubectl get services

# View backend logs
kubectl logs -f deployment/giftapp

# View MongoDB logs
kubectl logs -f deployment/mongodb-deployment

# Check images in registry
ibmcloud cr images
```

## 🔧 Quick Fixes

### Port Already Allocated
Edit `deploymongo.yml`: Change `nodePort: 30007` to `nodePort: 30008`

### Image Name Fix
```powershell
# In deployment.yml, replace:
# us.icr.io/sn-labs-<YOUR_USERNAME>/giftapp
# with:
# us.icr.io/$MY_NAMESPACE/giftapp
```

### Pod Not Starting
```powershell
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Delete and Restart
```powershell
kubectl delete deployment mongodb
kubectl delete deployment giftapp
# Then redeploy
```

## 🌐 Test URLs

- **Backend API**: `http://localhost:3060/api/gifts`
- **Backend Health**: `http://localhost:3060/health`
- **Frontend Local**: `http://localhost:9000`
- **Code Engine**: `<provided-after-deployment>`

## 📸 Screenshots Needed

1. ✅ deployed_landingpage.png
2. ✅ deployed_mainpage.png
3. ✅ registration.png
4. ✅ deployed_loggedin.png
5. ✅ deployed_gift_detail.png
6. ✅ deployed_search_gift.png
7. ✅ backend_deployment.png

**Remember: Address bar must be visible in ALL screenshots!**

## 🔑 Key Files

- `deploymongo.yml` - MongoDB Kubernetes config
- `giftlink-backend/Dockerfile` - Backend container
- `giftlink-backend/deployment.yml` - Backend Kubernetes config
- `giftlink-backend/.env` - Backend environment vars
- `giftwebsite/Dockerfile` - Frontend container
- `giftlink-frontend/.env` - Frontend environment vars

## ⚡ Environment Variables

### Backend (.env)
```
PORT=3060
MONGO_URI=mongodb://mongodb-service:27017/giftlink
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=<backend-url-from-step-4>
```

## 🎯 Submission Items

- [ ] Kubernetes backend URL
- [ ] Code Engine frontend URL
- [ ] 7 screenshots with visible address bars
- [ ] All features tested and working

---

**Pro Tips:**
- Keep port-forward terminal open while testing
- Test backend before building frontend
- Update frontend .env with correct backend URL
- Verify namespace before pushing images
- Take screenshots AFTER everything is working

**For detailed instructions, see:** DEPLOYMENT_GUIDE.md
**For step-by-step checklist, see:** DEPLOYMENT_CHECKLIST.md
