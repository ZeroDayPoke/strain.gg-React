// ./controllers/UserController.ts

import {
  UserAuthenticationService,
  UserProfileService,
} from "../services/UserService";
import {
  TokenRefreshService,
  TokenGenerationService,
  TokenValidationService,
} from "../services/TokenService";
import { Role, User } from "../models";
import logger from "../middleware/logger";
import { ServerError, ValidationError, AuthenticationError } from "../errors";
import { Request, Response, NextFunction } from "express";
import { validateUser } from "../validation";
import {
  RequestWithTokenAndSession,
  UserResponse,
} from "@zerodaypoke/strange-types";

const UserController = {
  signUp: async (req: Request, res: Response<UserResponse>): Promise<void> => {
    logger.debug(`Signing up user with email: ${req.body.email}`);
    try {
      const { error } = validateUser(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const existingUser = await UserProfileService.findUserByEmail(
        req.body.email
      );
      if (existingUser) {
        throw new ValidationError("Email already in use");
      }

      const user: User = await UserProfileService.createUser(req.body);
      if (!user) {
        throw new ServerError("Failed to create user");
      }

      const roles = (await user.getRoles()).map((role: Role) => role.name);
      const accessToken = await TokenGenerationService.generateAccessToken(
        user.id,
        roles
      );
      req.session.data = { userId: user.id, roles: roles };

      res.status(201).json({
        message: "User created successfully",
        userId: user.id,
        token: accessToken,
      });
    } catch (err) {
      throw err;
    }
  },

  logIn: async (req: Request, res: Response<UserResponse>): Promise<void> => {
    logger.debug(`Logging in user with email: ${req.body.email}`);
    try {
      const { user, accessToken } =
        await UserAuthenticationService.authenticate({
          email: req.body.email,
          password: req.body.password,
        });

      if (!user) {
        throw new AuthenticationError("Invalid email or password");
      }

      req.session.data = {
        userId: user.id,
        roles: (await user.getRoles()).map((role: Role) => role.name),
      };

      res.status(200).json({
        message: "Login successful",
        token: accessToken,
        userId: user.id,
      });
    } catch (err) {
      throw err;
    }
  },

  logOut: async (
    req: RequestWithTokenAndSession,
    res: Response
  ): Promise<void> => {
    logger.debug(`Logging out user with ID: ${req.session.data.userId}`);
    try {
      await TokenValidationService.invalidateOnLogout(req.session.data.userId);
      req.session.destroy((err) => {
        if (err) {
          throw new ServerError("Error logging out user");
        } else {
          logger.debug(`Session ${req.session.id} destroyed successfully`);
          res.clearCookie("sessionId");
          res.status(200).json("Logout successful");
        }
      });
    } catch (err) {
      throw err;
    }
  },

  checkSession: async (
    req: RequestWithTokenAndSession,
    res: Response<UserResponse>
  ): Promise<void> => {
    logger.debug(
      `Checking session for user with ID: ${req.session.data.userId}`
    );
    try {
      if (!req.session.data.userId) {
        throw new AuthenticationError("Session invalid or expired");
      }

      res.status(200).json({
        message: "User session is valid",
        userId: req.session.data.userId,
        roles: req.session.data.roles,
        token: await TokenRefreshService.refreshToken(req.token),
      });
    } catch (err) {
      throw err;
    }
  },

  verify: async (
    req: RequestWithTokenAndSession,
    res: Response
  ): Promise<void> => {
    logger.debug(`Verifying user with token: ${req.query.token}`);
    try {
      await UserProfileService.verifyEmailToken(req.query.token as string);
      res.status(200).json({ message: "User verified" });
    } catch (err) {
      throw err;
    }
  },

  getAllUsers: async (
    req: RequestWithTokenAndSession,
    res: Response
  ): Promise<void> => {
    logger.debug("Getting all users");
    try {
      const users = await UserProfileService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      throw err;
    }
  },

  requestResetPassword: async (
    req: RequestWithTokenAndSession,
    res: Response
  ): Promise<void> => {
    logger.debug(`Requesting password reset for: ${req.body.email}`);
    try {
      await UserProfileService.requestPasswordReset(req.body.email);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
      throw err;
    }
  },
};

export default UserController;
