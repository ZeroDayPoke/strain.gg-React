import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/database";
import Role from "./Role";
import logger from "../middleware/logger";
import { ServerError } from "../errors";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  lastLogin?: Date;
  isVerified: boolean;
}

class User extends Model<UserAttributes> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone?: string;
  declare lastLogin?: Date;
  declare isVerified: boolean;

  declare addRole: (role: Role) => Promise<void>;
  declare getRoles: () => Promise<Role[]>;

  public async validatePassword(passToCheck: string): Promise<boolean> {
    try {
      logger.info(`Validating password for user with ID: ${this.id}`);
      return await bcrypt.compare(passToCheck, this.password);
    } catch (err) {
      throw new ServerError(err.message);
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
