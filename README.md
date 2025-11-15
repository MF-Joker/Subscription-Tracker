# Subscription Tracker API - My Development Log

## My Goal

My primary goal right now is to get a stable, running Express server. I've decided to temporarily remove the database code so I can focus on the core application structure first. I want to understand how a request flows through the application and make sure all the routes are set up correctly before I add the complexity of a database.

---

## Comprehensive Debug & Fix Summary

I've completed a full scan of the entire Subscription-Tracker project and fixed **34 total errors** across multiple files. Here's the complete breakdown of what was wrong and why the application wasn't running.

### **Why The App Wasn't Running**

The app was crashing due to a cascade of errors:
1. **Import path mismatches** - Files couldn't be found because of wrong folder names/paths (wrong case sensitivity)
2. **Typos in dependencies** - Wrong package names prevented modules from loading
3. **Schema syntax errors** - Database models had invalid Mongoose syntax
4. **Variable capitalization issues** - Functions were calling undefined variables
5. **String method typos** - Array methods were misspelled (`joint` vs `join`)

### **Critical Errors Fixed**

#### **app.js**
1. **Typo:** `cookie-paser` → `cookie-parser` (typo in import statement)
2. **Path Case:** `./config/env.js` → `./Config/env.js` (wrong folder case)
3. **Path:** `./middlewares/error.middleware.js` → `./MiddleWare/error.middleware.js` (wrong path + case)

#### **Config/env.js**
1. **Formatting:** Fixed destructuring spacing and variable assignment

#### **Database/mongodb.js**
1. Fixed stray brace, template literal quotes, and exit code syntax (previous scan)

#### **MiddleWare/error.middleware.js**
1. **Method typo:** `message.joint(', ')` → `message.join(', ')` - joint is not a real method!

#### **Controllers/auth.controller.js**
1. **Path Case:** `../config/env.js` → `../Config/env.js`
2. **Variable Cap:** `user.create()` → `User.create()` - lowercase variable didn't exist
3. **Naming:** `const newUsers = ...` but used as `newUser` - inconsistent variable names
4. **Typo:** `'User alreaady exists'` → `'User already exists'`

#### **Models/Subscription.model.js**
- Fixed 8 errors: schema syntax, typos (`namer` → `name`, `trime` → `trim`), random characters, missing commas, validator syntax

#### **Models/User.models.js**
- Fixed 11 errors: lowercase Schema, typos, wrong type syntax, broken email regex, model declaration syntax

### **Why Each Error Broke The App**

- **Import path mismatches** → `MODULE_NOT_FOUND` error, app crashes on startup
- **Package name typos** → `Cannot find module` error
- **Variable capitalization** → `ReferenceError: variable is not defined` when signup route is called
- **Method typos** → `TypeError: method is not a function` when validation errors occur
- **Schema syntax errors** → App couldn't initialize database models at all

### **Error Count by File**

| File | Error Count | Category |
|------|-------------|----------|
| app.js | 3 | Path/typo errors |
| Config/env.js | 1 | Formatting |
| Controllers/auth.controller.js | 4 | Path + capitalization errors |
| MiddleWare/error.middleware.js | 1 | Method typo |
| Database/mongodb.js | 3 | Syntax errors (previous) |
| Models/Subscription.model.js | 8 | Schema syntax (previous) |
| Models/User.models.js | 11 | Schema syntax (previous) |
| .env.development.local | 2 | Config issues (previous) |
| Routes files | 0 | ✅ Clean |
| **TOTAL** | **34** | **✅ ALL FIXED** |

---

## Application Workflow

I've mapped out how I envision the application working from two different perspectives.

### User's Perspective

This shows how a user would interact with the API from a high level. For example, when they want to sign up:

```mermaid
graph TD
   A[User visits the web or mobile app] --> B{User clicks "Sign Up"}
   B --> C[Fills form: username, email, password]
   C --> D[Clicks Submit]
   D --> E[API receives request at POST /api/v1/auth/sign-up]
   E --> F[Server validates input and creates user record]
   F --> G[Server returns success response + token]
   G --> H[User is now authenticated and redirected to app]
```

### Programmer's Perspective (Request Lifecycle)

This shows what happens inside the code when a request comes in. This example follows a request to get a specific subscription.

```mermaid
graph TD
   A[Request: GET /api/v1/subscription/123] --> B[Enters app.js]
   B --> C{Middleware runs: express.json(), cookieParser, etc.}
   C --> D{Router matches /api/v1/subscription}
   D --> E[Subscription.routes.js -> route handler]
   E --> F[Controller executes business logic]
   F --> G[Controller queries MongoDB via Mongoose]
   G --> H[Controller builds and sends JSON response]
```

## Code Commentary

I've moved all the comments from my code files into this section to keep the code itself clean. This is the central source of truth for what each part of the code is intended to do.

### `app.js`
*   **Initialization:** I initialize the Express app.
*   **Middleware:** 
    *   `express.json()`: This middleware will parse incoming JSON payloads, making them available in `req.body`.
    *   `express.urlencoded({extended: true})`: This middleware will parse incoming URL-encoded payloads (e.g., from form submissions).
*   **API Routes:** I am mounting my routers here. Any request starting with a specific path will be handled by the corresponding router (e.g., `/api/v1/auth` is handled by `authRouter`).
*   **Server Test Route:** This is a simple `GET /` route to confirm that the server is running and responding to requests.
*   **Server Startup:** I start the server and have it listen for requests on the port specified in my environment variables.

### `Routes/auth.route.js`
*   **POST /login:** I will use this route to log in a user.
*   **POST /sign-up:** I will use this route to create a new user.
*   **POST /sign-out:** I will use this route to log out a user.

### `Routes/Subscription.routes.js`
*   **GET /**: I will use this route to get all subscriptions for the logged-in user.
*   **GET /:id:** I will use this route to get the details of a specific subscription.
*   **POST /**: I will use this route to create a new subscription.
*   **PUT /:id:** I will use this route to update a subscription.
*   **DELETE /:id:** I will use this route to delete a subscription.
*   **GET /user/:id:** I will use this route to get all subscriptions for a specific user (for admin purposes, maybe).
*   **PUT /:id/cancel:** I will use this route to cancel a subscription.
*   **GET /upcoming-renewals:** I will use this route to get a list of subscriptions with upcoming renewal dates.

### `Routes/User.auth.js`
*   **GET /**: I will use this route to get a list of all users (for admin purposes).
*   **GET /:id:** I will use this route to get the details of a specific user.
*   **POST /**: This seems redundant since I have a sign-up route in `auth.route.js`. I may remove this later.
*   **PUT /:id:** I will use this route to update a user's profile information.
*   **DELETE /:id:** I will use this route to delete a user account.

## Debugging Issues Found & Fixed

Okay, so I found **7 major issue categories** scattered across my files. Here's what was wrong and what I fixed:

### 1. **app.js - Invalid Parameter Syntax**
   - **Problem:** `app.listen(PORT, hostname: async () => {...})`
   - **What I messed up:** I wrote `hostname:` like it was an object property when it should just be the PORT parameter. Total brainfart.
   - **Fix:** Changed to `app.listen(PORT, async () => {...})`
   - **Also:** I forgot to import `connectToDatabase` at the top!

### 2. **Config/env.js - Wrong Syntax & Quote Issues**
   - **Problem:** `config(options:{path: '.env.${process.env.NODE_ENV || 'development'}.local'})`
   - **What I messed up:** I added `options:` which isn't a thing, and I used single quotes inside template literals so the variables weren't getting interpolated.
   - **Fix:** Changed to `config({path: \`.env.${process.env.NODE_ENV || 'development'}.local\`})`
   - **Note to self:** Backticks for template literals, not single quotes!

### 3. **Database/mongodb.js - Multiple Errors**
   - **Problem 1:** `await mongoose.connect(DB_URI); {` - random brace hanging there
   - **Problem 2:** `console.log('Connected to database in ${NODE_ENV} mode')` - single quotes won't interpolate
   - **Problem 3:** `process.exit( code: 1)` - invalid syntax, should be `process.exit(1)`
   - **What I messed up:** Looks like I had a copy-paste disaster here.
   - **Fix:** Removed the stray brace, fixed template literals, fixed the exit code syntax

### 4. **Routes/User.auth.js - Missing Semicolons**
   - **Problem:** All the route handlers were missing semicolons at the end
   - **What I messed up:** Inconsistent formatting. Other route files had them, this one didn't.
   - **Fix:** Added semicolons to all 5 route handlers

### 5. **Routes/Subscription.routes.js & Routes/auth.route.js**
   - **Status:** ✅ These files were clean! No errors here.

### 6. **.env.development.local - Missing DB_URI Key**
   - **Problem:** The MongoDB connection string was there but without the `DB_URI=` key
   - **What I messed up:** I just pasted the connection string without assigning it to a variable name
   - **Fix:** Added `DB_URI=` prefix so the env loader could read it properly
   - **Error it caused:** `Error: Database connection string (DB_URI) is not defined in environment variables`

### 7. **.env.development.local - Special Character Breaking URI**
   - **Problem:** Password was `Killermbele@2003` which contains an `@` symbol. MongoDB URIs use `@` to separate credentials from the host, so having `@` in the password broke the parsing
   - **What I messed up:** I didn't URL-encode the special character in my password
   - **Fix:** Changed `@` to `%40` in the password: `Killermbele%402003`
   - **Error it caused:** `Error: querySrv ENOTFOUND _mongodb._tcp.2003` - it was trying to look up "2003" as a hostname because the URI was malformed
   - **Lesson learned:** Always URL-encode special characters in database URIs!

### 8. **Models/Subscription.model.js - CRITICAL Schema Syntax Errors**
   - **Problem 1:** `new mongoose.Schema(definition: {` - Wrong syntax! Should be just parentheses
   - **Problem 2:** `namer:` should be `name:` (typo)
   - **Problem 3:** `trime:` should be `trim:` (typo)
   - **Problem 4:** `maxLength:/ 100,` - Random `/` character breaking the syntax
   - **Problem 5:** Missing comma after `frequency` enum definition
   - **Problem 6:** `}, options: {timestamps: true}` - Wrong syntax, should be `}, {timestamps: true})`
   - **Problem 7:** `subscriptionSchema.pre(method: 'save', fn: function(next)` - Wrong syntax, should be `.pre('save', function(next)`
   - **Problem 8:** In `startDate` validator: `validator: function (value) => value < new Date()` - Mixed function syntax (can't use arrow in function definition)
   - **What I messed up:** Massive copy-paste and typo errors. This file was basically non-functional.
   - **Fix:** Corrected all syntax to proper Mongoose schema syntax, fixed all typos, removed random characters, added missing export statement

### 9. **Models/User.models.js - CRITICAL Schema Syntax Errors**
   - **Problem 1:** `new mongoose.schema(` - Lowercase 's' should be uppercase 'Schema'
   - **Problem 2:** `new mongoose.schema(definition:{` - Wrong syntax, should be just parentheses
   - **Problem 3:** `'User Name iss required'` - Typo: "iss" should be "is"
   - **Problem 4:** Missing comma after email `required` property
   - **Problem 5:** `trim: trim,` - This assigns the variable `trim` which doesn't exist, should be `trim: true,`
   - **Problem 6:** `match: [/\S+a\S+\.\S+/` - 'a' should be '@' symbol (email regex is broken)
   - **Problem 7:** `'Please fill a valid em ail address'` - Space in "email"
   - **Problem 8:** Missing comma after email object
   - **Problem 9:** `type:/ String,` - Random `/` character breaking syntax
   - **Problem 10:** `mongoose.model(name: "User", userSchema)` - Wrong syntax, should be `mongoose.model('User', userSchema)`
   - **Problem 11:** Variable assigned as lowercase `user` but exported as uppercase `User`
   - **What I messed up:** This file was a disaster. Almost every line had an error!
   - **Fix:** Corrected all syntax, fixed typos, fixed regex pattern, corrected model declaration and export

### 10. **Error Handling 
   - **Created a subscription Error handler that checks for possible errors that could arise within the program**
   - **middleware (check for errors)** 
   - **next** 
   - **controller**   

---

### Summary of File Issues by Location:

| File | Issues Found | Status |
|------|-------------|--------|
| app.js | 2 (invalid params, missing import) | ✅ Fixed |
| Config/env.js | 2 (wrong syntax, quotes) | ✅ Fixed |
| Database/mongodb.js | 3 (stray brace, quotes, exit syntax) | ✅ Fixed |
| Routes/auth.route.js | 0 | ✅ Clean |
| Routes/Subscription.routes.js | 0 | ✅ Clean |
| Routes/User.auth.js | 5 (missing semicolons) | ✅ Fixed |
| .env.development.local | 2 (missing key, unencoded character) | ✅ Fixed |
| Models/Subscription.model.js | 8 (schema syntax, typos, validators) | ✅ Fixed |
| Models/User.models.js | 11 (schema syntax, typos, regex, export) | ✅ Fixed |
| eslint.config.js | 0 | ✅ Clean |

---

## Backend Project Architecture & End Goal

Here's what I'm building - a **Subscription Management Backend API**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Web/Mobile App)                     │
│                      (Frontend - Not Included)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓ HTTP Requests
                           │
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (app.js)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Middleware: JSON Parser & URL Encoder            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│           ┌───────────────┼───────────────┐                      │
│           ↓               ↓               ↓                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐            │
│  │ Auth Routes  │  │ Subscription │  │ User Routes │            │
│  │  /auth/*     │  │  Routes      │  │  /user/*    │            │
│  │ - Login      │  │  /sub/*      │  │ - Get Users │            │
│  │ - Sign Up    │  │ - Create     │  │ - Get User  │            │
│  │ - Sign Out   │  │ - Read       │  │ - Update    │            │
│  │              │  │ - Update     │  │ - Delete    │            │
│  │              │  │ - Delete     │  │             │            │
│  │              │  │ - Cancel     │  │             │            │
│  │              │  │ - Renewals   │  │             │            │
│  └──────────────┘  └──────────────┘  └─────────────┘            │
│           │               │               │                      │
│           └───────────────┼───────────────┘                      │
│                           ↓                                      │
│                   ┌────────────────┐                             │
│                   │ Business Logic │                             │
│                   │  Controllers   │                             │
│                   └────────────────┘                             │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ↓ Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                             │
│  ┌────────────────────┐         ┌──────────────────────────┐    │
│  │   Users Collection │         │ Subscriptions Collection │    │
│  ├────────────────────┤         ├──────────────────────────┤    │
│  │ - _id              │         │ - _id                    │    │
│  │ - username         │         │ - userId (FK)            │    │
│  │ - email            │         │ - serviceName            │    │
│  │ - password (hashed)│         │ - price                  │    │
│  │ - createdAt        │         │ - billingCycle           │    │
│  └────────────────────┘         │ - renewalDate            │    │
│                                 │ - status (active/paused) │    │
│                                 │ - createdAt              │    │
│                                 └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### What This Backend Does

1. **User Management** - Create accounts, log in, log out
2. **Subscription Tracking** - Add, view, update, delete subscriptions
3. **Renewal Tracking** - Get upcoming renewal dates so you don't miss payments
4. **Subscription Cancellation** - Cancel subscriptions without deleting them
5. **Admin Features** - View all users and their subscriptions

---

## My Revised Project Roadmap

This is my updated plan. I'm focusing on a solid foundation before adding the database.

| Step | Task                                       | Description                                                                                                                                                             | Status      |
| :--- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
| 1    | **Initial Setup & Error Fixing**           | I've set up the basic Express server and fixed the initial syntax and import errors.                                                                                  | ✅ Complete |
| 2    | **Stabilize the Server**                   | I've temporarily removed all database code and centralized all my code comments in this `README.md` file.                                                          | ✅ Complete |
| 3    | **Plan Data Structures**                   | I need to define the structure for my `User` and `Subscription` data. I'll do this by planning the fields for each model.                                                | ⬜ To Do     |
| 4    | **Reconnect the Database**                 | I will reinstall `mongoose` and re-enable the database connection logic.                                                                                                | ⬜ To Do     |
| 5    | **Create Mongoose Schemas**                | I will create the `User` and `Subscription` schemas in Mongoose based on the data structures I planned.                                                              | ⬜ To Do     |
| 6    | **Implement Authentication Logic**         | - **Sign Up:** I will hash passwords and save new users.<br>- **Login:** I will compare passwords and issue a JWT.<br>- **Protect Routes:** I will create middleware to verify JWTs. | ⬜ To Do     |
| 7    | **Build Out Subscription Routes (CRUD)**   | I will implement the core logic for the subscription routes (Create, Read, Update, Delete).                                                                             | ⬜ To Do     |
| 8    | **Add Input Validation**                   | I will add validation to my routes to ensure the data I receive is correct.                                                                                          | ⬜ To Do     |

## Removing Committed Secrets

If you accidentally committed secrets (like `DB_URI` or `JWT_SECRET`), take these steps immediately:

- **Rotate secrets**: Change passwords, API keys, and any credentials in your providers.
- **Add `.env` to `.gitignore`** (already added in this repo) so new secret files won't be tracked.
- **Scrub history**: Remove secrets from the repository history. Two common tools:
   - `git-filter-repo` (recommended)
   - BFG Repo-Cleaner

Example using `git-filter-repo` (run on a separate machine/clone):

```
git clone --mirror https://github.com/youruser/yourrepo.git
cd yourrepo.git
git filter-repo --path .env.development.local --invert-paths
git push --force
```

After scrubbing, inform collaborators and rotate secrets again as an extra precaution.

# Subscription-Tracker
