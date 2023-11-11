// ./services/UserService.js

import bcrypt from "bcrypt";
import { User, Role, UserRole } from "../models/User.js";
import { Op } from "sequelize";
import TokenService from "./TokenService.js";
import EmailService from "./EmailService.js";
import Strain from "../models/Strain.js";
import { logger } from "../middleware/requestLogger.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

class UserService {
  async getUserById(id) {
    logger.info(`Fetching user by ID: ${id}`);
    const user = await User.findOne({ where: { id }, include: [Role] });
    return user;
  }

  async createUser({ name, email, password, phone }) {
    logger.info(`Creating user with email: ${email}`);
    const user = await User.create({ name, email, password, phone });

    const verificationToken = TokenService.generateVerificationToken(user);
    user.verificationToken = verificationToken;
    user.verificationTokenExpiration = Date.now() + 3600000; // 1 hour from now

    await user.save();
    logger.info(`User created with email: ${email}`);
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    return user;
  }

  async authenticate({ email, password }) {
    logger.info(`Authenticating user with email: ${email}`);
    const user = await User.findOne({ where: { email }, include: [Role] });

    if (!user) {
      logger.error(`No user found with email: ${email}`);
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.error(`Incorrect password for user with email: ${email}`);
      throw new Error("Incorrect password");
    }

    const accessToken = TokenService.generateAccessToken(user.id, user.email);
    logger.info(`Access token generated for user with email: ${email}`);

    return { user, accessToken };
  }

  async verifyEmailToken(token) {
    logger.info(`Verifying email with token: ${token}`);
    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      logger.error(`Invalid or expired token: ${token}`);
      throw new Error("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiration = null;
    await user.save();

    logger.info(`Email verified for user with ID: ${user.id}`);
    return user;
  }

  async getAllUsers() {
    logger.info(`Fetching all users`);
    const users = await User.findAll({ include: [Role] });

    // Remove password from the user data
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async addFavoriteStrain(userId, strainId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new Error("Strain not found");
    }

    await user.addFavorites(strain);
  }

  async removeFavoriteStrain(userId, strainId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const strain = await Strain.findByPk(strainId);
    if (!strain) {
      throw new Error("Strain not found");
    }

    await user.removeFavorites(strain);
  }

  async getFavoriteStrains(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Strain,
          as: "favorites",
          through: {
            attributes: [],
          },
          attributes: ["id"],
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Map over the favorites array and select only the IDs
    const favoriteIds = user.favorites.map((strain) => strain.id);

    return favoriteIds;
}

  async requestPasswordReset(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("No user found with that email address.");
    }

    const resetToken = TokenService.generateResetToken(user);
    await EmailService.sendResetPasswordEmail(user.email, resetToken);
  }

  async resetPassword(token, newPassword) {
    const userId = TokenService.verifyResetToken(token).id;
    console.log(userId, newPassword);
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Invalid or expired reset token.");
    }

    user.password = newPassword;
    await user.save();
    console.log("New password saved for user ID:", userId);
  }

  async requestEmailVerification(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("No user found with that email address.");
    }

    const verificationToken = TokenService.generateVerificationToken(user);
    await EmailService.sendVerificationEmail(user, verificationToken);
  }

  async verifyEmail(token) {
    const userId = TokenService.verifyVerificationToken(token);
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Invalid or expired verification token.");
    }

    user.isVerified = true;
    await user.save();
  }
}

export default new UserService();
