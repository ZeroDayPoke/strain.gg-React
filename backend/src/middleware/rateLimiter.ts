// src/middleware/rateLimiter.ts
/**
 * Middleware for rate limiting requests to the server. This middleware uses the
 * `express-rate-limit` package to limit the number of requests an individual IP
 * can make to the server within a specified time window. It's a basic security
 * measure to help prevent abuse and denial-of-service attacks.
 *
 * The middleware is configured with the following options:
 * - `windowMs`: The duration of the time window for which the rate limit applies,
 *    specified in milliseconds. In this configuration, it is set to 15 minutes.
 * - `max`: The maximum number of requests that an individual IP address can make
 *    during the specified window. Here it is set to 100 requests per 15 minutes.
 *
 * Usage:
 * This middleware can be applied globally to all routes or to specific routes where
 * rate limiting is particularly important.
 *
 * Example:
 *   app.use(limiter); // Apply to all routes
 *   app.use('/api/sensitive', limiter); // Apply to a specific route
 */
import rateLimit from "express-rate-limit";

// Creating the rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export default limiter;
