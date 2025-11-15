// FIXED: Corrected typo 'cookie-paser' → 'cookie-parser'
// This was preventing the cookie parser middleware from loading
import express from "express";
import cookieParser from 'cookie-parser'
// FIXED: Changed case from './config/env.js' to './Config/env.js' 
// The actual folder is capitalized
import {PORT} from "./Config/env.js";
import authRouter from "./Routes/auth.route.js";
import subscriptionRouter from "./Routes/Subscription.routes.js";
import userRouter from "./Routes/User.auth.js";
import connectToDatabase from "./Database/mongodb.js";
// FIXED: Changed path from './middlewares/' to './MiddleWare/'
// The folder name has different capitalization
import errorMiddleware from './MiddleWare/error.middleware.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/user', userRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the subscription Tracker API!');
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase()
});

    


export default app;