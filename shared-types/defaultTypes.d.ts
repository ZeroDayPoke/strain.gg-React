// ./src/types/defaultTypes.tsx
import { NextFunction, Request, Response } from "express";
import session from "express-session";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  lastLogin?: Date;
  isVerified: boolean;
}

interface TokenAttributes {
  id: number;
  userId: number;
  token: string;
  type: string;
  expiration: Date;
}

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

type AsyncMiddlewareFunction<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface NavBarItem {
  name: string;
  path: string;
  requiresLogin: boolean;
  adminOnly: boolean;
  hideWhenLoggedIn: boolean;
}

export interface NavBarProps {
  items: NavBarItem[];
}

interface UserResponse {
  message: string;
  userId: number;
  token: string;
  roles?: string[];
}
