// ./utils/loadEnv.ts

import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".test.env" : ".env";
dotenv.config({ path: envFile });

interface IEnv {
  NODE_ENV: string;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_HOST: string;
  SESSION_SECRET: string;
  PORT: number;
  SALT_ROUNDS: number;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  EMAIL_VERIFICATION_TOKEN_EXPIRY: string;
  PASSWORD_RESET_TOKEN_EXPIRY: string;
}

const ENV: IEnv = {
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_USER: process.env.DB_USER || "cloud_user",
  DB_PASS: process.env.DB_PASS || "cloud_pass",
  DB_NAME: process.env.DB_NAME || "cloud_db",
  DB_HOST: process.env.DB_HOST || "localhost",
  SESSION_SECRET: process.env.SESSION_SECRET || "default_session_secret",
  PORT: parseInt(process.env.PORT || "3100", 10),
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "10", 10),
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || "default_email_username",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "default_email_password",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  EMAIL_VERIFICATION_TOKEN_EXPIRY:
    process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "24h",
  PASSWORD_RESET_TOKEN_EXPIRY: process.env.PASSWORD_RESET_TOKEN_EXPIRY || "1h",
};

export default ENV;
