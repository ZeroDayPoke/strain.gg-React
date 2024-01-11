// ./middleware/roleCheck.ts

import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import TokenService from "../services/TokenService";
import { Role } from "../models";
import logger from "./logger";
import asyncErrorHandler from "./asyncErrorHandler";
import { AuthorizationError } from "../errors";

const requireRole = (requiredRole: string) => {
  return asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      logger.info(`Role Required: ${requiredRole}`);
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new AuthorizationError("Token not provided");
      }

      const decodedTokenUserId = await TokenService._validateToken(
        token,
        "access"
      );

      if (!decodedTokenUserId) {
        throw new AuthorizationError("Invalid token");
      }

      const user = await UserService.getUserById(decodedTokenUserId);
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
