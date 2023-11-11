// seeders/role-seeder.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = ['CLOUD_CHASER', 'CLOUD_CONSUMER', 'CLOUD_CULTIVATOR', 'CLOUD_CARRIER', 'CLOUD_CONTROLLER'];
    const roleData = roles.map((role) => ({
      name: role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert the roles and return the inserted roles
    await queryInterface.bulkInsert('Roles', roleData, { returning: true });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
