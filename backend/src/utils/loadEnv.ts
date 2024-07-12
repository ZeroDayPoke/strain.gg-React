// src/utils/loadEnv.ts
import { IEnv } from "@zerodaypoke/strange-types";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".test.env" : ".env";
dotenv.config({ path: envFile });

/**
 * Utility to load and validate environment variables.
 * Supports different environments like development, test, and production.
 * Defaults are provided for development and test environments.
 *
 * Usage:
 * Import ENV from this file to access environment variables throughout the application.
 *
 * Example:
 *   import ENV from './loadEnv';
 *   console.log(ENV.DB_USER); // Prints the database user.
 */
const ENV: IEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_USER: process.env.DB_USER || 'cloud_user',
  DB_PASS: process.env.DB_PASS || 'cloud_pass',
  DB_NAME: process.env.DB_NAME || 'cloud_db',
  DB_HOST: process.env.DB_HOST || 'localhost',
  SESSION_SECRET: process.env.SESSION_SECRET || 'default_session_secret',
  PORT: parseInt(process.env.PORT || '3100', 10),
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || 'default_email_username',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'default_email_password',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '1h',
  EMAIL_VERIFICATION_TOKEN_EXPIRY:
    process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || '24h',
  PASSWORD_RESET_TOKEN_EXPIRY: process.env.PASSWORD_RESET_TOKEN_EXPIRY || '1h',
};

export default ENV;
