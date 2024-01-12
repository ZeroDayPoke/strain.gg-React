import { Request } from "express";
import session from "express-session";
import { AuthorizationError } from "../errors";

interface DecodedToken {
  userId: number;
  roles: string[];
}

interface RequestWithUserToken extends Request {
  session: session.Session & {
    userId: number;
    roles: string[];
  };
  accessToken: DecodedToken;
}

/**
 * Stores essential user data (ID and roles) in the session.
 * @param req - The request object.
 */
export function storeEssentialUserDataInSession(
  req: RequestWithUserToken
): void {
  if (!req.session.userId || !req.session) {
    throw new AuthorizationError("Failed to store user data in session");
  }

  req.session.userId = req.accessToken.userId;
  req.session.roles = req.accessToken.roles;
}
