// src/middleware/verifyToken.ts
import { TokenUtilityService } from "../services/TokenService";
import { Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

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
