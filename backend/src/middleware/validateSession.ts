// src/middleware/validateSession.ts
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthorizationError } from "../errors";
import logger from "./logger";
import { Response, NextFunction } from "express";
import ENV from "../utils/loadEnv";
import storeEssentialUserDataInSession from "../utils/sessionUtils";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

/**
 * Middleware to validate user sessions. It checks if the session data corresponds
 * to the user identified in the access token. This middleware ensures that the
 * user's session is valid and the user is authenticated before they can access
 * protected routes.
 *
 * The middleware performs the following checks:
 * - Verifies that the session contains a user ID.
 * - In non-production environments, it stores essential user data in the session.
 * - In production environments, it throws an error if the session lacks a user ID.
 * - Checks if the session user ID matches the user ID in the access token.
 * - If there's a mismatch, it destroys the session and throws an authorization error.
 *
 * Usage:
 * This middleware should be used in routes where authenticated user access is required.
 *
 * Example:
 *   router.get('/protected-route', validateSession, (req, res) => { ... });
 */
const validateSession: MiddlewareFunction = asyncErrorHandler(
  async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const accessToken = req.decodedToken;
    logger.info("Validating user session for user ID", accessToken.userId);

    if (!req.session.data.userId) {
      if (ENV.NODE_ENV !== "production") {
        logger.info("Non-production environment: Storing new session data.");
        storeEssentialUserDataInSession(req);
      } else {
        logger.error("Production environment: Missing session userId.");
        throw new AuthorizationError("Session userId is missing");
      }
    } else if (req.session.data.userId !== accessToken.userId) {
      logger.error(
        `Session and token user mismatch: Session UserId: ${req.session.data.userId}, Token UserId: ${accessToken.userId}`
      );
      req.session.destroy((err) => {
        if (err) {
          logger.error(`Error destroying session: ${err.message}`);
        }
      });
      throw new AuthorizationError("Session and token user mismatch");
    }

    logger.info(`Session validated for user: ${accessToken.userId}`);
    next();
  }
);

export default validateSession;
