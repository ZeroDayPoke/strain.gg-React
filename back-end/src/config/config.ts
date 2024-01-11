// ./config/config.ts

import ENV from "../utils/loadEnv";

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  logging: boolean | ((sql: string, timing?: number) => void);
}

const ensureEnvVariables = (vars: string[]): void => {
  vars.forEach((varName) => {
    if (!ENV[varName]) {
      throw new Error(
        `Environment variable ${varName} is required for ${ENV.NODE_ENV} environment`
      );
    }
  });
};

const development: DBConfig = {
  username: ENV.DB_USER || "cloud_user",
  password: ENV.DB_PASS || "cloud_pass",
  database: ENV.DB_NAME + "_dev" || "cloud_db_dev",
  host: ENV.DB_HOST || "localhost",
  dialect: "mysql",
  logging: console.log,
};

const test: DBConfig = {
  username: ENV.DB_USER || "cloud_user",
  password: ENV.DB_PASS || "cloud_pass",
  database: ENV.DB_NAME + "_test" || "cloud_db_test",
  host: ENV.DB_HOST || "localhost",
  dialect: "mysql",
  logging: false,
};

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
