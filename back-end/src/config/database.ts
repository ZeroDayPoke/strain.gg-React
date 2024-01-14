// src/config/database.ts
/**
 * Sets up and exports the Sequelize database connection.
 * Configuration is based on the current NODE_ENV environment variable.
 * Supports different configurations for development, test, and production environments.
 *
 * @type {Sequelize}
 * @exports db
 *
 * Usage:
 * Import the default exported 'db' instance and use it for ORM operations.
 *
 * Example:
 *   import db from './database';
 *   db.authenticate().then(() => console.log("Database connected"));
 */
import { Sequelize, Options as SequelizeOptions } from "sequelize";
import config from "./config";
import ENV from "../utils/loadEnv";
import { DBConfig } from "@zerodaypoke/strange-types";

const env = ENV.NODE_ENV as keyof typeof config;
const dbConfig: DBConfig = config[env];

/**
 * Sequelize configuration options.
 */
const sequelizeOptions: SequelizeOptions = {
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
};

/**
 * Sequelize instance.
 */
const db = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  sequelizeOptions
);

export default db;
