// ./config/database.ts

import { Sequelize } from "sequelize";
import config from "./config";
import ENV from "../utils/loadEnv";

const env = ENV.NODE_ENV as keyof typeof config;
const dbConfig = config[env];

const db = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
    logging: dbConfig.logging,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions:
      env === "production"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  }
);

export default db;
