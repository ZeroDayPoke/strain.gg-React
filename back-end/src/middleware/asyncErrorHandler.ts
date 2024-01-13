import { Request, Response, NextFunction } from "express";
import {
  MiddlewareFunctionWithTokenAndSession,
  MiddlewareFunctionWithToken,
  MiddlewareFunctionWithSession,
  AsyncMiddlewareFunction,
} from "@zerodaypoke/strange-types";

function asyncErrorHandler<T extends Request>(
  fn: AsyncMiddlewareFunction<T>
):
  | MiddlewareFunctionWithTokenAndSession
  | MiddlewareFunctionWithToken
  | MiddlewareFunctionWithSession {
  return async (req: T, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default asyncErrorHandler;
