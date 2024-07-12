// src/middleware/checkAuthHeader.ts

import { Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

/**
 * Middleware to check for the presence of an Authorization header in the request.
 * If the header is missing, it throws an AuthenticationError and logs the event.
 * This middleware is part of the security layer, ensuring that requests to protected
 * routes include necessary authentication tokens.
 *
 * @param {ExtendedRequest} req - The request object, extended to include custom properties like authorization header.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - Callback to pass control to the next middleware.
 */
const checkAuthorizationHeader: MiddlewareFunction = asyncErrorHandler(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    logger.debug(`Checking authorization header: ${req.headers.authorization}`);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.info("Authorization header missing");
      if (req.session) {
        req.session.destroy(() => logger.info(`Session destroyed`));
      }
      throw new AuthenticationError("Authorization header missing");
    }
    next();
  }
);

export default checkAuthorizationHeader;
