import { DataTypes, Model } from "sequelize";
import db from "../config/database";
import { RoleAttributes } from "@zerodaypoke/strange-types";

class Role extends Model<RoleAttributes> {
  declare id: number;
  declare name: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Role",
    tableName: "Roles",
  }
);

export default Role;
