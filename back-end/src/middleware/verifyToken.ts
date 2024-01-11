import { Request, Response, NextFunction } from "express";
import TokenService from "../services/TokenService";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";

interface AccessToken {
  userId: number;
  roles: string[];
}

interface RequestWithUserToken extends Request {
  accessToken?: AccessToken;
}

const verifyToken = asyncErrorHandler(
  async (req: RequestWithUserToken, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    logger.info(`Received token: ${token}`);

    try {
      const decoded = (await TokenService._verifyJwt(token)) as AccessToken;
      logger.info(`Token verified for user: ${decoded.userId}`);
      req.accessToken = decoded;
      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      if (req.session) {
        await req.session.destroy((err) => {
          if (err) logger.error(`Session destruction error: ${err}`);
          else logger.info("Session destroyed");
        });
      }
      throw new AuthenticationError("Invalid token");
    }
  }
);

export default verifyToken;
