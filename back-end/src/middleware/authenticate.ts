// src/middleware/authenticate.ts
import logger from "./logger";
import { Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthenticationError } from "../errors";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

/**
 * Middleware to ensure that the user is authenticated.
 *
 * This middleware checks if the user is authenticated by comparing the user ID in the session
 * with the user ID in the decoded JWT token attached to the request. If they match, it means
 * the user is authenticated, and the request can proceed. If not, it throws an
 * AuthenticationError, indicating the user is not authenticated.
 *
 * @param {ExtendedRequest} req - The request object, augmented with session and decoded token data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the call stack.
 * @returns {Promise<void>} - A promise that resolves when the middleware is complete.
 *
 * @throws {AuthenticationError} - Thrown when the user is not authenticated.
 */
const ensureAuthenticated: MiddlewareFunction = asyncErrorHandler(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (
      req.session &&
      req.session.data.userId &&
      req.decodedToken &&
      req.decodedToken.userId === req.session.data.userId
    ) {
      logger.info(`Authenticated successfully: ${req.session.data.userId}`);
      return next();
    }

    const errorMsg = `Failed to authenticate: session userId: ${req.session?.data.userId}, token userId: ${req.decodedToken?.userId}`;
    logger.error(errorMsg);

    throw new AuthenticationError("Not authenticated");
  }
);

export default ensureAuthenticated;
