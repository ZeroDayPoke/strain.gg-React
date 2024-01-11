// ./middleware/requestLogger.ts

import { Request, Response, NextFunction } from "express";
import logger from "./logger";

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const now = new Date().toISOString();
  const meta = {
    time: now,
    ip: req.ip,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
  };
  logger.info(`HTTP Request`, meta);
  next();
};

export default requestLogger;
