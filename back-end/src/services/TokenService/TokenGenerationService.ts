// TokenGenerationService.ts

import { Token } from "../../models";
import crypto from "crypto";
import TokenRepository from "../../repositories/TokenRepository";
import { ServerError } from "../../errors";
import { _signJwt, _calculateExpiry } from "./TokenUtilityService";
import ENV from "../../utils/loadEnv";
import { TokenUtilityService } from ".";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

export interface TokenPayload {
  userId: number;
  roles: string[];
}

class TokenGenerationService {
  static async _generateToken(
    userId: number,
    tokenType: TokenType,
    expiryTime: string
  ): Promise<Token> {
    const token = crypto.randomBytes(20).toString("hex");
    try {
      return await TokenRepository.createToken({
        userId,
        token,
        type: tokenType,
        expiration: TokenUtilityService._calculateExpiry(expiryTime),
      });
    } catch (e) {
      throw new ServerError(`Failed to generate ${tokenType} token`);
    }
  }

  static async generateEmailVerificationToken(userId: number): Promise<Token> {
    return this._generateToken(
      userId,
      TokenType.EmailVerification,
      ENV.EMAIL_VERIFICATION_TOKEN_EXPIRY
    );
  }

  static async generatePasswordResetToken(userId: number): Promise<Token> {
    return this._generateToken(
      userId,
      TokenType.PasswordReset,
      ENV.PASSWORD_RESET_TOKEN_EXPIRY
    );
  }

  static async generateAccessToken(
    userId: number,
    roles: string[]
  ): Promise<string> {
    try {
      const existingTokens = await TokenRepository.getUserTokens(
        userId,
        TokenType.Access
      );

      existingTokens.forEach(async (token) => {
        if (token.expiration < new Date()) {
          await TokenRepository.invalidateToken(token.id);
        }
      });

      if (existingTokens.length == 1) {
        return existingTokens[0].token;
      } else if (existingTokens.length > 1) {
        existingTokens.forEach(async (token) => {
          await TokenRepository.invalidateToken(token.id);
        });
      } else {
        const token = await TokenRepository.createToken({
          userId,
          token: TokenUtilityService._signJwt(
            { userId, roles },
            ENV.ACCESS_TOKEN_EXPIRY
          ),
          type: TokenType.Access,
          expiration: TokenUtilityService._calculateExpiry(
            ENV.ACCESS_TOKEN_EXPIRY
          ),
        });
        return token.token;
      }
    } catch (e) {
      throw new ServerError("Failed to generate access token");
    }
  }
}

export default TokenGenerationService;
