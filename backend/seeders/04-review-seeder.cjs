// seeders/review-seeder.cjs

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        rating: 5,
        comment: 'Great strain!',
        userId: 9004,
        strainId: 100,
        storeId: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        rating: 4,
        comment: 'Good strain, but not my favorite.',
        userId: 9005,
        strainId: 101,
        storeId: 201,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
