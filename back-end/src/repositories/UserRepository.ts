import { User, Role, Token } from "../models";
import { Op } from "sequelize";
import logger from "../middleware/logger";
import { ServerError } from "../errors";

interface CreateParams {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  Roles?: Role[];
}

class UserRepository {
  async createUser(userData: CreateParams): Promise<User> {
    logger.info(`Creating user with params ${JSON.stringify(userData)}`);
    try {
      const user = await User.create(userData);
      if (userData.Roles) {
        await user.addRoles(await user.getRoles());
      }
      return user;
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async findById(id: number): Promise<User | null> {
    logger.info(`Finding user with id ${id}`);
    try {
      return User.findOne({
        where: { id },
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async findByToken(token: string, tokenType: string): Promise<User | null> {
    logger.info(`Finding user by token ${token}`);
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
      throw new ServerError(err.message);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.info(`Finding user by email ${email}`);
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async findAll(): Promise<User[]> {
    logger.warn("Fetching all users");
    logger.info("Fetching all users");
    try {
      return await User.findAll({
        attributes: ["id", "name", "email"],
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async updateUserById(id: number, userData: any): Promise<void> {
    logger.info(
      `Updating user with id ${id} with params ${JSON.stringify(userData)}`
    );
    try {
      await User.update(userData, { where: { id } });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async deleteUserById(id: number): Promise<void> {
    logger.info(`Deleting user with id ${id}`);
    try {
      await User.destroy({ where: { id } });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }
}

export default new UserRepository();
