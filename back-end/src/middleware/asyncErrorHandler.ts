// src/middleware/asyncErrorHandler.ts

import { Response, NextFunction } from "express";
import {
  ExtendedRequest,
  MiddlewareFunction,
} from "@zerodaypoke/strange-types";

/**
 * Higher-order function to wrap middleware functions for handling asynchronous operations.
 * It captures any errors thrown by the async middleware and passes them to the next error handling middleware.
 *
 * @param {MiddlewareFunction} fn - The middleware function to wrap.
 * @returns {MiddlewareFunction} - A new middleware function with error handling.
 */
function asyncErrorHandler(fn: MiddlewareFunction): MiddlewareFunction {
  return async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default asyncErrorHandler;
