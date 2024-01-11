// ./middleware/checkAuthHeader.ts

import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import logger from "./logger";
import { AuthenticationError } from "../errors";

const checkAuthorizationHeader = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    logger.info(`Authorization header: ${authHeader}`);

    if (!authHeader) {
      logger.info("Authorization header missing");
      if (req.session)
        await req.session.destroy((session) =>
          logger.info(`Session destroyed: ${session}`)
        );
      throw new AuthenticationError("Authorization header missing");
    }
    next();
  }
);

export default checkAuthorizationHeader;
