// src/middleware/requestLogger.ts

import { Request, Response, NextFunction } from "express";
import logger from "./logger";

/**
 * Middleware for logging HTTP requests received by the server. This middleware
 * uses a custom logger (built with Winston) to log essential information about
 * each incoming request. It's a crucial tool for monitoring and debugging the
 * application's interactions with clients.
 *
 * The middleware logs the following information for each request:
 * - Timestamp: The date and time when the request was received.
 * - IP Address: The IP address of the client making the request.
 * - HTTP Method: The HTTP method used (e.g., GET, POST, etc.).
 * - Path: The URL path that was accessed.
 * - Body: The request body, if any (useful for POST and PUT requests).
 * - Query Parameters: Any query parameters included in the request URL.
 *
 * The logged information helps in tracking the request flow and understanding the
 * usage patterns, which can be invaluable for troubleshooting and optimizing the
 * application's performance.
 *
 * Usage:
 * This middleware should be applied globally to log all incoming requests.
 *
 * Example:
 *   app.use(requestLogger); // Apply to all incoming requests
 */
const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const now = new Date().toISOString();
  const meta = {
    time: now,
    ip: req.ip,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
  };
  logger.info(`HTTP Request`, meta);
  next();
};

export default requestLogger;
