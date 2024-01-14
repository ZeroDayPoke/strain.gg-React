// src/middleware/authenticate.ts
import logger from "./logger";
import { Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthenticationError } from "../errors";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

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
