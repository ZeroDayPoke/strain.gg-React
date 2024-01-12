// UserAuthenticationService.ts
import bcrypt from "bcrypt";
import logger from "../../middleware/logger";
import UserRepository from "../../repositories/UserRepository";
import { TokenGenerationService } from "../TokenService";
import UserProfileService from "./UserProfileService";
import { User } from "../../models";
import { NotFoundError, AuthenticationError, ServerError } from "../../errors";

interface AuthenticateParams {
  email: string;
  password: string;
}

class UserAuthenticationService {
  async authenticate(
    params: AuthenticateParams
  ): Promise<{ user: User; accessToken: string }> {
    try {
      logger.info(`Authenticating user with email: ${params.email}`);
      const user = await UserRepository.findByEmail(params.email);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const isMatch = await bcrypt.compare(
        params.password,
        user.getDataValue("password")
      );
      if (!isMatch) {
        throw new AuthenticationError("Incorrect password");
      }

      const accessToken = await this._generateUserAccessToken(user);
      logger.info(`Generated access token for user with ID: ${user.id}`);
      return { user, accessToken };
    } catch (err) {
      throw new ServerError(err.message);
    }
  }

  async _generateUserAccessToken(user: User): Promise<string> {
    logger.info(`Generating access token for user with ID: ${user.id}`);
    try {
      const roles = await UserProfileService.getUserRoles(user.id);
      return TokenGenerationService.generateAccessToken(user.id, roles);
    } catch (err) {
      throw new ServerError(err.message);
    }
  }
}

export default new UserAuthenticationService();
