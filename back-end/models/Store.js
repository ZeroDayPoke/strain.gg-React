// ./models/Store.js

import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Store = db.define('Store', {
  manager_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  operating_hours: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: JSON.stringify([
      { day: 'Monday', open: '09:00', close: '17:00' },
      { day: 'Tuesday', open: '09:00', close: '17:00' },
      { day: 'Wednesday', open: '09:00', close: '17:00' },
      { day: 'Thursday', open: '09:00', close: '17:00' },
      { day: 'Friday', open: '09:00', close: '17:00' },
      { day: 'Saturday', open: '10:00', close: '14:00' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]),
    get: function () {
      return JSON.parse(this.getDataValue('operating_hours'));
    },
    set: function (value) {
      this.setDataValue('operating_hours', JSON.stringify(value));
    }
  },
  image_filename: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(128),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  facebook: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  average_rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'Stores',
});

Store.associate = models => {
  Store.belongsTo(models.User, { foreignKey: 'manager_id' });
  Store.belongsToMany(models.Strain, { through: 'store_strains' });
  Store.hasMany(models.Review, { foreignKey: 'store_id' });
};

export default Store;
