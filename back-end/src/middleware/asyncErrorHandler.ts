// ./middleware/asyncErrorHandler.ts

import { Request, Response, NextFunction } from "express";
import logger from "./logger";

const asyncErrorHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): any => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      const errorDetails = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
      };
      logger.error("Async error occurred: ", errorDetails);
      next(err);
    });
  };

export default asyncErrorHandler;
