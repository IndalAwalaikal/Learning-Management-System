/**
 * Sequelize CLI configuration file.
 * Uses CommonJS format (.cjs) because sequelize-cli does not support ESM.
 * Environment variables are loaded via dotenv.
 */
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'lms_user',
    password: process.env.DB_PASSWORD || 'lms_password',
    database: process.env.DB_NAME || 'lms_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  },
};
