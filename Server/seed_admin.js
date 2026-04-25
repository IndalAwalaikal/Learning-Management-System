import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/usermodel.js';
import connectionToDB from './config/dbConnection.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectionToDB();
        
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';

        // Remove existing if any
        await User.deleteOne({ email: adminEmail });

        const admin = new User({
            fullName: process.env.ADMIN_FULLNAME,
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD,
            role: 'SUPER_ADMIN',
            avatar: {
                public_id: 'dummy',
                secure_url: 'dummy'
            }
        });
        
        await admin.save();
        console.log('Admin account created successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
