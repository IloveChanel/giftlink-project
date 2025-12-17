# GiftLink Submission Guide

## GitHub URLs for Submission

Replace `IloveChanel` with your GitHub username in all URLs below:

### Task 1: User Story Template
```
https://github.com/IloveChanel/giftlink-project/blob/main/.github/ISSUE_TEMPLATE/user-story.md
```

### Task 3: MongoDB Connection (db.js)
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/models/db.js
```

### Task 4: Gift Routes with Database Connection
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/routes/giftRoutes.js
```

### Task 5: Gift Routes with "/" and "/:id"
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/giftRoutes.js
```

### Task 6: Search Routes with Category Filter
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/searchRoutes.js
```

### Task 7: App.js with /api/search Route
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/app.js
```

### Task 8: Sentiment with Natural Package Import
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/sentiment/index.js
```

### Task 9: RegisterPage with Fetch
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-frontend/src/components/RegisterPage.js
```

### Task 10: LoginPage with Headers
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-frontend/src/components/LoginPage.js
```

### Task 11: AuthRoutes with findOne()
```
https://github.com/IloveChanel/giftlink-project/blob/main/giftlink-backend/routes/authRoutes.js
```

---

## Screenshots Required

### In IBM Skills Network Lab - Take These Screenshots:

**IMPORTANT:** Address bar MUST be visible in ALL screenshots!

1. **backend_deployment.png**
   - Run: `kubectl get deployments`
   - Show MongoDB and giftapp both READY

2. **deployed_landingpage.png**
   - Open Code Engine URL
   - Show landing page with "GiftLink" title
   - Address bar visible

3. **deployed_mainpage.png**
   - Click "Get Started" or "Login"
   - Should show main gifts page
   - Address bar visible

4. **registration.png**
   - Fill out registration form:
     - First Name: Test
     - Last Name: User
     - Email: test@example.com
     - Password: password123
   - Take screenshot BEFORE clicking Register
   - Address bar visible

5. **deployed_loggedin.png**
   - After successful login
   - Should show "Welcome, [FirstName]!" in navbar
   - Address bar visible

6. **deployed_gift_detail.png**
   - Click on any gift card
   - Shows gift details page
   - Address bar visible

7. **deployed_search_gift.png**
   - Click Search
   - Search for: "Older gifts"
   - Category: "Living Room"
   - Show search results
   - Address bar visible

8. **ci-cd.png** (Task 18)
   - Go to GitHub repository
   - Click "Actions" tab
   - Show successful workflow run
   - Green checkmark visible

---

## MongoDB Data Import (Task 2)

### To Import 16 Documents:

In your IBM Lab terminal:

```bash
cd /home/project/giftlink-project/giftlink-backend
npm install
node seedData.js
```

### To Verify Import:

```bash
# Connect to MongoDB pod
kubectl exec -it $(kubectl get pods -l app=mongodb -o name | head -n 1) -- mongosh

# In MongoDB shell:
use giftlink
db.gifts.count()  # Should show 16
db.gifts.find().pretty()  # Show all gifts
exit
```

### Take Screenshot:
- Run: `db.gifts.count()` in MongoDB shell
- Should display: `16`
- Save as: **mongodb_import.png**

---

## URLs to Submit

After deployment, note these URLs:

### Kubernetes Backend URL:
```
https://[username]-3000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai
```

### Code Engine Frontend URL:
```
https://giftwebsite.[random].us-south.codeengine.appdomain.cloud
```

---

## Deployment Commands Summary

### Quick Deploy (Run in IBM Lab):
```bash
cd /home/project
curl -o deploy.sh https://raw.githubusercontent.com/IloveChanel/giftlink-project/main/COMPLETE_DEPLOY.sh
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy:
```bash
# 1. Clone repo
cd /home/project
git clone https://github.com/IloveChanel/giftlink-project.git
cd giftlink-project

# 2. Deploy MongoDB
kubectl apply -f deploymongo.yml

# 3. Deploy Backend
cd giftlink-backend
export MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs- | head -n 1)
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp
docker push us.icr.io/$MY_NAMESPACE/giftapp
kubectl apply -f deployment.yml

# 4. Port forward
kubectl port-forward deployment.apps/giftapp 3000:3000 &

# 5. Build frontend (replace BACKEND_URL)
cd ../giftlink-frontend
echo "REACT_APP_BACKEND_URL=YOUR_BACKEND_URL" > .env
npm install
npm run build

# 6. Deploy to Code Engine
cd ../giftwebsite
docker build . -t us.icr.io/$MY_NAMESPACE/giftwebsite
docker push us.icr.io/$MY_NAMESPACE/giftwebsite
ibmcloud ce application create --name giftwebsite \
  --image us.icr.io/$MY_NAMESPACE/giftwebsite \
  --registry-secret icr-secret \
  --port 9000
```

---

## Checklist Before Submission

- [ ] All 18 tasks completed
- [ ] User story template created with 8+ stories (labels: new, icebox, technical debt, backlog)
- [ ] MongoDB seeded with 16 documents
- [ ] All GitHub URLs verified and accessible
- [ ] All 8 screenshots taken with address bar visible
- [ ] CI/CD workflow running successfully
- [ ] Both URLs (Kubernetes + Code Engine) working
- [ ] Tested all pages: Landing, Login, Register, Main, Detail, Search

---

## Common Issues

### Port Forwarding Issues:
```bash
pkill -f "port-forward"
kubectl port-forward deployment.apps/giftapp 3000:3000
```

### Backend Not Responding:
```bash
kubectl get pods
kubectl logs -l app=giftapp
```

### Frontend Build Fails:
```bash
cd giftlink-frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Code Engine Not Ready:
```bash
ibmcloud ce app get --name giftwebsite
# Wait 2-3 minutes, then try again
```

---

## Support

If you encounter issues:
1. Check pod logs: `kubectl logs <pod-name>`
2. Verify deployments: `kubectl get deployments`
3. Check Code Engine: `ibmcloud ce app list`
4. Restart port forwarding if backend URL not working
