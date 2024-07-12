'use strict'

const bcrypt = require('bcrypt');

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash('dev', SALT_ROUNDS);

    // Get all the roles
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM Roles`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create a user for each role
    const users = roles.map((role, index) => ({
      id: 9001 + index,
      name: `Test ${role.name}`,
      email: `${role.name.toLowerCase()}@dev.dev`,
      password: hashedPassword,
      phone: '123-456-7890',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Users', users);

    // Insert a record into the UserRoles table for each user
    const userRoles = roles.map((role, index) => ({
      userId: 9001 + index,
      roleId: role.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('UserRoles', userRoles);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRoles', null, {});
    return queryInterface.bulkDelete('Users', null, {});
  }
};
