import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/usermodel.js';

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB via test script");
        
        const user = await User.findOne({email: 'admin@gmail.com'}).select('+password');
        if (!user) {
            console.log("User not found in the DB!");
            process.exit(1);
        }
        
        console.log("User found:", user.email);
        console.log("Stored Password length/value:", user.password);
        
        const isMatch = await user.comparePassword('Admin123');
        console.log("Password matched validation:", isMatch);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
testLogin();
