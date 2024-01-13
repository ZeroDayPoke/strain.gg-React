// src/middleware/authenticate.ts
import logger from "./logger";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthenticationError } from "../errors";
import {
  MiddlewareFunctionWithTokenAndSession,
  RequestWithTokenAndSession,
} from "@zerodaypoke/strange-types";

const ensureAuthenticated: MiddlewareFunctionWithTokenAndSession =
  asyncErrorHandler<RequestWithTokenAndSession>(async (req, res, next) => {
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
  });

export default ensureAuthenticated;
