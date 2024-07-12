'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Stores', [
      {
        id: 200,
        name: 'Store1',
        location: 'Location 1',
        operating_hours: JSON.stringify([
          { day: 'Monday', open: '09:00', close: '17:00' },
          { day: 'Tuesday', open: '09:00', close: '17:00' },
          { day: 'Wednesday', open: '09:00', close: '17:00' },
          { day: 'Thursday', open: '09:00', close: '17:00' },
          { day: 'Friday', open: '09:00', close: '17:00' },
          { day: 'Saturday', open: '10:00', close: '14:00' },
          { day: 'Sunday', open: 'Closed', close: 'Closed' },
        ]),
        manager_id: 9002,
        image_filename: null,
        description: 'Description for Store 1',
        phone: '123-456-7890',
        email: 'store1@example.com',
        facebook: 'store1',
        instagram: 'store1',
        average_rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 201,
        name: 'Store2',
        location: 'Location 2',
        operating_hours: JSON.stringify([
          { day: 'Monday', open: '09:00', close: '17:00' },
          { day: 'Tuesday', open: '09:00', close: '17:00' },
          { day: 'Wednesday', open: '09:00', close: '17:00' },
          { day: 'Thursday', open: '09:00', close: '17:00' },
          { day: 'Friday', open: '09:00', close: '17:00' },
          { day: 'Saturday', open: '10:00', close: '14:00' },
          { day: 'Sunday', open: 'Closed', close: 'Closed' },
        ]),
        manager_id: 9002,
        image_filename: null,
        description: 'Description for Store 2',
        phone: '987-654-3210',
        email: 'store2@example.com',
        facebook: 'store2',
        instagram: 'store2',
        average_rating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Stores', null, {});
  }
};
