// src/middleware/roleCheck.ts
import {
  ExtendedRequest,
  RoleCheckHigherOrderFunction,
} from "@zerodaypoke/strange-types";
import {
  TokenValidationService,
  UserTokenType,
  UserProfileService,
} from "../services";
import { Role } from "../models/index";
import logger from "./logger";
import asyncErrorHandler from "./asyncErrorHandler";
import { Response, NextFunction } from "express";
import { AuthorizationError } from "../errors";

/**
 * Middleware for role-based access control. This middleware ensures that a user has the required role
 * to access a specific route. It performs the following checks:
 *
 * - Extracts the JWT token from the 'Authorization' header.
 * - Validates the token and retrieves the user ID from the decoded token.
 * - Fetches the user's roles using the UserProfileService.
 * - Checks if the user has the required role.
 * - If the user does not have the required role, throws an AuthorizationError.
 *
 * Usage:
 * This middleware should be used in routes where access is restricted based on user roles.
 * It can be used as a higher-order function that takes the required role as a parameter and
 * returns a middleware function.
 *
 * Example:
 *   router.use(requireRole("Admin"));
 *   router.get("/admin-only-route", (req, res) => { ... });
 */
const requireRole: RoleCheckHigherOrderFunction = (requiredRole: string) => {
  return asyncErrorHandler(
    async (req: ExtendedRequest, res: Response, next: NextFunction) => {
      logger.info(`Role Required: ${requiredRole}`);
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new AuthorizationError("Token not provided");
      }

      const decodedTokenUserId = await TokenValidationService._validateToken(
        token,
        UserTokenType.Access
      );

      if (!decodedTokenUserId) {
        throw new AuthorizationError("Invalid token");
      }

      const user = await UserProfileService.getUserById(decodedTokenUserId);
      const hasRequiredRole =
        (await user.getRoles())
          .map((role: Role) => role.name)
          .includes(requiredRole) || false;

      if (!hasRequiredRole) {
        throw new AuthorizationError(
          `Forbidden: you don't have the required ${requiredRole} role`
        );
      }

      logger.info(
        `User with ID: ${decodedTokenUserId} has the required ${requiredRole} role`
      );
      next();
    }
  );
};

export default requireRole;
