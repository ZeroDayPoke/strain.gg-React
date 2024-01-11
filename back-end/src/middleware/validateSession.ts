import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthorizationError } from "../errors";
import logger from "./logger";
import session from "express-session";
import { storeEssentialUserDataInSession } from "../utils/sessionUtils";

interface RequestWithUserToken extends Request {
  accessToken: {
    userId: number;
    roles: string[];
  };
  session: session.Session & { userId?: number; roles?: string[] };
}

const validateSession = asyncErrorHandler(
  async (req: RequestWithUserToken, res: Response, next: NextFunction) => {
    logger.info("Validating user", req.accessToken.userId);
    const accessToken = req.accessToken;

    if (!req.session.userId) {
      // in production, this should redirect to login
      logger.info("Session userId not found. Storing new session data.");
      storeEssentialUserDataInSession(req, req.accessToken);
    } else if (req.session.userId !== accessToken.userId) {
      logger.error(
        `Session and token user mismatch: ${req.session.userId} !== ${accessToken.userId}`
      );
      await req.session.destroy((err) => {
        if (err) logger.error(`Session destruction error: ${err.message}`);
      });
      throw new AuthorizationError("Session and token user mismatch");
    }

    logger.info(`Session validated for user: ${accessToken.userId}`);
    next();
  }
);

export default validateSession;
