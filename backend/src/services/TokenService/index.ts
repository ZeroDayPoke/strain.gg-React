// TokenService/index.ts
import TokenGenerationService from "./TokenGenerationService";
import TokenValidationService from "./TokenValidationService";
import TokenRefreshService from "./TokenRefreshService";
import * as TokenUtilityService from "./TokenUtilityService";

export enum UserTokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

export {
  TokenGenerationService,
  TokenValidationService,
  TokenRefreshService,
  TokenUtilityService,
};
