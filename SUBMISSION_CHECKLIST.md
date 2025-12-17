# GiftLink Capstone Project - Submission Checklist

## Overview
This document tracks all 18 submission requirements for your GiftLink capstone project.

---

## ❌ MISSING FILES/FEATURES - MUST CREATE

### Task 1: GitHub User Stories (6 pts) ❌ MISSING
**Required:** `.github/ISSUE_TEMPLATE/user-story.md`
**Status:** ❌ Not Found

**What You Need:**
- [ ] Create `.github/ISSUE_TEMPLATE/` directory
- [ ] Create `user-story.md` template file
- [ ] Create at least 8 user stories with labels: new, icebox, technical debt, or backlog

**Submit:** GitHub repository URL

---

### Task 2: MongoDB Import Screenshot ❌ NEED TO VERIFY
**Required:** Screenshot showing 16 documents imported into MongoDB
**Status:** ⚠️ Need to verify

**Command to run in lab:**
```bash
# Check if you have data
mongosh
use giftlink
db.gifts.countDocuments()
```

**Submit:** Screenshot file

---

### Task 3: Database Connection File ❌ MISSING
**Required:** `/models/db.js` with MongoDB connection
**Status:** ❌ File not found in giftlink-backend

**What You Need:**
- [ ] Create `models/` directory in giftlink-backend
- [ ] Create `db.js` with MongoDB connection code

**Submit:** GitHub URL to `/models/db.js`

---

### Task 4: Gift Routes Database Connection ⚠️ NEED TO CHECK
**Required:** `/routes/giftRoutes.js` with database connection
**Status:** ⚠️ File exists, need to verify content

**Location:** `giftlink-backend/giftRoutes.js`

**Submit:** GitHub URL to `/routes/giftRoutes.js`

---

### Task 5: Gift Routes Endpoints ⚠️ NEED TO CHECK
**Required:** Routes for:
- "/" serving /api/gifts
- "/:id" serving /api/gifts/:id

**Status:** ⚠️ File exists, need to verify routes

**Submit:** GitHub URL to `/routes/giftRoutes.js`

---

### Task 6: Search Routes ⚠️ NEED TO CHECK
**Required:** `/routes/searchRoutes.js` with category filter
**Status:** ⚠️ File exists, need to verify content

**Location:** `giftlink-backend/searchRoutes.js`

**Submit:** GitHub URL to `/routes/searchRoutes.js`

---

### Task 7: App.js Search Route ⚠️ NEED TO CHECK
**Required:** `/app.js` with route serving /api/search
**Status:** ⚠️ File exists, need to verify content

**Location:** `giftlink-backend/app.js`

**Submit:** GitHub URL to `/app.js`

---

### Task 8: Sentiment Analysis ❌ MISSING
**Required:** `sentiment/index.js` importing natural npm package
**Status:** ❌ Not found

**What You Need:**
- [ ] Create `sentiment/` directory in giftlink-backend
- [ ] Create `index.js` with sentiment analysis code
- [ ] Import natural npm package

**Submit:** GitHub URL to `sentiment/index.js`

---

### Task 9: Register Page ❌ MISSING
**Required:** `/src/components/RegisterPage/RegisterPage.js` with fetch request
**Status:** ❌ Component not found

**What You Need:**
- [ ] Create `src/components/RegisterPage/` directory in giftlink-frontend
- [ ] Create `RegisterPage.js` with registration logic

**Submit:** GitHub URL to RegisterPage.js

---

### Task 10: Login Page ❌ MISSING
**Required:** `/src/components/LoginPage/LoginPage.js` with headers
**Status:** ❌ Component not found

**What You Need:**
- [ ] Create `src/components/LoginPage/` directory
- [ ] Create `LoginPage.js` with login logic and proper headers

**Submit:** GitHub URL to LoginPage.js

---

### Task 11: Auth Routes ❌ MISSING
**Required:** `/routes/authRoutes.js` with collection.findOne()
**Status:** ❌ File not found

**What You Need:**
- [ ] Create `routes/authRoutes.js` in giftlink-backend
- [ ] Add authentication logic with findOne() method

**Submit:** GitHub URL to `/routes/authRoutes.js`

---

## 📸 SCREENSHOTS NEEDED (Tasks 12-17)

### Task 12: Landing Page Screenshot ⏳ PENDING
**Required:** Landing page with deployment URL visible
**Status:** ⏳ Deployment in progress

**When to take:** After Code Engine deployment completes

---

### Task 13: MainPage Before Login ⏳ PENDING
**Required:** MainPage showing all gifts with deployment URL
**Status:** ⏳ Deployment in progress

---

### Task 14: Register Page Screenshot ⏳ PENDING
**Required:** Register page with user details and deployment URL
**Status:** ⏳ Need RegisterPage component first

---

### Task 15: Logged In User Screenshot ⏳ PENDING
**Required:** Page showing username in navbar with deployment URL
**Status:** ⏳ Need login functionality first

---

### Task 16: Gift Details Screenshot ⏳ PENDING
**Required:** Gift details page with deployment URL
**Status:** ⏳ Need gift details component

---

### Task 17: Search Results Screenshot ⏳ PENDING
**Required:** Search results page with deployment URL
**Status:** ⏳ Need search functionality

---

### Task 18: CI/CD Process Screenshot ✅ LIKELY COMPLETE
**Required:** Successfully run CI/CD process
**Status:** ✅ GitHub Actions workflow exists

**Location:** `.github/workflows/main.yml`

**How to verify:**
1. Go to your GitHub repository
2. Click "Actions" tab
3. Check if workflows are running successfully
4. Take screenshot of successful run

---

## 🎯 PRIORITY ORDER

### HIGH PRIORITY (Blocking Deployment)
1. ❌ Create missing backend files:
   - [ ] `models/db.js` - Database connection
   - [ ] `routes/authRoutes.js` - Authentication
   - [ ] `sentiment/index.js` - Sentiment analysis

2. ❌ Create missing frontend components:
   - [ ] `RegisterPage.js`
   - [ ] `LoginPage.js`
   - [ ] Other UI components

3. ⚠️ Verify existing files have required code:
   - [ ] `giftRoutes.js` - Check routes
   - [ ] `searchRoutes.js` - Check filtering
   - [ ] `app.js` - Check /api/search route

### MEDIUM PRIORITY
4. ❌ Create GitHub user stories template
5. ⚠️ Verify MongoDB has 16 documents

### LOW PRIORITY (After Deployment)
6. ⏳ Take all 6 deployment screenshots
7. ✅ Verify CI/CD is working

---

## 📝 QUICK ACTION ITEMS

### Immediate Next Steps:
```bash
# 1. Check current file contents
cd /home/project/giftlink-backend
cat app.js
cat giftRoutes.js
cat searchRoutes.js

# 2. Check frontend structure
cd /home/project/giftlink-frontend
ls -la src/components/
```

### Files to Create Template:

**db.js Template:**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
```

**authRoutes.js Template:**
```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find user in database
    const user = await collection.findOne({ username });
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user });
});

module.exports = router;
```

---

## 📊 COMPLETION SUMMARY

- ✅ Complete: 1/18 (CI/CD)
- ⚠️ In Progress: 4/18 (Backend files exist, need verification)
- ❌ Missing: 13/18 (Frontend components, models, auth, screenshots)

**Estimated Time to Complete:** 4-6 hours

---

## 🚀 RECOMMENDED WORKFLOW

1. **First**: Verify/fix existing backend files (30 min)
2. **Second**: Create missing backend files (1 hour)
3. **Third**: Create frontend components (2 hours)
4. **Fourth**: Test everything locally (30 min)
5. **Fifth**: Deploy and take screenshots (1 hour)
6. **Sixth**: Create GitHub user stories (30 min)
7. **Finally**: Submit all URLs and screenshots

---

**Last Updated:** December 17, 2025
**Status:** Major components missing - NOT ready for submission yet
