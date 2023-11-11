// seeders/strain-seeder.cjs

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Strains', [
      {
        id: 100,
        terpene_profile: 'Terpene Profile 1',
        name: 'Strain1',
        subtype: 'Indica',
        thc_concentration: 20.0,
        cbd_concentration: 1.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 101,
        terpene_profile: 'Terpene Profile 2',
        name: 'Strain2',
        subtype: 'Sativa',
        thc_concentration: 15.0,
        cbd_concentration: 0.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Strains', null, {});
  }
};
