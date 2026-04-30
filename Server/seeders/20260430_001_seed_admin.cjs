'use strict';

const bcrypt = require('bcryptjs');
require('dotenv').config();

/**
 * Seeder untuk membuat akun SUPER_ADMIN default.
 * Akun ini otomatis terbuat saat deploy mengambil data dari .env
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'superadmin@lms.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SUPERadmin';
    const ADMIN_FULLNAME = process.env.ADMIN_FULLNAME || 'super admin';

    // Hapus jika sudah ada, agar tidak duplikat
    await queryInterface.bulkDelete('users', { email: ADMIN_EMAIL });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert('users', [{
      fullName: ADMIN_FULLNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      avatar_public_id: 'dummy',
      avatar_secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'superadmin@lms.com';
    await queryInterface.bulkDelete('users', { email: ADMIN_EMAIL });
  },
};
