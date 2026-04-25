import {Router} from 'express'

import { getAllCourse, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, removeLecture, updateLecture } from '../controllers/course.controllers.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();
/**
 * @route GET /courses
 * @description Get all courses
 * @access Public
 */
router.route('/')
    .get( 
        getAllCourse
    )
    .post(
            isLoggedIn,
            authorizedRoles('TEACHER', 'SUPER_ADMIN'),
            upload.single('thumbnail'), 
           createCourse
        );
/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a course by ID
 * @access Admin only
 */
router.route('/:id')
    .get(
        isLoggedIn ,
        getLecturesByCourseId
    )
    .put(
        isLoggedIn,
        authorizedRoles('TEACHER', 'SUPER_ADMIN'),
        upload.single('thumbnail'),
        updateCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles('TEACHER', 'SUPER_ADMIN'),
        removeCourse
    )
    .post(
        isLoggedIn,
        authorizedRoles('TEACHER', 'SUPER_ADMIN'),
        upload.single('lecture'), 
        addLectureToCourseById
    );
    /**
 * @route DELETE /courses/:courseId/lectures/:lectureId
 * @description Remove a specific lecture from a course
 * @access Admin only
 */
    router.route('/:courseId/lectures/:lectureId')
        .put(
            isLoggedIn,
            authorizedRoles('TEACHER', 'SUPER_ADMIN'),
            upload.single('lecture'),
            updateLecture
        )
        .delete(
            isLoggedIn,
            authorizedRoles('TEACHER', 'SUPER_ADMIN'),
            removeLecture,
        )

export default router;