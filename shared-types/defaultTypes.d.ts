/**
 * defaultTypes.d.ts
 */

/**
 * Represents rate limit options for the rate limiter middleware.
 * @interface
 * @property windowMs - The time window in milliseconds
 * @property max - The maximum number of requests per IP address within the time window
 */
export interface RateLimitOptions {
  windowMs: number; // The time window in milliseconds
  max: number; // The maximum number of requests per IP address within the time window
}

export interface NavBarItem {
  name: string;
  path: string;
  requiresLogin: boolean;
  adminOnly: boolean;
  hideWhenLoggedIn: boolean;
}

export interface NavBarProps {
  items: NavBarItem[];
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}
