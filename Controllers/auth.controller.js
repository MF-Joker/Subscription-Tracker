import mongoose from 'mongoose';
import User from '../Models/User.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// FIXED: Changed path from '../config/env.js' to '../Config/env.js'
// Config folder has uppercase C and needs correct casing
import { JWT_EXPIRES_IN, JWT_SECRET } from '../Config/env.js';

// What is a req body? -> req.body is an object containing data from the client (POST request)

export const signup = async (req, res, next) => {
    //Implement sign up logic here.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    // Logic is create a new user
        const{ name, email, password } = req.body;


        // check if a user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            // FIXED: Typo 'alreaady' → 'already'
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error; 
        }

        //Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // FIXED: Changed 'user' → 'User' (capital U)
        // The imported model is 'User' not 'user'. Also fixed variable name from 'newUsers' to 'newUser' for consistency
        const newUser = await User.create([{name, email, password: hashedPassword}], { session });

        // FIXED: Now uses 'newUser' consistently instead of undefined 'newUsers'
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser[0]
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}
export const login = async (req,res,next) => {
    //Implement signup logic here.

}

export const signout = async (req, res, next) => {
    //Implement Signout logic here.
}