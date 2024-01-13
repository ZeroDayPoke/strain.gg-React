import { Request, Response, NextFunction, RequestHandler } from "express";
import session from "express-session";
import logger from "./logger";

export interface DecodedToken {
  userId: number;
  roles: string[];
}

export interface UserSessionData {
  userId: number;
  roles: string[];
}

declare module "express-session" {
  interface Session {
    data: UserSessionData;
  }
}

export interface RequestWithDecodedToken extends Request {
  token: string;
  decodedToken: DecodedToken;
}

export interface RequestWithSessionData extends Request {
  session: session.Session & Partial<{ data: UserSessionData }>;
}

export interface RequestWithTokenAndSession extends Request {
  tokne: string;
  decodedToken: DecodedToken;
  session: session.Session & Partial<{ data: UserSessionData }>;
}

export type MiddlewareFunctionWithToken = (
  req: RequestWithDecodedToken,
  res: Response,
  next: NextFunction
) => Promise<void>;
export type MiddlewareFunctionWithSession = (
  req: RequestWithSessionData,
  res: Response,
  next: NextFunction
) => Promise<void>;
export type MiddlewareFunctionWithTokenAndSession = (
  req: RequestWithTokenAndSession,
  res: Response,
  next: NextFunction
) => Promise<void>;

type AsyncMiddlewareFunction<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

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
