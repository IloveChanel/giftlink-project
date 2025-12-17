# Sample User Stories for GitHub Issues

After pushing to GitHub, create these 8 user stories as Issues with the specified labels:

## Story 1: User Registration (Label: new)
**Title:** As a new user, I need to register an account

**Description:**
**As a** new user  
**I need** to create an account with my personal information  
**So that** I can access the GiftLink platform and post gifts  

### Details and Assumptions
* Users must provide first name, last name, email, and password
* Email must be unique in the system
* Password must be at least 6 characters

### Acceptance Criteria
```gherkin
Given I am on the registration page
When I enter my first name, last name, email, and password
Then my account should be created and I should be logged in automatically
```

---

## Story 2: User Login (Label: new)
**Title:** As a registered user, I need to log in to my account

**Description:**
**As a** registered user  
**I need** to log in with my credentials  
**So that** I can access my account and view gifts  

### Details and Assumptions
* Users login with email and password
* Invalid credentials should show error message
* JWT token should be stored for session management

### Acceptance Criteria
```gherkin
Given I am on the login page
When I enter my valid email and password
Then I should be logged in and redirected to the main page
```

---

## Story 3: View All Gifts (Label: new)
**Title:** As a user, I need to view all available gifts

**Description:**
**As a** logged-in user  
**I need** to see a list of all available gifts  
**So that** I can browse and find gifts I'm interested in  

### Details and Assumptions
* Gifts should display name, category, condition, and age
* Gifts should be shown in a grid layout
* Most recent gifts should appear first

### Acceptance Criteria
```gherkin
Given I am logged in
When I navigate to the main page
Then I should see all available gifts displayed in cards
```

---

## Story 4: View Gift Details (Label: new)
**Title:** As a user, I need to view detailed information about a gift

**Description:**
**As a** logged-in user  
**I need** to view complete details of a specific gift  
**So that** I can decide if I want to request it  

### Details and Assumptions
* Details should include description, category, condition, age, and sentiment
* Sentiment analysis should be displayed with color coding
* User should see who posted the gift

### Acceptance Criteria
```gherkin
Given I am viewing the main gifts page
When I click on a gift card
Then I should see the complete gift details including sentiment analysis
```

---

## Story 5: Search Gifts (Label: backlog)
**Title:** As a user, I need to search for gifts by keywords and filters

**Description:**
**As a** logged-in user  
**I need** to search for gifts using keywords and filters  
**So that** I can quickly find specific items I'm looking for  

### Details and Assumptions
* Search should support text keywords
* Filters should include category and condition
* Results should update dynamically

### Acceptance Criteria
```gherkin
Given I am on the search page
When I enter "Living room" as keyword and select category filter
Then I should see only gifts matching those criteria
```

---

## Story 6: MongoDB Integration (Label: technical debt)
**Title:** As a developer, I need to connect the backend to MongoDB

**Description:**
**As a** developer  
**I need** to integrate MongoDB database with the backend  
**So that** gift and user data can be persistently stored  

### Details and Assumptions
* Use Mongoose ORM for database operations
* Connection string should use environment variables
* Database should be named "giftlink"

### Acceptance Criteria
```gherkin
Given the backend server starts
When the application initializes
Then it should successfully connect to MongoDB
```

---

## Story 7: Sentiment Analysis Feature (Label: icebox)
**Title:** As a user, I need to see sentiment analysis of gift descriptions

**Description:**
**As a** logged-in user  
**I need** to see sentiment analysis of gift descriptions  
**So that** I can understand the quality perception of items  

### Details and Assumptions
* Sentiment should be calculated based on description text
* Results should show positive, negative, or neutral
* Score should be displayed numerically

### Acceptance Criteria
```gherkin
Given I am viewing a gift detail page
When the page loads
Then I should see the sentiment label and score displayed
```

---

## Story 8: JWT Authentication (Label: technical debt)
**Title:** As a developer, I need to implement JWT token authentication

**Description:**
**As a** developer  
**I need** to implement JWT-based authentication  
**So that** user sessions can be securely managed  

### Details and Assumptions
* JWT tokens should expire after 30 days
* Token should be stored in localStorage on frontend
* Protected routes should verify token validity

### Acceptance Criteria
```gherkin
Given a user successfully logs in
When they receive a JWT token
Then they should be able to access protected routes with that token
```

---

## How to Create These Issues in GitHub:

1. Go to your repository: https://github.com/IloveChanel/giftlink-project
2. Click "Issues" tab
3. Click "New Issue"
4. Select "User Story" template
5. Copy content from above for each story
6. Add appropriate label: new, icebox, technical debt, or backlog
7. Click "Submit new issue"
8. Repeat for all 8 stories

## Labels to Create:

Go to Issues → Labels → New Label and create:
- **new** (color: green) - New features to be implemented
- **icebox** (color: blue) - Future features, not current priority
- **technical debt** (color: orange) - Code improvements and refactoring
- **backlog** (color: gray) - Planned but not scheduled
