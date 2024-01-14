// TokenValidationService.ts
import { TokenRepository } from "../../repositories";
import { ValidationError } from "../../errors";
import logger from "../../middleware/logger";
import { _signJwt, _calculateExpiry } from "./TokenUtilityService";
import { UserTokenType } from ".";

class TokenValidationService {
  static async invalidateOnLogout(userId: number): Promise<void> {
    logger.debug(`Invalidating tokens for user with ID: ${userId}`);
    try {
      const tokenData = await TokenRepository.getUserTokens(
        userId,
        UserTokenType.Access
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
    tokenType: UserTokenType
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
    return this._validateToken(token, UserTokenType.EmailVerification);
  }

  static async validatePasswordResetToken(token: string): Promise<number> {
    return this._validateToken(token, UserTokenType.PasswordReset);
  }
}

export default TokenValidationService;
