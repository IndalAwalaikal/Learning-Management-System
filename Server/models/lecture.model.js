import { DataTypes } from 'sequelize';

import { sequelize } from '../config/dbConnection.js';

/**
 * @Lecture - Sequelize model for Lecture.
 * Previously stored as an embedded array inside the Course document in MongoDB.
 * Now a separate table with a foreign key relationship to courses.
 */
const Lecture = sequelize.define('Lecture', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    public_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    secure_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('VIDEO', 'IMAGE', 'DOCUMENT', 'EXTERNAL_URL', 'LIVE_MEETING'),
        defaultValue: 'VIDEO',
        allowNull: false,
    },
}, {
    tableName: 'lectures',
    timestamps: true,
});

/**
 * @toJSON - Override toJSON to provide backward-compatible lecture structure
 * This ensures the API response format stays the same as the MongoDB version,
 * where lecture media info was nested inside a "lecture" object.
 */
Lecture.prototype.toJSON = function () {
    const values = { ...this.get() };

    // Reconstruct the nested lecture object for API compatibility
    values.lecture = {
        public_id: values.public_id,
        secure_url: values.secure_url,
        type: values.type,
    };
    delete values.public_id;
    delete values.secure_url;
    delete values.type;

    // Map 'id' to '_id' for frontend compatibility
    values._id = values.id;

    return values;
};

export default Lecture;
