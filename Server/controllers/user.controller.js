import cloudinary from "cloudinary"
import crypto from 'crypto';
import fs from 'fs/promises'
import { Op } from 'sequelize';

import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax'
};

/**
 * @REGISTER - Registers a new user
 */
export const register=asyncHandler(async(req,res,next)=>{
    const {fullName, email, password}= req.body;

    if(!fullName) return next(new AppError('Nama lengkap harus diisi', 400));
    if(!email) return next(new AppError('Email harus diisi', 400));
    if(!password) return next(new AppError('Password harus diisi', 400));

    const userExists = await User.findOne({ where: { email } });
    if(userExists){
        return next(new AppError('Email already exists  ', 409));
    }
    const user = await User.create({
        fullName, email, password,
        avatar_public_id: email,
        avatar_secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    });

    if(!user){
        return next(new AppError('User registration failed please try again ', 400));
    }

    if(req.file){
        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            user.avatar_public_id = 'mock_id_' + Date.now();
            user.avatar_secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms', width:250, height:250, gravity:'faces', crop:'fill'
                });
                if(result){
                    user.avatar_public_id=result.public_id;
                    user.avatar_secure_url=result.secure_url;
                    try { await fs.rm(`uploads/${req.file.filename}`); } catch(e) {}
                }
            } catch (e) {
                return next(new AppError( e ||'File not uploaded , please try again ', 500))
            }
        }
    }

    await user.save();
    const token = await user.generateJWTToken()
    user.password= undefined;
    res.cookie('token', token, cookieOptions);

    res.status(201).json({ success:true, message:'User registered sucessfully', user });
});

/**
 * @CREATE_TEACHER - SUPER_ADMIN registers a new teacher manually
 */
export const createTeacher=asyncHandler(async(req,res,next)=>{
    const {fullName, email, password}= req.body;

    if(!fullName) return next(new AppError('Nama lengkap harus diisi', 400));
    if(!email) return next(new AppError('Email harus diisi', 400));
    if(!password) return next(new AppError('Password harus diisi', 400));

    const userExists = await User.findOne({ where: { email } });
    if(userExists) return next(new AppError('Email already exists', 409));

    const user = await User.create({
        fullName, email, password, role: "TEACHER",
        avatar_public_id: email,
        avatar_secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    });

    if(!user) return next(new AppError('Teacher registration failed', 400));

    if(req.file){
        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            user.avatar_public_id = 'mock_id_' + Date.now();
            user.avatar_secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms', width:250, height:250, gravity:'faces', crop:'fill'
                });
                if(result){
                    user.avatar_public_id=result.public_id;
                    user.avatar_secure_url=result.secure_url;
                }
            } catch (e) {
                return next(new AppError( e ||'File not uploaded , please try again ', 500))
            }
        }
    }

    await user.save();
    user.password= undefined;
    res.status(201).json({ success:true, message:'Teacher account instantiated successfully', user });
});

/**
 * @LOGIN - Logs in an existing user
 */
export const login=asyncHandler(async (req,res,next)=>{
    try {
        const {email, password}= req.body;
        if(!email) return next(new AppError('Email harus diisi', 400));
        if(!password) return next(new AppError('Password harus diisi', 400));

        const user= await User.scope('withPassword').findOne({ where: { email } });
        if(!user) return next(new AppError('Email belum terdaftar', 400));
        if(!(await user.comparePassword(password))) return next(new AppError('Password salah', 400));

        const token = await user.generateJWTToken();
        user.password= undefined;
        res.cookie('token', token, cookieOptions);
        res.status(200).json({ success: true, message:'User logged in Successfully', user })
    } catch (e) {
       return next(new AppError(e.message, 500));
    }
});

/**
 * @LOGOUT - Logs out the user by clearing the token cookie
 */
export const logout=asyncHandler(async(req,res,next)=>{
    res.cookie('token', null, {
        secure: isProduction, maxAge: 0, httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax'
    });
    res.status(200).json({ success: true, message:'User logged out  Successfully' })
});

/**
 * @LOGGED_IN_USER_DETAILS - Fetches details of the logged-in user
 */
export const getProfile=asyncHandler(async (req,res, next)=>{
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        res.status(200).json({ success: true, message:'User details ', user })
    } catch (e) {
        return next(new AppError('Failed to fetch profile ', 500));
    }
});

/**
 * @FORGOT_PASSWORD - Sends a password reset token to the user's email
 */
export const forgotPassword=asyncHandler(async(req, res,next)=>{
    const {email}= req.body;
    if(!email) return next(new AppError('Email is required ', 400));

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if(!user) return next(new AppError('Email  not registered ', 400));

    const resetToken = await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordUrl =`${process.env.FRONTEND_URL}reset-password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try{
        await sendEmail(email,subject, message);
        res.status(200).json({ success: true, message:`Reset password token has been sent to ${email} Sucessfully` })
    } catch(e ){
        user.forgotPasswordExpiry=null;
        user.forgotPasswordToken=null;
        await user.save();
        return next(new AppError(e.message, 500));
    }
});

/**
 * @RESET_PASSWORD - Resets the password using a valid token
 */
export const resetPassword =asyncHandler(async(req, res,next )=>{
    const { resetToken}= req.params;
    const {password}= req.body;

    const forgotPasswordToken= crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.scope('withPassword').findOne({
        where: { forgotPasswordToken, forgotPasswordExpiry: { [Op.gt]: new Date() } }
    });

    if(!user) return next(new AppError("Token is invailid or expired , please try again", 400));

    user.password=password;
    user.forgotPasswordExpiry=null;
    user.forgotPasswordToken=null;
    await user.save();

    res.status(200).json({ success: true, message:`Password Changed Sucessfully` })
});

/**
 * @CHANGE_PASSWORD - Changes the current password for the logged-in user
 */
export const changePassword =asyncHandler(async(req, res, next)=>{
    const { oldPassword, newPassword}= req.body;
    const {id}= req.user;

    if(!oldPassword) return next(new AppError("Password lama harus diisi", 400));
    if(!newPassword) return next(new AppError("Password baru harus diisi", 400));

    const user = await User.scope('withPassword').findByPk(id);
    if(!user) return next(new AppError("user does not exist", 400));

    const isPasswordValid = await user.comparePassword(oldPassword);
    if(!isPasswordValid) return next(new AppError("Invalid old password", 400));

    user.password = newPassword;
    await user.save();
    user.password=undefined;

    res.status(200).json({ success: true, message:`Password  changed Sucessfully` })
})

/**
 * @UPDATE_USER - Updates the user details (name and avatar)
 */
export const updateUser=asyncHandler(async(req, res,next)=>{
    const {fullName }=req.body;
    const {id} =req.user;
    console.log(id)

    const user = await User.findByPk(id);
    if(!user) return next(new AppError("user does not exist", 400));

    if(fullName) user.fullName=fullName;

    if(req.file){
        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            user.avatar_public_id = 'mock_id_' + Date.now();
            user.avatar_secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                if (user.avatar_public_id) await cloudinary.v2.uploader.destroy(user.avatar_public_id);
            } catch (e) {}
            try{
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms', width:250, height:250, gravity:'faces', crop:'fill'
                });
                if(result){
                    user.avatar_public_id=result.public_id;
                    user.avatar_secure_url=result.secure_url;
                    try { await fs.rm(`uploads/${req.file.filename}`); } catch(e) {}
                }
            } catch (e) {
                return next(new AppError( e ||'File not uploaded , please try again ', 500))
            }
        }
    }
    await user.save();
    res.status(200).json({ success: true, message:`User details updated  Sucessfully` })
})

/**
 * @GET_TEACHERS - Fetches all users with TEACHER role
 */
export const getTeachersList = asyncHandler(async(req, res, next) => {
    const teachers = await User.findAll({
        where: { role: 'TEACHER' },
        attributes: ['id', 'fullName', 'email', 'avatar_secure_url', 'createdAt'],
    });
    res.status(200).json({ success: true, message: 'Teachers retrieved successfully', teachers });
});

/**
 * @DELETE_TEACHER - Deletes a specific teacher account
 */
export const deleteTeacher = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if(!user) return next(new AppError('User not found', 404));
    if(user.role !== 'TEACHER') return next(new AppError('Only teacher records can be deleted from this module', 400));

    if (user.avatar_public_id && process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud_name') {
        try { await cloudinary.v2.uploader.destroy(user.avatar_public_id); } catch (e) {
            console.log("Failed to destroy cloudinary avatar:", e);
        }
    }

    await user.destroy();
    res.status(200).json({ success: true, message: 'Teacher account deleted successfully' });
});
