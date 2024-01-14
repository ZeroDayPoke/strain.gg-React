import { User, Role, Token } from "../models";
import { Op } from "sequelize";
import logger from "../middleware/logger";
import { CreateUserParams } from "@zerodaypoke/strange-types";

class UserRepository {
  async createUser(userData: CreateUserParams): Promise<User> {
    logger.debug(`Creating user with params: ${JSON.stringify(userData)}`);
    try {
      const user = await User.create(userData);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findById(id: number): Promise<User | null> {
    logger.debug(`Fetching user by ID: ${id}`);
    try {
      return User.findOne({
        where: { id },
      });
    } catch (err) {
      throw err;
    }
  }

  async findByToken(token: string, tokenType: string): Promise<User | null> {
    logger.debug(`Fetching user by token: ${token}`);
    try {
      const tokenRecord = await Token.findOne({
        where: {
          token: token,
          type: tokenType,
          expiration: { [Op.gt]: new Date() },
        },
      });

      if (!tokenRecord) return null;

      return this.findById(tokenRecord.userId);
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.debug(`Fetching user by email: ${email}`);
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<User[]> {
    logger.debug("Fetching all users");
    logger.warn("Fetching all users");
    logger.info("Fetching all users");
    try {
      return await User.findAll({
        attributes: ["id", "name", "email"],
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUserById(id: number, userData: any): Promise<void> {
    logger.debug(
      `Updating user with id ${id} with params ${JSON.stringify(userData)}`
    );
    try {
      await User.update(userData, { where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async deleteUserById(id: number): Promise<void> {
    logger.debug(`Deleting user with id ${id}`);
    try {
      await User.destroy({ where: { id } });
    } catch (err) {
      throw err;
    }
  }
}

export default new UserRepository();
