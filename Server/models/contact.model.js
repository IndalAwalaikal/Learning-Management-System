import { DataTypes } from 'sequelize';

import { sequelize } from '../config/dbConnection.js';

/**
 * @Contact - Sequelize model for Contact form submissions.
 */
const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: {
                args: [1, 50],
                msg: 'Name must be less than 50 characters',
            },
        },
        set(val) {
            this.setDataValue('name', val ? val.trim() : val);
        },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please fill in a valid email address',
            },
        },
    },
    message: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
            len: {
                args: [1, 1000],
                msg: 'Message must be less than 1000 characters',
            },
        },
    },
}, {
    tableName: 'contacts',
    timestamps: true,
});

export default Contact;
