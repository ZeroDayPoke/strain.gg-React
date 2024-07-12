// src/middleware/verifyToken.ts
import { TokenUtilityService } from "../services";
import { Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

/**
 * Middleware for verifying JWT tokens. This middleware extracts the JWT token
 * from the authorization header, verifies it, and attaches the decoded token
 * to the request object.
 *
 * It performs the following steps:
 * - Extracts the JWT token from the 'Authorization' header.
 * - If the token is not present, it throws an AuthenticationError.
 * - Uses the TokenUtilityService to verify the JWT token.
 * - If verification is successful, the decoded token is attached to the request
 *   object under 'req.decodedToken'.
 * - If verification fails, any existing session is destroyed, and an
 *   AuthenticationError is thrown.
 *
 * Usage:
 * This middleware should be used in routes where a valid JWT token is required
 * to authenticate the user.
 *
 * Example:
 *   router.get('/protected-route', verifyToken, (req, res) => { ... });
 */
const verifyToken: MiddlewareFunction = asyncErrorHandler(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Token is missing");
    }
    logger.info(`Received token: ${token}`);

    try {
      const decoded = await TokenUtilityService._verifyJwt(token);
      logger.info(`Token verified for user: ${decoded.userId}`);
      req.decodedToken = decoded;
      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      if (req.session) {
        req.session.destroy(() => logger.info("Session destroyed"));
      }
      throw new AuthenticationError("Invalid token");
    }
  }
);

export default verifyToken;
