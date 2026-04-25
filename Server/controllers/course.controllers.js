import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Course from "../models/course.model.js"
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_COURSES
 * Fetches all courses excluding lectures.
 */
export const getAllCourse = asyncHandler(async (req, res, next)=>{
    try {
        const courses = await Course.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:'All course',
            courses,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
      
});
/**
 * @GET_LECTURES_BY_COURSE_ID
 * Fetches lectures for a specific course.
 */
export const getLecturesByCourseId = asyncHandler(async (req, res, next)=>{
    try {
        const {id} = req.params;

        const course = await  Course.findById(id);

        if(!course){
            return next(
                new AppError('Course tidak ditemukan',404)
            )
        }

        res.status(200).json({
            success:true,
            message:'Course lectures fecthed sucesssfully ',
            lectures:course.lectures,
        })
        
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
});
/**
 * @CREATE_COURSE
 * Creates a new course and optionally uploads a thumbnail image.
 */
export const createCourse = asyncHandler(async (req, res, next)=>{
    const {title, description , category, createdBy}= req.body;
    if(!title) return next(new AppError('Judul course harus diisi', 400));
    if(!description) return next(new AppError('Deskripsi course harus diisi', 400));
    if(!category) return next(new AppError('Kategori course harus diisi', 400));
    if(!createdBy) return next(new AppError('Nama pembuat course harus diisi', 400));
    
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy'
        },
    });

    if(!course){
        return next(
            new AppError('Course could not created please try again', 500)
        )
    }

    if(req.file){
        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            // Bypass actual cloudinary upload if we are using mock keys to prevent 60-second timeouts
            course.thumbnail.public_id = 'mock_id_' + Date.now();
            course.thumbnail.secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms'
                });
                if(result){
                    course.thumbnail.public_id=result.public_id;
                    course.thumbnail.secure_url=result.secure_url;
                }
                await fs.rm(`uploads/${req.file.filename}`);
            } catch (error) {
                return next(
                    new AppError(error.message, 500)
                )
            }
        }
        await course.save();
    } 

    // ALWAYS send response, even if req.file is missing
    res.status(200).json({
        success:true,
        message:'Course created successfully',
        course,
    });
});
/**
 * @UPDATE_COURSE_BY_ID
 * Updates an existing course by ID.
 */
export const updateCourse = asyncHandler(async (req, res, next)=>{
    try {
        const {id}= req.params;

        const course = await Course.findById(id);   
        if(!course){
            return next (
                new AppError("Course with given id does not exist", 500)
            ) 
        }

        const user = await User.findById(req.user.id);
        if (req.user.role === 'TEACHER' && course.createdBy?.toLowerCase() !== user.fullName?.toLowerCase()) {
            return next(new AppError("You are only authorized to modify courses that you have authored", 403));
        }

        Object.keys(req.body).forEach(key => {
            course[key] = req.body[key];
        });

        if (req.file) {
            // Delete old image
            if (course.thumbnail && course.thumbnail.public_id && course.thumbnail.public_id !== 'Dummy') {
                try {
                    await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
                } catch (e) {}
            }
            if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
                course.thumbnail.public_id = 'mock_id_' + Date.now();
                course.thumbnail.secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
            } else {
                try {
                    const result = await cloudinary.v2.uploader.upload(req.file.path, {
                        folder: 'lms'
                    });
                    if (result) {
                        course.thumbnail.public_id = result.public_id;
                        course.thumbnail.secure_url = result.secure_url;
                    }
                    await fs.rm(`uploads/${req.file.filename}`);
                } catch (error) {
                    return next(new AppError(error.message, 500));
                }
            }
        }
        await course.save();
    
        res.status(200).json({
            success:true,
            message:'Course Updated sucesssfully ',
        })
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});
/**
 * @DELETE_COURSE_BY_ID
 * Deletes a course by its ID.
 */
export const removeCourse = asyncHandler(async (req, res, next)=>{
    try {
        const {id }= req.params;
        const course = await  Course.findById(id);
        if(!course){
            return next (
                new AppError("Course with given id does not exist", 500)
            ) 
        }
        
        const user = await User.findById(req.user.id);
        if (req.user.role === 'TEACHER' && course.createdBy?.toLowerCase() !== user.fullName?.toLowerCase()) {
            return next(new AppError("You are only authorized to modify courses that you have authored", 403));
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:'Course Removed sucesssfully ',
        })
        
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});
/**
 * @ADD_LECTURE
 * Adds a lecture to a course and uploads video to Cloudinary.
 */
export const addLectureToCourseById= asyncHandler(async(req, res, next )=>{
    const { title, description, type, externalUrl } = req.body;

    const {id }= req.params;
    if(!title||! description){
        return next(
            new AppError('All fields are required', 400)
        )
    }

    const course = await Course.findById(id);

    if(!course){
        return next(
            new AppError('Course does not exist', 404)
        )
    }

    const user = await User.findById(req.user.id);
    if (req.user.role === 'TEACHER' && course.createdBy?.toLowerCase() !== user.fullName?.toLowerCase()) {
        return next(new AppError("You are only authorized to modify courses that you have authored", 403));
    }

    const lectureData ={
        title,
        description,
        lecture:{
            type: type || 'VIDEO'
        }
    }

    if (type === 'EXTERNAL_URL' || type === 'LIVE_MEETING') {
        if (!externalUrl) {
            return next(new AppError('External URL is required', 400));
        }
        lectureData.lecture.public_id = 'External';
        lectureData.lecture.secure_url = externalUrl;
    } else if(req.file){
        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            lectureData.lecture.public_id = 'mock_vid_' + Date.now();
            lectureData.lecture.secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    chunk_size:50000000,
                    resource_type:'auto'
                });
                if(result){
                    lectureData.lecture.public_id=result.public_id;
                    lectureData.lecture.secure_url=result.secure_url;
                }
                await fs.rm(`uploads/${req.file.filename}`);
            } catch (error) {
                return next(
                    new AppError(error.message, 500)
                )
            }
        }
    } else {
        return next(new AppError('File or External URL is required', 400));
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;
    await course.save();
    
    res.status(200).json({
        success:true,
        message:'Lecture added successfully',
        course,
    })
});

/**
 * @UPDATE_LECTURE
 * Updates an existing lecture in a course.
 */
export const updateLecture = asyncHandler(async(req, res, next) => {
    const { courseId, lectureId } = req.params;
    const { title, description, type, externalUrl } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return next(new AppError('Course not found', 404));

    const user = await User.findById(req.user.id);
    if (req.user.role === 'TEACHER' && course.createdBy?.toLowerCase() !== user.fullName?.toLowerCase()) {
        return next(new AppError("You are only authorized to modify courses that you have authored", 403));
    }

    const lectureIndex = course.lectures.findIndex((l) => l._id.toString() === lectureId);
    if (lectureIndex === -1) return next(new AppError('Lecture not found', 404));

    const lectureData = course.lectures[lectureIndex];

    if (title) lectureData.title = title;
    if (description) lectureData.description = description;

    if (type) lectureData.lecture.type = type;

    if (type === 'EXTERNAL_URL' || type === 'LIVE_MEETING') {
        if (externalUrl) {
            lectureData.lecture.public_id = 'External';
            lectureData.lecture.secure_url = externalUrl;
        }
    } else if (req.file) {
        if (lectureData.lecture.public_id && lectureData.lecture.public_id !== 'External' && lectureData.lecture.public_id !== 'Dummy') {
            try {
                await cloudinary.v2.uploader.destroy(lectureData.lecture.public_id);
            } catch (e) {}
        }

        if (process.env.CLOUDINARY_CLOUD_NAME === 'mock_cloud_name') {
            lectureData.lecture.public_id = 'mock_vid_' + Date.now();
            lectureData.lecture.secure_url = `http://localhost:5000/uploads/${req.file.filename}`;
        } else {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    chunk_size:50000000,
                    resource_type:'auto'
                });
                if(result){
                    lectureData.lecture.public_id=result.public_id;
                    lectureData.lecture.secure_url=result.secure_url;
                }
                await fs.rm(`uploads/${req.file.filename}`);
            } catch (error) {
                return next(new AppError(error.message, 500));
            }
        }
    }

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Lecture updated successfully',
        course
    });
});

/**
 * @REMOVE_LECTURE
 * Removes a lecture from a course by its ID and deletes the video from Cloudinary.
 */
export const removeLecture =asyncHandler( async(req, res, next )=>{
    try {
        const courseId = req.params.courseId;
        const lectureId = req.params.lectureId;

        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const user = await User.findById(req.user.id);
        if (req.user.role === 'TEACHER' && course.createdBy?.toLowerCase() !== user.fullName?.toLowerCase()) {
            return next(new AppError("You are only authorized to modify courses that you have authored", 403));
        }

        // Find the index of the lecture in the array
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return next(new AppError('Lecture not found', 404));
        }
         // Delete the lecture from cloudinary
        await cloudinary.v2.uploader.destroy(
            course.lectures[lectureIndex].lecture.public_id,
            {
            resource_type: 'video',
            }
        );
        // Remove the lecture from the array
        course.lectures.splice(lectureIndex, 1);
        course.numberOfLectures -= 1;
        
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture removed successfully',
        });

    }catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});