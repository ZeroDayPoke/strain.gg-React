// ./models/Token.ts

import { DataTypes, Model } from "sequelize";
import db from "../config/database";

interface TokenAttributes {
  id: number;
  userId: number;
  token: string;
  type: string;
  expiration: Date;
}

class Token extends Model<TokenAttributes> {
  declare id: number;
  declare userId: number;
  declare token: string;
  declare type: string;
  declare expiration: Date;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Token",
    tableName: "Tokens",
  }
);

export default Token;
