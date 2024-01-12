// TokenUtilityService.ts
import jwt from "jsonwebtoken";
import ENV from "../../utils/loadEnv";
import ms from "ms";
import crypto from "crypto";
import logger from "../../middleware/logger";

export const _signJwt = (payload: object, expiresIn: string): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
};

export const _calculateExpiry = (expiryTime: string): Date => {
  return new Date(Date.now() + ms(expiryTime));
};

export const _generateRandomToken = (): string => {
  return crypto.randomBytes(20).toString("hex");
};

export const _verifyJwt = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.error(`JWT verification error: ${err.message}`);
        return reject(err);
      }
      resolve(decoded);
    });
  });
};
