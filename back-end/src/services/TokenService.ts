// ./services/TokenService.ts

import jwt from "jsonwebtoken";
import crypto from "crypto";
import ENV from "../utils/loadEnv";
import logger from "../middleware/logger";
import Token from "../models/Token";
import { ServerError, ValidationError } from "../errors";
import ms from "ms";
import { Op } from "sequelize";

const JWT_SECRET = ENV.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = ENV.ACCESS_TOKEN_EXPIRY || "1h";
const EMAIL_VERIFICATION_TOKEN_EXPIRY =
  ENV.EMAIL_VERIFICATION_TOKEN_EXPIRY || "24h";
const PASSWORD_RESET_TOKEN_EXPIRY = ENV.PASSWORD_RESET_TOKEN_EXPIRY || "1h";

export default class TokenService {
  static _signJwt(payload: object, expiresIn: string): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  static _verifyJwt(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          logger.error(`JWT verification error: ${err.message}`);
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }

  static async generateAccessToken(
    userId: number,
    roles: string[]
  ): Promise<string> {
    const payload = { userId, roles };
    const token = this._signJwt(payload, ACCESS_TOKEN_EXPIRY);
    await Token.create({
      userId: userId,
      token: token,
      type: "access",
      expiration: new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRY)),
    });
    return token;
  }

  static async validateEmailVerificationToken(token: string): Promise<number> {
    try {
      const tokenData = await Token.findOne({
        where: {
          token: token,
          type: "email-verification",
          expiration: {
            [Op.gte]: new Date(),
          },
        },
      });
      if (!tokenData) {
        throw new ValidationError("Invalid or expired token");
      }
      return tokenData.userId;
    } catch (e) {
      throw new ValidationError("Invalid or expired token");
    }
  }

  static async validatePasswordResetToken(token: string): Promise<number> {
    try {
      const tokenData = await Token.findOne({
        where: {
          token: token,
          type: "password-reset",
          expiration: {
            [Op.gte]: new Date(),
          },
        },
      });
      if (!tokenData) {
        throw new ValidationError("Invalid or expired token");
      }
      return tokenData.userId;
    } catch (e) {
      throw new ValidationError("Invalid or expired token");
    }
  }

  static async generateEmailVerificationToken(userId: number): Promise<Token> {
    const token = crypto.randomBytes(20).toString("hex");
    try {
      return await Token.create({
        userId,
        token,
        type: "email-verification",
        expiration: new Date(Date.now() + ms(EMAIL_VERIFICATION_TOKEN_EXPIRY)),
      });
    } catch (e) {
      throw new ServerError("Failed to generate email verification token");
    }
  }

  static async generatePasswordResetToken(userId: number): Promise<Token> {
    const token = crypto.randomBytes(20).toString("hex");
    try {
      return await Token.create({
        userId,
        token,
        type: "password-reset",
        expiration: new Date(Date.now() + ms(PASSWORD_RESET_TOKEN_EXPIRY)),
      });
    } catch (e) {
      throw new ServerError("Failed to generate password reset token");
    }
  }

  static async _refreshToken(token: string): Promise<string> {
    try {
      const payload = await this._verifyJwt(token);
      return this.generateAccessToken(payload.id, payload.roles);
    } catch (e) {
      throw new ServerError("Failed to refresh token");
    }
  }

  static async _validateToken(token: string, type: string): Promise<number> {
    try {
      const payload = await this._verifyJwt(token);
      return payload.id;
    } catch (e) {
      throw new ValidationError("Invalid or expired token");
    }
  }
}
