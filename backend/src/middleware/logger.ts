// src/middleware/logger.ts

import winston from "winston";

// Custom format for log messages
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

/**
 * Custom logger middleware using winston.
 *
 * This logger is configured to log messages at various levels (debug, info, warn, error) to
 * both the console and specific log files. It uses a custom format for displaying log messages
 * that includes the timestamp, log level, and the actual message. The logger is designed to
 * handle and format error stack traces properly.
 *
 * - Console transport: Outputs logs to the console. Used for debugging purposes as it logs
 *   everything at and above the 'debug' level and formats messages with colorization.
 * - File transports: Separate file transports for different log levels (error, warn, and a
 *   combined file for all log levels). This helps in segregating logs based on their severity
 *   for easier analysis.
 *
 * The logger can be used throughout the application to log various information, warnings, and
 * errors as part of the application's logging strategy.
 *
 * Usage:
 *   logger.debug('Debug level log');
 *   logger.info('Informational log');
 *   logger.warn('Warning message');
 *   logger.error('Error message');
 */
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
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/warn.log",
      level: "warn",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
