// src/models/User.ts

import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/database";
import Role from "./Role";
import logger from "../middleware/logger";
import { ServerError } from "../errors";
import { UserAttributes } from "@zerodaypoke/strange-types";

/**
 * This class represents a User model.
 *
 * @property {number} id - The ID of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} phone - The phone number of the user.
 * @property {Date} lastLogin - The date of the user's last login.
 * @property {boolean} isVerified - Whether the user's email has been verified.
 * @property {Function} getRole - Sequelize getter method for the user's role.
 * @property {Function} addRole - Sequelize setter method for the user's role.
 * @property {Function} getRoles - Sequelize getter method for the user's roles.
 * @property {Function} addRoles - Sequelize setter method for the user's roles.
 * @property {Function} validatePassword - Validates the user's password.
 * @property {Function} assignRole - Assigns a role to the user.
 */
class User extends Model<UserAttributes> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone?: string;
  declare lastLogin?: Date;
  declare isVerified: boolean;

  declare getRole: (roleName: string) => Promise<Role | null>;
  declare addRole: (role: Role) => Promise<void>;
  declare getRoles: () => Promise<Role[]>;
  declare addRoles: (roles: Role[]) => Promise<void>;

  public async validatePassword(passToCheck: string): Promise<boolean> {
    try {
      logger.info(`Validating password for user with ID: ${this.id}`);
      return await bcrypt.compare(passToCheck, this.password);
    } catch (err) {
      throw new ServerError("Error validating password");
    }
  }

  public async assignRole(roleName: string): Promise<void> {
    try {
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        throw new Error("Role not found");
      }
      await this.addRole(role);
      logger.info(`Assigned role ${roleName} to user with ID: ${this.id}`);
    } catch (error) {
      throw new ServerError(error.message);
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    lastLogin: { type: DataTypes.DATE },
    phone: { type: DataTypes.STRING },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "Users",
  }
);

export default User;
