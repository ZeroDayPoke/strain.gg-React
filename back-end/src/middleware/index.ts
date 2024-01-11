// ./middleware/index.ts

import errorHandler from "./errorHandler";
import asyncErrorHandler from "./asyncErrorHandler";
import rateLimiter from "./rateLimiter";
import checkAuthorizationHeader from "./checkAuthHeader";
import ensureAuthenticated from "./authenticate";
import validateSession from "./validateSession";
import verifyToken from "./verifyToken";
import requireRole from "./roleCheck";
import requestLogger from "./requestLogger";
import logger from "./logger";

export {
  errorHandler,
  requireRole,
  rateLimiter,
  requestLogger,
  logger,
  asyncErrorHandler,
  checkAuthorizationHeader,
  ensureAuthenticated,
  validateSession,
  verifyToken,
};
