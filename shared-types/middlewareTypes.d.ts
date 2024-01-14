// Middleware
import { NextFunction, Request, Response } from "express";
import session from "express-session";

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

export interface ExtendedRequest extends Request {
  headers: {
    authorization?: string;
  };
  token?: string;
  decodedToken?: DecodedToken;
  session: session.Session & Partial<{ data: UserSessionData }>;
}

export type MiddlewareFunction = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface RequestWithAuthHeader extends Request {
  headers: {
    authorization?: string;
  };
}

export interface RequestWithDecodedToken extends Request {
  token: string;
  decodedToken: DecodedToken;
}

export interface RequestWithSessionData extends Request {
  session: session.Session & Partial<{ data: UserSessionData }>;
}

export interface RequestWithTokenAndSession extends Request {
  token: string;
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

export type AsyncMiddlewareFunction<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type RoleCheckHigherOrderFunction = (
  requiredRole: string
) => MiddlewareFunction;
