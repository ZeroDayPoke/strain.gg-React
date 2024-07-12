// UserProfileService.ts
import { UserRepository } from "../../repositories";
import { hashPassword } from "./UserUtilityService";
import { User } from "../../models/index";
import logger from "../../middleware/logger";
import {
  TokenGenerationService,
  TokenValidationService,
} from "../TokenService";
import EmailService from "../EmailService";
import { NotFoundError, ValidationError } from "../../errors";
import { CreateUserParams } from "@zerodaypoke/strange-types";

class UserProfileService {
  async requestEmailVerification(email: string): Promise<void> {
    logger.debug(`Requesting email verification for email: ${email}`);
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError("No user found with that email address.");
      }

      const verificationToken =
        await TokenGenerationService.generateEmailVerificationToken(user.id);
      await EmailService.sendVerificationEmail(
        user.email,
        verificationToken.token
      );
    } catch (err) {
      throw err;
    }
  }

  async verifyEmail(token: string): Promise<User> {
    logger.debug(`Verifying email with token: ${token}`);
    try {
      const user = await UserRepository.findByToken(token, "emailVerification");

      if (!user) {
        logger.error(`Invalid or expired token: ${token}`);
        throw new ValidationError("Invalid or expired token");
      }

      user.isVerified = true;
      await UserRepository.updateUserById(user.id, user);

      logger.info(`Email verified for user with ID: ${user.id}`);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async verifyEmailToken(token: string): Promise<User> {
    logger.debug(`Verifying email with token: ${token}`);
    try {
      const user = await UserRepository.findByToken(token, "emailVerification");

      if (!user) {
        logger.error(`Invalid or expired token: ${token}`);
        throw new ValidationError("Invalid or expired token");
      }

      user.isVerified = true;
      await UserRepository.updateUserById(user.id, user);

      logger.info(`Email verified for user with ID: ${user.id}`);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    logger.info(`Fetching user by email: ${email}`);
    try {
      return await UserRepository.findByEmail(email);
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      logger.info("Fetching all users");
      return await User.findAll({
        attributes: ["id", "name", "email"],
      });
    } catch (err) {
      throw err;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      logger.info(`Requesting password reset for email: ${email}`);
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new ValidationError("No user found with that email address.");
      }

      const resetToken =
        await TokenGenerationService.generatePasswordResetToken(user.id);
      await EmailService.sendResetPasswordEmail(user.email, resetToken.token);
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    logger.debug(`Resetting password with token: ${token}`);
    try {
      logger.info(`Resetting password with token: ${token}`);
      const userId = await TokenValidationService.validatePasswordResetToken(
        token
      );
      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new ValidationError("Invalid or expired reset token.");
      }

      user.setDataValue("password", await hashPassword(newPassword));
      await UserRepository.updateUserById(user.id, user);
    } catch (err) {
      throw err;
    }
  }

  async getUserRoles(userId: number): Promise<string[]> {
    logger.debug(`Fetching roles for user with ID: ${userId}`);
    try {
      logger.info(`Fetching roles for user with ID: ${userId}`);
      const user = await UserRepository.findById(userId);
      if (!user) throw new NotFoundError("User not found");

      return (await user.getRoles()).map((role) => role.name);
    } catch (err) {
      throw err;
    }
  }

  async createUser(params: CreateUserParams): Promise<User> {
    logger.debug(`Creating user with email: ${params.email}`);
    try {
      const hashedPassword = await hashPassword(params.password);
      const user = await UserRepository.createUser({
        name: params.name,
        email: params.email,
        password: hashedPassword,
        phone: params.phone,
      });

      TokenGenerationService.generateEmailVerificationToken(user.id);

      logger.info(`User created with email: ${params.email}`);

      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    logger.debug(`Fetching user by ID: ${userId}`);
    try {
      return await UserRepository.findById(userId);
    } catch (err) {
      throw err;
    }
  }
}

export default new UserProfileService();
