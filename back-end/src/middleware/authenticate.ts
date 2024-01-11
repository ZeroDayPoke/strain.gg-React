import { Request, Response, NextFunction } from "express";
import logger from "./logger";
import session from "express-session";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthenticationError } from "../errors";

interface RequestWithUserToken extends Request {
  accessToken: {
    userId: number;
    roles: string[];
  };
  session: session.Session & { userId?: number; roles?: string[] };
}

const ensureAuthenticated = asyncErrorHandler(
  async (req: RequestWithUserToken, res: Response, next: NextFunction) => {
    if (
      req.session &&
      req.session.userId &&
      req.accessToken &&
      req.accessToken.userId === req.session.userId
    ) {
      logger.info(`Authenticated successfully: ${req.session.userId}`);
      return next();
    }

    const errorMsg = `Failed to authenticate: session userId: ${req.session?.userId}, token userId: ${req.accessToken?.userId}`;
    logger.error(errorMsg);

    throw new AuthenticationError("Not authenticated");
  }
);

export default ensureAuthenticated;
