// ./middleware/roleCheck.ts

import { TokenValidationService } from "../services/TokenService";
import { Role, Token } from "../models";
import logger from "./logger";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthorizationError } from "../errors";
import { UserProfileService } from "../services/UserService";
import { TokenType } from "@zerodaypoke/strange-types";
import {
  MiddlewareFunctionWithTokenAndSession,
  RequestWithTokenAndSession,
} from "@zerodaypoke/strange-types";

type RoleCheckHigherOrderFunction = (
  requiredRole: string
) => MiddlewareFunctionWithTokenAndSession;

const requireRole: RoleCheckHigherOrderFunction = (requiredRole) => {
  return asyncErrorHandler<RequestWithTokenAndSession>(
    async (req, res, next) => {
      logger.info(`Role Required: ${requiredRole}`);
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new AuthorizationError("Token not provided");
      }

      const decodedTokenUserId = await TokenValidationService._validateToken(
        token,
        TokenType.Access
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
