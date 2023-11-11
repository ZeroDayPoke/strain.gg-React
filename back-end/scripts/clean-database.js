import { User, Store, Strain, Review, Role, UserRole } from '../models/index.js';

async function clearDatabase() {
  try {
    await User.destroy({ where: {} });
    await Store.destroy({ where: {} });
    await Strain.destroy({ where: {} });
    await Review.destroy({ where: {} });
    await Role.destroy({ where: {} });

    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

clearDatabase();
