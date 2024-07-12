'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      manager_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      operating_hours: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_filename: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      facebook: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      instagram: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      average_rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.dropTable('Stores');
  }
};
