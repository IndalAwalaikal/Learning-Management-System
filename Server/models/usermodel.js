import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';

import { sequelize } from '../config/dbConnection.js';

/**
 * @User - Sequelize model for storing user details, including personal information, password, subscription, and role.
 * Includes instance methods for password encryption, JWT token generation, and password reset functionality.
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: {
                args: [5, 50],
                msg: 'Name must be between 5 and 50 characters',
            },
        },
        set(val) {
            this.setDataValue('fullName', val ? val.toLowerCase().trim() : val);
        },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please fill in a valid email address',
            },
        },
        set(val) {
            this.setDataValue('email', val ? val.toLowerCase().trim() : val);
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [8, 255],
                msg: 'Password must be at least 8 characters',
            },
        },
    },
    avatar_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    avatar_secure_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('STUDENT', 'TEACHER', 'SUPER_ADMIN'),
        defaultValue: 'STUDENT',
        allowNull: false,
    },
    forgotPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    forgotPasswordExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] },
        },
    },
});

/**
 * @Hook - Hash password before create/update
 */
User.beforeSave(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

/**
 * @Method - Compare plaintext password with hashed password
 */
User.prototype.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

/**
 * @Method - Generate JWT token with user id and role as payload
 */
User.prototype.generateJWTToken = async function () {
    return await jwt.sign(
        { id: this.id, role: this.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY,
        }
    );
};

/**
 * @Method - Generate password reset token
 */
User.prototype.generatePasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.forgotPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15min

    return resetToken;
};

/**
 * @toJSON - Override toJSON to provide backward-compatible avatar structure
 * This ensures the API response format stays the same as the MongoDB version
 */
User.prototype.toJSON = function () {
    const values = { ...this.get() };

    // Reconstruct nested avatar object for API compatibility
    values.avatar = {
        public_id: values.avatar_public_id,
        secure_url: values.avatar_secure_url,
    };
    delete values.avatar_public_id;
    delete values.avatar_secure_url;

    // Map 'id' to '_id' for frontend compatibility
    values._id = values.id;

    return values;
};

export default User;