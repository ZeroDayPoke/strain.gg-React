// TokenRefreshService.ts
import TokenRepository from "../../repositories/TokenRepository";
import ENV from "../../utils/loadEnv";
import logger from "../../middleware/logger";

class TokenRefreshService {
  static async refreshToken(token: string): Promise<string> {
    logger.debug(`Refreshing token`);
    try {
      const refreshedToken = await TokenRepository.refreshToken(
        token,
        ENV.ACCESS_TOKEN_EXPIRY
      );
      return refreshedToken;
    } catch (err) {
      throw err;
    }
  }
}

export default TokenRefreshService;
