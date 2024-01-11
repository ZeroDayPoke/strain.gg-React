// ./middleware/rateLimiter.ts

import rateLimit from "express-rate-limit";

interface RateLimitOptions {
  windowMs: number; // The time window in milliseconds
  max: number; // The maximum number of requests per IP address within the time window
}

/**
 * Rate limiter middleware to limit the number of requests per IP address within a specified time window.
 * @param options - The options object for rate limiter middleware.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export default limiter;
