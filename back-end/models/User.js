import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/database.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hash = bcrypt.hashSync(value, SALT_ROUNDS);
        this.setDataValue("password", hash);
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Users",
  }
);

User.associate = (models) => {
  User.belongsToMany(models.Role, { through: models.UserRole });
  User.belongsToMany(models.Strain, { as: 'favorites', through: 'user_favorites' });
  User.hasMany(models.Review, { foreignKey: "user_id" });
  User.hasMany(models.Store, { foreignKey: "manager_id" });
  User.hasMany(models.Strain, { as: "grower", foreignKey: "cultivator_id" });
};

User.prototype.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Role = db.define("Role", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const UserRole = db.define("UserRole", {});

Role.belongsToMany(User, { through: UserRole });

Role.associate = (models) => {
  Role.belongsToMany(models.User, { through: models.UserRole });
};

export { User, Role, UserRole };

