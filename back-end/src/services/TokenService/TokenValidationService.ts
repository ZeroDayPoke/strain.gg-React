// TokenValidationService.ts
import TokenRepository from "../../repositories/TokenRepository";
import { ValidationError } from "../../errors";
import logger from "../../middleware/logger";
import { _signJwt, _calculateExpiry } from "./TokenUtilityService";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

export interface TokenPayload {
  userId: number;
  roles: string[];
}

class TokenValidationService {
  static async invalidateOnLogout(userId: number): Promise<void> {
    logger.debug(`Invalidating tokens for user with ID: ${userId}`);
    try {
      const tokenData = await TokenRepository.getUserTokens(
        userId,
        TokenType.Access
      );

      if (tokenData) {
        tokenData.forEach(async (token) => {
          await TokenRepository.invalidateToken(token.id);
        });
      }
    } catch (err) {
      throw err;
    }
  }

  static async _validateToken(
    token: string,
    tokenType: TokenType
  ): Promise<number> {
    logger.debug(`Validating ${tokenType} token`);
    try {
      const tokenData = await TokenRepository.findTokenByString({
        token: token,
        type: tokenType,
        isValid: true,
      });

      if (!tokenData) {
        throw new ValidationError("Invalid or expired token");
      }

      return tokenData.userId;
    } catch (err) {
      throw err;
    }
  }

  static async validateEmailVerificationToken(token: string): Promise<number> {
    return this._validateToken(token, TokenType.EmailVerification);
  }

  static async validatePasswordResetToken(token: string): Promise<number> {
    return this._validateToken(token, TokenType.PasswordReset);
  }
}

export default TokenValidationService;
