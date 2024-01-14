/**
 * Interface for database configuration.
 * @interface
 * @property {string} username - The username for the database.
 * @property {string} password - The password for the database.
 * @property {string} database - The name of the database.
 * @property {string} host - The host of the database.
 * @property {string} dialect - The dialect of the database.
 * @property {boolean | ((sql: string, timing?: number) => void)} logging - The logging configuration for the database.
 */
export interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  logging: boolean | ((sql: string, timing?: number) => void);
}

/**
 * Configuration type for Sequelize instance.
 */
export type DBConfigType = {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: "mysql";
  logging: boolean | ((sql: string, timing?: number) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  dialectOptions?: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
};

/**
 * Interface for environment variables.
 * @interface
 * @property {string} NODE_ENV - The environment the application is running in.
 * @property {string} DB_USER - The username for the database.
 * @property {string} DB_PASS - The password for the database.
 * @property {string} DB_NAME - The name of the database.
 * @property {string} DB_HOST - The host of the database.
 * @property {string} SESSION_SECRET - The secret used to sign the session ID cookie.
 * @property {number} PORT - The port the application will run on.
 * @property {number} SALT_ROUNDS - The number of rounds used to generate a salt for password hashing.
 * @property {string} EMAIL_USERNAME - The username for the email account used to send emails.
 * @property {string} EMAIL_PASSWORD - The password for the email account used to send emails.
 * @property {string} JWT_SECRET - The secret used to sign JWTs.
 * @property {string} ACCESS_TOKEN_EXPIRY - The expiry time for access tokens.
 * @property {string} EMAIL_VERIFICATION_TOKEN_EXPIRY - The expiry time for email verification tokens.
 * @property {string} PASSWORD_RESET_TOKEN_EXPIRY - The expiry time for password reset tokens.
 * @property {string} EMAIL_VERIFICATION_URL - The URL for email verification.
 */
export interface IEnv {
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
