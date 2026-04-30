import dotenv from 'dotenv';
import User from './models/usermodel.js';
import connectionToDB from './config/dbConnection.js';
import { sequelize } from './config/dbConnection.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectionToDB();
        
        const adminEmail = process.env.ADMIN_EMAIL;

        // Remove existing if any
        await User.destroy({ where: { email: adminEmail } });

        const admin = await User.create({
            fullName: process.env.ADMIN_FULLNAME,
            email: adminEmail,
            password: process.env.ADMIN_PASSWORD,
            role: 'SUPER_ADMIN',
            avatar_public_id: 'dummy',
            avatar_secure_url: 'dummy',
        });
        
        console.log('Admin account created successfully!');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
