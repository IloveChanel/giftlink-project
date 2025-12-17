# GiftLink Project - Containerized Application

A full-stack gift management application deployed on Kubernetes and IBM Code Engine.

## 🚀 Project Overview

GiftLink is a comprehensive web application that allows users to browse, search, and manage gifts. The application is containerized using Docker and deployed on:
- **Kubernetes** for the backend API and MongoDB database
- **IBM Code Engine** for the frontend React application

## 📁 Project Structure

```
giftlink-project/
├── giftlink-backend/          # Backend API (Node.js + Express)
│   ├── app.js                 # Main application file
│   ├── giftRoutes.js          # Gift routes
│   ├── searchRoutes.js        # Search routes
│   ├── auth.js                # Authentication middleware
│   ├── Dockerfile             # Backend container configuration
│   ├── deployment.yml         # Kubernetes deployment configuration
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
├── giftlink-frontend/         # Frontend React application
│   ├── src/                   # React source files
│   ├── public/                # Static assets
│   ├── .env                   # Frontend environment variables
│   └── package.json           # Frontend dependencies (with postbuild script)
│
├── giftwebsite/               # Express server for serving React build
│   ├── index.js               # Express server
│   ├── Dockerfile             # Frontend container configuration
│   ├── package.json           # Server dependencies
│   └── build/                 # React production build (generated)
│
├── deploymongo.yml            # MongoDB Kubernetes deployment
├── deploy.ps1                 # Windows PowerShell deployment script
├── deploy.sh                  # Bash deployment script
├── DEPLOYMENT_GUIDE.md        # Comprehensive deployment guide
└── README.md                  # This file
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend
- **React** - UI framework
- **Express** - Serving production build
- **Docker** - Containerization

### Deployment
- **Kubernetes** - Container orchestration
- **IBM Cloud Container Registry** - Image storage
- **IBM Code Engine** - Serverless deployment platform
- **Docker** - Container runtime

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] Kubernetes cluster access
- [ ] IBM Cloud CLI installed and configured
- [ ] Docker installed and running
- [ ] kubectl CLI installed
- [ ] IBM Cloud Container Registry access
- [ ] Node.js and npm installed (for local development)

## 🚀 Quick Start Deployment

### Option 1: Using PowerShell Script (Windows)
```powershell
.\deploy.ps1
```

### Option 2: Using Bash Script (Linux/Mac)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 3: Manual Deployment
Follow the comprehensive [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

## 📝 Deployment Steps Summary

1. **Clean up previous deployments**
   ```powershell
   kubectl get deployments
   kubectl delete deployment mongodb
   kubectl delete deployment giftapp
   ```

2. **Deploy MongoDB**
   ```powershell
   kubectl apply -f deploymongo.yml
   ```

3. **Build and deploy backend**
   ```powershell
   cd giftlink-backend
   docker build . -t us.icr.io/$MY_NAMESPACE/giftapp
   docker push us.icr.io/$MY_NAMESPACE/giftapp
   kubectl apply -f deployment.yml
   ```

4. **Build frontend**
   ```powershell
   cd ../giftlink-frontend
   npm install
   npm run build
   ```

5. **Deploy frontend to Code Engine**
   ```powershell
   cd ../giftwebsite
   docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite
   docker push us.icr.io/$MY_NAMESPACE/giftwebsite
   ibmcloud ce application create --name giftwebsite --image us.icr.io/$MY_NAMESPACE/giftwebsite --registry-secret icr-secret --port 9000
   ```

## 🔧 Configuration

### Backend Configuration (.env)
```env
PORT=3060
MONGO_URI=mongodb://mongodb-service:27017/giftlink
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=production
```

### Frontend Configuration (.env)
```env
REACT_APP_BACKEND_URL=<your-backend-url>
```

## 🧪 Testing

### Test Backend API
```bash
# Using port-forward
kubectl port-forward deployment.apps/giftapp 3060:3060

# Test endpoints
curl http://localhost:3060/api/gifts
curl http://localhost:3060/health
```

### Test Frontend
Access the application using the Code Engine URL provided after deployment.

## 📸 Required Screenshots

For submission, capture these screenshots with the address bar visible:

1. `deployed_landingpage.png` - Landing page
2. `deployed_mainpage.png` - Main page showing gifts
3. `registration.png` - User registration page
4. `deployed_loggedin.png` - Logged-in home page
5. `deployed_gift_detail.png` - Gift detail page
6. `deployed_search_gift.png` - Search results
7. `backend_deployment.png` - Terminal showing deployments

## 🐛 Troubleshooting

### Common Issues

**MongoDB connection fails:**
```powershell
kubectl get pods
kubectl logs <mongodb-pod-name>
```

**Backend pods not starting:**
```powershell
kubectl describe pod <giftapp-pod-name>
kubectl logs <giftapp-pod-name>
```

**Image push fails:**
```powershell
ibmcloud cr login
ibmcloud cr namespaces
```

**Port already allocated:**
Edit `deploymongo.yml` and change `nodePort` from `30007` to `30008`.

## 📊 Monitoring

### Check Deployments
```powershell
kubectl get deployments
kubectl get pods
kubectl get services
```

### View Logs
```powershell
# Backend logs
kubectl logs -f deployment/giftapp

# MongoDB logs
kubectl logs -f deployment/mongodb-deployment

# Code Engine logs
ibmcloud ce application logs --name giftwebsite
```

## 🔐 Security Notes

- **JWT Secret**: Change `JWT_SECRET` in production to a secure random string
- **Environment Variables**: Never commit `.env` files to version control
- **MongoDB**: Consider adding authentication for production deployments
- **CORS**: Configure CORS properly for production domains

## 🌐 API Endpoints

### Backend API (Port 3060)
- `GET /` - API status
- `GET /health` - Health check
- `GET /api/gifts` - Get all gifts
- `GET /api/gifts/:id` - Get specific gift
- `POST /api/gifts` - Create new gift
- `GET /api/search` - Search gifts

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Linting**: Automatically checks JavaScript files for code quality
- **Build Testing**: Ensures the React frontend builds successfully
- **Triggers**: Runs on push to main/master branch and on pull requests

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [IBM Cloud Code Engine](https://cloud.ibm.com/docs/codeengine)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## 👥 Contributors

This project is part of the IBM Full Stack Developer Capstone Project.

## 📄 License

This project is for educational purposes.

---

**Need help?** Refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.
