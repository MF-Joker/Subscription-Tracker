# Subscription Tracker API - My Development Log

## My Goal

My primary goal right now is to get a stable, running Express server. I've decided to temporarily remove the database code so I can focus on the core application structure first. I want to understand how a request flows through the application and make sure all the routes are set up correctly before I add the complexity of a database.

## Application Workflow

I've mapped out how I envision the application working from two different perspectives.

### User's Perspective

This shows how a user would interact with the API from a high level. For example, when they want to sign up:

```mermaid
graph TD
    A[User visits my website/app] --> B{Clicks 'Sign Up'};
    B --> C[Fills out a form with username, email, and password];
    C --> D[Clicks 'Submit'];
    D --> E{API receives request at `POST /api/v1/auth/sign-up`};
    E --> F[API processes the request (validation, user creation)];
    F --> G{API sends back a success message or token};
    G --> H[User is now logged in];
```

### Programmer's Perspective (Request Lifecycle)

This shows what happens inside the code when a request comes in. This example follows a request to get a specific subscription.

```mermaid
graph TD
    A[Request: GET /api/v1/subscription/123] --> B[Enters `app.js`];
    B --> C{Middleware (`express.json`, etc.) is executed};
    C --> D{App routing matches `/api/v1/subscription`};
    D --> E[Control is passed to `Subscription.routes.js`];
    E --> F{Router matches the `/:id` route};
    F --> G[The route handler function is executed];
    G --> H{Controller logic fetches data from the database (future step)};
    H --> I[A JSON response is sent back to the client];
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
# Subscription-Tracker
