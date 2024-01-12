// TokenRefreshService.ts
import TokenRepository from "../../repositories/TokenRepository";
import { ServerError } from "../../errors";
import ENV from "../../utils/loadEnv";

class TokenRefreshService {
  static async refreshToken(token: string): Promise<string> {
    try {
      const refreshedToken = await TokenRepository.refreshToken(
        token,
        ENV.ACCESS_TOKEN_EXPIRY
      );
      return refreshedToken.token;
    } catch (e) {
      throw new ServerError("Failed to refresh token");
    }
  }
}

export default TokenRefreshService;
