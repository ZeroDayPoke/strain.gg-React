// ./middleware/logger.ts

import winston from "winston";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Error log file transport
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // Warning log file transport
    new winston.transports.File({
      filename: "logs/warn.log",
      level: "warn",
    }),
    // Info and below log file transport
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
