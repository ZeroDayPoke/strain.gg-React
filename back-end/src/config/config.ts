// src/config/config.ts
/**
 * Configuration for Sequelize database based on the environment.
 * Contains database configurations for development, test, and production.
 *
 * Usage:
 * Automatically used in './database.ts' to set up Sequelize with the correct config.
 *
 * Note:
 * Throws an error if required environment variables are missing in production.
 */
import ENV from "../utils/loadEnv";
import { DBConfig } from "@zerodaypoke/strange-types";

/**
 * Ensures that the required environment variables are set.
 * @throws {Error} if a required environment variable is missing.
 */
const ensureEnvVariables = (vars: string[]): void => {
  vars.forEach((varName) => {
    if (!ENV[varName]) {
      throw new Error(
        `Environment variable ${varName} is required for ${ENV.NODE_ENV} environment`
      );
    }
  });
};

/**
 * Configuration for development environment database.
 * Uses default values if environment variables are not set.
 * @type {DBConfig}
 */
const development: DBConfig = {
  username: ENV.DB_USER || "cloud_user",
  password: ENV.DB_PASS || "cloud_pass",
  database: ENV.DB_NAME + "_dev" || "cloud_db_dev",
  host: ENV.DB_HOST || "localhost",
  dialect: "mysql",
  logging: console.log,
};

/**
 * Configuration for test environment database.
 * Uses default values if environment variables are not set.
 * @type {DBConfig}
 */
const test: DBConfig = {
  username: ENV.DB_USER || "cloud_user",
  password: ENV.DB_PASS || "cloud_pass",
  database: ENV.DB_NAME + "_test" || "cloud_db_test",
  host: ENV.DB_HOST || "localhost",
  dialect: "mysql",
  logging: false,
};

/**
 * Configuration for production environment database.
 * Throws an error if environment variables are not set.
 * @type {DBConfig}
 */
const production: DBConfig = {
  username: ENV.DB_USER,
  password: ENV.DB_PASS,
  database: ENV.DB_NAME,
  host: ENV.DB_HOST,
  dialect: "mysql",
  logging: false,
};

if (ENV.NODE_ENV === "production") {
  ensureEnvVariables(["DB_USER", "DB_PASS", "DB_NAME", "DB_HOST"]);
}

export default { development, test, production };
