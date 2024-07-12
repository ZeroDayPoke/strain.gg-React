// migrations/02-create-strain.cjs

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Strains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cultivator_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      terpene_profile: {
        type: Sequelize.STRING
      },
      image_filename: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      subtype: {
        type: Sequelize.STRING
      },
      thc_concentration: {
        type: Sequelize.FLOAT
      },
      cbd_concentration: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Strains');
  }
};
