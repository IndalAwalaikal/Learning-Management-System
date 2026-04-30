import { Sequelize } from 'sequelize';

/**
 * @Connects to MySQL database via Sequelize ORM
 */
const sequelize = new Sequelize(
    process.env.DB_NAME || 'lms_db',
    process.env.DB_USER || 'lms_user',
    process.env.DB_PASSWORD || 'lms_password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            underscored: false,
        },
    }
);

const connectionToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Connected to MySQL: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'lms_db'}`);
    } catch (e) {
        console.log('Unable to connect to MySQL database:', e.message);
        process.exit(1);
    }
};

export { sequelize };
export default connectionToDB;