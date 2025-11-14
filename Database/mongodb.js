import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../Config/env.js';

if(!DB_URI){
  throw new Error('Database connection string (DB_URI) is not defined in environment variables.');
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} mode`);  
  } catch (error){
    console.log(`Error connecting to database: `, error);
    process.exit(1);
  }
}

export default connectToDatabase;