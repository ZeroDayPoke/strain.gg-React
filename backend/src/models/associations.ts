import { Model, DataTypes } from "sequelize";
import db from "../config/database";
import User from "./User";
import Role from "./Role";
import Token from "./Token";
import { UserRoleAttributes } from "@zerodaypoke/strange-types";

class UserRole extends Model<UserRoleAttributes> {
  declare id: number;
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  { sequelize: db, modelName: "UserRole" }
);

const setupAssociations = (): void => {
  User.belongsToMany(Role, { through: UserRole, as: "Roles" });
  Role.belongsToMany(User, { through: UserRole, as: "Users" });

  Token.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(Token, { foreignKey: "userId" });
};

export { setupAssociations, UserRole };
