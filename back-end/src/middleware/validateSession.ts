import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthorizationError } from "../errors";
import logger from "./logger";
import session from "express-session";
import { storeEssentialUserDataInSession } from "../utils/sessionUtils";

interface DecodedToken {
  userId: number;
  roles: string[];
}

interface RequestWithUserToken extends Request {
  session: session.Session & {
    userId: number;
    roles: string[];
  };
  accessToken: DecodedToken;
}

const validateSession = asyncErrorHandler(
  async (req: RequestWithUserToken, res: Response, next: NextFunction) => {
    const accessToken = req.accessToken;
    logger.info("Validating user", req.accessToken.userId);

    if (!req.session.userId) {
      // in production, this should redirect to login
      logger.info("Session userId not found. Storing new session data.");
      storeEssentialUserDataInSession(req);
    } else if (req.session.userId != accessToken.userId) {
      logger.error(
        `Session and token user mismatch: ${req.session.userId} !== ${accessToken.userId}`
      );
      req.session.destroy((err) => {
        if (err) logger.error(`Session destruction error: ${err.message}`);
      });
      throw new AuthorizationError("Session and token user mismatch");
    }

    logger.info(`Session validated for user: ${accessToken.userId}`);
    next();
  }
);

export default validateSession;
