// TokenGenerationService.ts

import crypto from "crypto";
import { TokenRepository } from "../../repositories/index";
import { _signJwt, _calculateExpiry } from "./TokenUtilityService";
import ENV from "../../utils/loadEnv";
import logger from "../../middleware/logger";
import { UserTokenType } from ".";
import { Token } from "../../models";

class TokenGenerationService {
  static async _generateToken(
    userId: number,
    tokenType: UserTokenType,
    expiryTime: string
  ): Promise<Token> {
    logger.debug(`Generating ${tokenType} token for user with ID: ${userId}`);
    try {
      const token = crypto.randomBytes(20).toString("hex");
      return await TokenRepository.createToken({
        userId,
        token,
        type: tokenType,
        expiration: _calculateExpiry(expiryTime),
      });
    } catch (err) {
      throw err;
    }
  }

  private static async manageExistingTokens(
    userId: number,
    tokenType: UserTokenType
  ): Promise<Token | null> {
    logger.debug(`Managing existing tokens for user with ID: ${userId}`);
    try {
      const existingTokens = await TokenRepository.getUserTokens(
        userId,
        tokenType
      );
      const validTokens = existingTokens.filter(
        (token) => token.expiration >= new Date()
      );

      // Invalidate expired tokens
      const expiredTokens = existingTokens.filter(
        (token) => token.expiration < new Date()
      );
      await Promise.all(
        expiredTokens.map((token) => TokenRepository.invalidateToken(token.id))
      );

      // Return a valid existing token if there's exactly one, otherwise null
      return validTokens.length === 1 ? validTokens[0] : null;
    } catch (err) {
      throw err;
    }
  }

  static async generateEmailVerificationToken(userId: number): Promise<Token> {
    logger.debug("Generating email verification token");
    try {
      const existingToken = await this.manageExistingTokens(
        userId,
        UserTokenType.EmailVerification
      );
      if (existingToken) return existingToken;

      const token = await TokenRepository.createToken({
        userId,
        token: _signJwt({ userId }, ENV.EMAIL_VERIFICATION_TOKEN_EXPIRY),
        type: UserTokenType.EmailVerification,
        expiration: _calculateExpiry(ENV.EMAIL_VERIFICATION_TOKEN_EXPIRY),
      });
      return token;
    } catch (err) {
      throw err;
    }
  }

  static async generatePasswordResetToken(userId: number): Promise<Token> {
    logger.debug(`Generating password reset token for user with ID: ${userId}`);
    try {
      const existingToken = await this.manageExistingTokens(
        userId,
        UserTokenType.PasswordReset
      );
      if (existingToken) return existingToken;

      const token = await TokenRepository.createToken({
        userId,
        token: _signJwt({ userId }, ENV.PASSWORD_RESET_TOKEN_EXPIRY),
        type: UserTokenType.PasswordReset,
        expiration: _calculateExpiry(ENV.PASSWORD_RESET_TOKEN_EXPIRY),
      });
      return token;
    } catch (err) {
      throw err;
    }
  }

  static async generateAccessToken(
    userId: number,
    roles: string[]
  ): Promise<string> {
    logger.debug(`Generating access token for user with ID: ${userId}`);
    try {
      const existingToken = await this.manageExistingTokens(
        userId,
        UserTokenType.Access
      );
      if (existingToken) return existingToken.token;
      const token = await TokenRepository.createToken({
        userId,
        token: _signJwt({ userId, roles }, ENV.ACCESS_TOKEN_EXPIRY),
        type: UserTokenType.Access,
        expiration: _calculateExpiry(ENV.ACCESS_TOKEN_EXPIRY),
      });
      return token.token;
    } catch (err) {
      throw err;
    }
  }
}

export default TokenGenerationService;
