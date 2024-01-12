import { Token } from "../models";
import { Op } from "sequelize";
import ms from "ms";
import logger from "../middleware/logger";
import { ServerError, ValidationError } from "../errors";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

class TokenRepository {
  async createToken(tokenData: {
    userId: number;
    token: string;
    type: string;
    expiration: Date;
  }): Promise<Token> {
    logger.info(`Creating token for user ${tokenData.userId}`);
    try {
      return await Token.create(tokenData);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async findTokenByString({
    token,
    type,
    isValid = true,
  }: {
    token: string;
    type: TokenType;
    isValid?: boolean;
  }): Promise<Token | null> {
    logger.info(`Finding token by string: ${token}`);
    try {
      const condition = isValid ? { expiration: { [Op.gt]: new Date() } } : {};
      return await Token.findOne({
        where: { token, type, ...condition },
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async invalidateToken(tokenId: number): Promise<void> {
    logger.info(`Invalidating token with ID: ${tokenId}`);
    try {
      const token = await Token.findByPk(tokenId);
      if (!token) {
        throw new ValidationError("Token not found");
      }
      await token.destroy();
      logger.info(`Token with ID: ${tokenId} has been invalidated.`);
    } catch (err) {
      throw new ServerError(`Error invalidating token: ${err.message}`);
    }
  }

  async getUserTokens(userId: number, type?: TokenType): Promise<Token[]> {
    logger.info(`Fetching tokens for user: ${userId}`);
    try {
      const whereConditions = type ? { userId, type } : { userId };
      return await Token.findAll({
        where: whereConditions,
      });
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async refreshToken(token: string, newExpiryTime: string): Promise<Token> {
    logger.info(`Refreshing token: ${token}`);
    try {
      const existingToken = await this.findTokenByString({
        token: token,
        type: TokenType.Access,
        isValid: true,
      });

      if (!existingToken) {
        throw new ValidationError("Invalid or expired token for refresh");
      }

      const newExpiration = this._calculateExpiry(newExpiryTime);
      existingToken.expiration = newExpiration;
      await existingToken.save();

      return existingToken;
    } catch (err) {
      throw new ServerError(`Failed to refresh token: ${err.message}`);
    }
  }

  private _calculateExpiry(expiryTime: string): Date {
    return new Date(Date.now() + ms(expiryTime));
  }
}

export default new TokenRepository();
