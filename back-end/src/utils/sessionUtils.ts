import { Request } from "express";
import session from "express-session";
import { AuthorizationError } from "../errors";

interface DecodedToken {
  userId: number;
  roles: string[];
}

interface RequestWithSession extends Request {
  session: session.Session &
    Partial<session.SessionData> & { userId?: number; roles?: string[] };
}

/**
 * Stores essential user data (ID and roles) in the session.
 * @param req - The request object.
 * @param userData - The decoded token data containing the user ID and roles.
 */
export function storeEssentialUserDataInSession(
  req: RequestWithSession,
  userData: DecodedToken
): void {
  if (!userData || !req.session) {
    throw new AuthorizationError("Failed to store user data in session");
  }

  req.session.userId = userData.userId;
  req.session.roles = userData.roles;
}
