import express from "express";
import {PORT} from "./config/env.js";
import authRouter from "./Routes/auth.route.js";
import subscriptionRouter from "./Routes/Subscription.routes.js";
import userRouter from "./Routes/User.auth.js";
import connectToDatabase from "./Database/mongodb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/user', userRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the subscription Tracker API!');
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDatabase()
});

    


export default app;
