// ./models/Review.js

import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Review = db.define('Review', {
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: 'Reviews',
});

Review.associate = models => {
  Review.belongsTo(models.User, { foreignKey: 'user_id' });
  Review.belongsTo(models.Store, { foreignKey: 'store_id' });
  Review.belongsTo(models.Strain, { foreignKey: 'strain_id' });
};

export default Review;
