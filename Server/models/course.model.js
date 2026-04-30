import { DataTypes } from 'sequelize';

import { sequelize } from '../config/dbConnection.js';

/**
 * @Course - Sequelize model for Course.
 * This model defines the structure and validation rules for course data,
 * including title, description, category, thumbnail, and metadata.
 * Lectures are stored in a separate table with a hasMany relationship.
 */
const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            len: {
                args: [8, 60],
                msg: 'Title must be between 8 and 60 characters',
            },
        },
        set(val) {
            this.setDataValue('title', val ? val.trim() : val);
        },
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            len: {
                args: [8, 200],
                msg: 'Description must be between 8 and 200 characters',
            },
        },
        set(val) {
            this.setDataValue('description', val ? val.trim() : val);
        },
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    thumbnail_public_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Dummy',
    },
    thumbnail_secure_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: 'Dummy',
    },
    numberOfLectures: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
    },
    createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'courses',
    timestamps: true,
});

/**
 * @toJSON - Override toJSON to provide backward-compatible thumbnail structure
 * This ensures the API response format stays the same as the MongoDB version
 */
Course.prototype.toJSON = function () {
    const values = { ...this.get() };

    // Reconstruct nested thumbnail object for API compatibility
    values.thumbnail = {
        public_id: values.thumbnail_public_id,
        secure_url: values.thumbnail_secure_url,
    };
    delete values.thumbnail_public_id;
    delete values.thumbnail_secure_url;

    // Map 'id' to '_id' for frontend compatibility
    values._id = values.id;

    // If lectures are included via eager loading, format them too
    if (values.Lectures) {
        values.lectures = values.Lectures.map(l => l.toJSON ? l.toJSON() : l);
        delete values.Lectures;
    }

    return values;
};

export default Course;