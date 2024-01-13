// src/middleware/verifyToken.ts
import { TokenUtilityService } from "../services/TokenService";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";
import {
  MiddlewareFunctionWithToken,
  RequestWithDecodedToken,
} from "@zerodaypoke/strange-types";

const verifyToken: MiddlewareFunctionWithToken =
  asyncErrorHandler<RequestWithDecodedToken>(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    req.token = token;
    logger.info(`Received token: ${token}`);

    try {
      const decoded = await TokenUtilityService._verifyJwt(token);
      logger.info(`Token verified for user: ${decoded.userId}`);
      req.decodedToken = decoded;
      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      if (req.session) {
        req.session.destroy((err) => {
          if (err) logger.error(`Session destruction error: ${err}`);
          else logger.info("Session destroyed");
        });
      }
      throw new AuthenticationError("Invalid token");
    }
  });

export default verifyToken;
