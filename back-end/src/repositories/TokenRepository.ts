// src/repositories/TokenRepository.ts
import { Op } from "sequelize";
import { UserTokenType } from "../services/TokenService";
import ms from "ms";
import logger from "../middleware/logger";
import { ValidationError } from "../errors";
import { Token } from "../models";

class TokenRepository {
  async createToken(tokenData: {
    userId: number;
    token: string;
    type: string;
    expiration: Date;
  }): Promise<Token> {
    logger.debug(`Creating token: ${tokenData.token}`);
    try {
      return await Token.create(tokenData);
    } catch (err) {
      throw err;
    }
  }

  async findTokenByString({
    token,
    type,
    isValid = true,
  }: {
    token: string;
    type: UserTokenType;
    isValid?: boolean;
  }): Promise<Token | null> {
    logger.debug(`Finding token: ${token}`);
    try {
      const condition = isValid ? { expiration: { [Op.gt]: new Date() } } : {};
      return await Token.findOne({
        where: { token, type, ...condition },
      });
    } catch (err) {
      throw err;
    }
  }

  async invalidateToken(tokenId: number): Promise<void> {
    logger.debug(`Invalidating token with ID: ${tokenId}`);
    try {
      const token = await Token.findByPk(tokenId);
      if (!token) {
        throw new ValidationError("Token not found");
      }
      await token.destroy();
      logger.info(`Token with ID: ${tokenId} has been invalidated.`);
    } catch (err) {
      throw err;
    }
  }

  async getUserTokens(userId: number, type?: UserTokenType): Promise<Token[]> {
    logger.debug(`Getting tokens for user with ID: ${userId}`);
    try {
      const whereConditions = type ? { userId, type } : { userId };
      return await Token.findAll({
        where: whereConditions,
      });
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(token: string, newExpiryTime: string): Promise<string> {
    logger.debug(`Refreshing token: ${token}`);
    try {
      const existingToken = await this.findTokenByString({
        token: token,
        type: UserTokenType.Access,
        isValid: true,
      });

      if (!existingToken) {
        throw new ValidationError("Invalid or expired token for refresh");
      }

      const newExpiration = this._calculateExpiry(newExpiryTime);
      existingToken.expiration = newExpiration;
      await existingToken.save();

      return existingToken.token;
    } catch (err) {
      throw err;
    }
  }

  private _calculateExpiry(expiryTime: string): Date {
    return new Date(Date.now() + ms(expiryTime));
  }
}

export default new TokenRepository();
