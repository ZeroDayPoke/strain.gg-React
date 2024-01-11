// ./services/UserService.ts

import bcrypt from "bcrypt";
import { User, Role } from "../models/index";
import TokenService from "./TokenService";
import EmailService from "./EmailService";
import logger from "../middleware/logger";
import UserRepository from "../repositories/UserRepository";
import {
  NotFoundError,
  ServerError,
  ValidationError,
  AuthenticationError,
} from "../errors";

interface CreateUserParams {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthenticateParams {
  email: string;
  password: string;
}

class UserService {
  async createUser(params: CreateUserParams): Promise<User> {
    try {
      logger.info(`Creating user with email: ${params.email}`);
      const hashedPassword = await bcrypt.hash(params.password, 10);
      const user = await UserRepository.createUser({
        name: params.name,
        email: params.email,
        password: hashedPassword,
        phone: params.phone,
      });

      const verificationToken = TokenService.generateEmailVerificationToken(
        user.id
      );

      logger.info(`User created with email: ${params.email}`);

      return user;
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      logger.info(`Fetching user by ID: ${userId}`);
      return await UserRepository.findById(userId);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      logger.info("Fetching all users");
      return await User.findAll({
        attributes: ["id", "name", "email"],
        include: [Role],
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      logger.info(`Requesting password reset for email: ${email}`);
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new ValidationError("No user found with that email address.");
      }

      const resetToken = await TokenService.generatePasswordResetToken(user.id);
      await EmailService.sendResetPasswordEmail(user.email, resetToken.token);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      logger.info(`Resetting password with token: ${token}`);
      const userId = await TokenService.validatePasswordResetToken(token);
      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new ValidationError("Invalid or expired reset token.");
      }

      user.setDataValue("password", await bcrypt.hash(newPassword, 10));
      await UserRepository.updateUserById(user.id, user);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async getUserRoles(userId: number): Promise<string[]> {
    try {
      logger.info(`Fetching roles for user with ID: ${userId}`);
      const user = await User.findByPk(userId, { include: [Role] });
      if (!user) {
        throw new NotFoundError("User not found");
      }
      const roles = await user?.getRoles();
      if (!roles) {
        throw new NotFoundError("User not found");
      }
      return roles.map((role: Role) => role.name);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async requestEmailVerification(email: string): Promise<void> {
    logger.info(`Requesting email verification for email: ${email}`);
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError("No user found with that email address.");
      }

      const verificationToken =
        await TokenService.generateEmailVerificationToken(user.id);
      await EmailService.sendVerificationEmail(
        user.email,
        verificationToken.token
      );
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async verifyEmail(token: string): Promise<User> {
    try {
      logger.info(`Verifying email with token: ${token}`);
      const user = await UserRepository.findByToken(token, "emailVerification");

      if (!user) {
        logger.error(`Invalid or expired token: ${token}`);
        throw new ValidationError("Invalid or expired token");
      }

      // user.isVerified = true;
      await UserRepository.updateUserById(user.id, user);

      logger.info(`Email verified for user with ID: ${user.id}`);
      return user;
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async verifyEmailToken(token: string): Promise<User> {
    try {
      logger.info(`Verifying email with token: ${token}`);
      const user = await UserRepository.findByToken(token, "emailVerification");

      if (!user) {
        logger.error(`Invalid or expired token: ${token}`);
        throw new ValidationError("Invalid or expired token");
      }

      // user.isVerified = true;
      await UserRepository.updateUserById(user.id, user);

      logger.info(`Email verified for user with ID: ${user.id}`);
      return user;
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async authenticate(
    params: AuthenticateParams
  ): Promise<{ user: User; accessToken: string }> {
    try {
      logger.info(`Authenticating user with email: ${params.email}`);
      const user = await UserRepository.findByEmail(params.email);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const isMatch = await bcrypt.compare(
        params.password,
        user.getDataValue("password")
      );
      if (!isMatch) {
        throw new AuthenticationError("Incorrect password");
      }

      const accessToken = await this._generateUserAccessToken(user);
      logger.info(`Generated access token for user with ID: ${user.id}`);
      return { user, accessToken };
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async _findUserByEmailWithRoles(email: string): Promise<User | null> {
    logger.info(`Fetching user by email: ${email}`);
    try {
      return await UserRepository.findByEmail(email);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async _generateUserAccessToken(user: User): Promise<string> {
    logger.info(`Generating access token for user with ID: ${user.id}`);
    try {
      const roles = await user.getRoles();
      return TokenService.generateAccessToken(
        user.id,
        roles.map((role: Role) => role.name)
      );
    } catch (err) {
      throw new ServerError(err.message);
    }
  }
}

export default new UserService();
