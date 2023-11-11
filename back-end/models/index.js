// ./models/index.js

import db from '../config/database.js';
import { User, Role, UserRole } from './User.js';
import Store from './Store.js';
import Strain from './Strain.js';
import Review from './Review.js';

db.User = User;
db.Store = Store;
db.Strain = Strain;
db.Review = Review;
db.Role = Role;
db.UserRole = UserRole;

Object.values(db).forEach(model => {
  if ('associate' in model) {
    model.associate(db);
  }
});

export { db, User, Store, Strain, Review, Role, UserRole };
