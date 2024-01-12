// ./controllers/UserController.ts

import {
  UserAuthenticationService,
  UserProfileService,
  UserUtilityService,
} from "../services/UserService";
import {
  TokenGenerationService,
  TokenRefreshService,
  TokenUtilityService,
  TokenValidationService,
} from "../services/TokenService";
import asyncErrorHandler from "../middleware/asyncErrorHandler";
import { Role, Token, User } from "../models";
import logger from "../middleware/logger";
import { storeEssentialUserDataInSession } from "../utils/sessionUtils";
import { ServerError, ValidationError, AuthenticationError } from "../errors";
import e, { Request, Response, NextFunction } from "express";
import { validateUser } from "../validation";
import session from "express-session";

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

interface UserResponse {
  message: string;
  userId: string;
  token: string;
}

const UserController = {
  signUp: asyncErrorHandler(
    async (req: RequestWithUserToken, res: Response): Promise<void> => {
      const { error } = validateUser(req.body);
      if (error) {
        logger.warn(
          `Validation error during sign up: ${error.details[0].message}`
        );
        throw new ValidationError(error.details[0].message);
      }

      const existingUser = await UserProfileService.findUserByEmail(
        req.body.email
      );

      if (existingUser) {
        logger.warn(`Email already in use: ${req.body.email}`);
        throw new ValidationError("Email already in use");
      }

      try {
        const user: User = await UserProfileService.createUser(req.body);
        if (!user) {
          throw new ServerError(error.details[0].message);
        }

        logger.info(`New user created with ID: ${user.id}`);
        const roles = (await user.getRoles()).map((role: Role) => role.name);

        const accessToken = await TokenGenerationService.generateAccessToken(
          user.id,
          roles
        );
        logger.debug(`Access token generated for user: ${user.id}`);
        storeEssentialUserDataInSession(req);

        res.status(201).json({
          message: "User created successfully",
          userId: user.id,
          token: accessToken,
        });
      } catch (err) {
        throw new ServerError("Failed to create user");
      }
    }
  ),

  logIn: asyncErrorHandler(
    async (req: RequestWithUserToken, res: Response): Promise<void> => {
      const { email, password } = req.body;
      logger.info(`Login attempt for email: ${email}`);

      try {
        const { user, accessToken } =
          await UserAuthenticationService.authenticate({
            email,
            password,
          });

        if (!user) {
          logger.warn(`Login failed for email: ${email}`);
          throw new AuthenticationError("Invalid email or password");
        }

        logger.info(`User ${user.id} authenticated successfully`);

        req.session.userId = user.id;
        req.session.roles = (await user.getRoles()).map(
          (role: Role) => role.name
        );

        logger.debug(`Session data stored for user: ${user.id}`);
        res.status(200).json({
          message: "Login successful",
          token: accessToken,
          userId: user.id,
        });
      } catch (err) {
        throw new AuthenticationError("Login failed");
      }
    }
  ),

  logOut: asyncErrorHandler(
    async (req: RequestWithUserToken, res: Response): Promise<void> => {
      if (!req.session) {
        logger.warn("Attempted logout without an active session");
        throw new ServerError("No active session to log out from");
      }

      logger.info(`Logging out user from session: ${req.session.id}`);

      TokenValidationService.invalidateOnLogout(req.session.userId);

      req.session.destroy((err) => {
        if (err) {
          throw new ServerError("Error logging out user");
        } else {
          logger.debug(`Session ${req.session.id} destroyed successfully`);
          res.clearCookie("sessionId");
          res.status(200).json("Logout successful");
        }
      });
    }
  ),

  verify: asyncErrorHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        await UserProfileService.verifyEmailToken(req.query.token as string);
        logger.debug(`User verified with token: ${req.query.token}`);
        res.status(200).json({ message: "User verified" });
      } catch (err) {
        throw new ServerError("Failed to verify email");
      }
    }
  ),

  getAllUsers: asyncErrorHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users = await UserProfileService.getAllUsers();
        logger.debug(`All users data: ${JSON.stringify(users)}`);
        res.status(200).json(users);
      } catch (err) {
        throw new ServerError("Failed to get all users");
      }
    }
  ),

  requestResetPassword: asyncErrorHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        await UserProfileService.requestPasswordReset(req.body.email);
        logger.debug(`Password reset requested for: ${req.body.email}`);
        res.status(200).json({ message: "Password reset email sent" });
      } catch (err) {
        throw new ServerError("Failed to request password reset");
      }
    }
  ),
};

export default UserController;
