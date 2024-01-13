// storeEssentialUserDataInSession.ts
import logger from "../middleware/logger";
import { RequestWithTokenAndSession } from "@zerodaypoke/strange-types";

/**
 * Stores essential user data in the session.
 * This function is particularly useful in non-production environments
 * where session data might not be persistently stored.
 *
 * @param req - The request object that includes the session and decoded token.
 */
export default function storeEssentialUserDataInSession(
  req: RequestWithTokenAndSession
): void {
  if (!req.session.data) {
    req.session.data = {
      userId: 0,
      roles: [],
    };
  }

  const { userId, roles } = req.decodedToken;

  // Check if session data needs to be updated
  if (
    req.session.data.userId !== userId ||
    !arraysEqual(req.session.data.roles, roles)
  ) {
    req.session.data.userId = userId;
    req.session.data.roles = roles;
    logger.info(`Session data updated for user ID: ${userId}`);
  }
}

/**
 * Helper function to check if two arrays are equal.
 *
 * @param arr1 - The first array.
 * @param arr2 - The second array.
 * @returns True if the arrays are equal, false otherwise.
 */
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
