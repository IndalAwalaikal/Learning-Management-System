/**
 * @Models_Index - Central file to register all Sequelize models and their associations.
 * Import this file once at startup to ensure all relationships are established.
 */
import User from './usermodel.js';
import Course from './course.model.js';
import Lecture from './lecture.model.js';
import Contact from './contact.model.js';

// Define associations
Course.hasMany(Lecture, {
    foreignKey: 'courseId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Lecture.belongsTo(Course, {
    foreignKey: 'courseId',
});

export {
    User,
    Course,
    Lecture,
    Contact,
};
