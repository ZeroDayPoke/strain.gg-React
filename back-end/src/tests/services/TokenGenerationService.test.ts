import TokenRepository from "../../repositories/TokenRepository";
import { TokenGenerationService } from "../../services/TokenService";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

jest.mock("../../repositories/TokenRepository", () => {
  const mockTokenInstance = {
    userId: 1,
    token: "mockToken",
    type: "access",
    expiration: new Date(),
  };

  return {
    createToken: jest.fn().mockResolvedValue(mockTokenInstance),
    getUserTokens: jest.fn().mockResolvedValue([mockTokenInstance]),
    invalidateToken: jest.fn().mockResolvedValue(mockTokenInstance),
    findTokenByString: jest.fn().mockResolvedValue(mockTokenInstance),
    refreshToken: jest.fn().mockResolvedValue("refreshedToken"),
  };
});

const mockedTokenRepository = jest.mocked(TokenRepository);

describe("TokenGenerationService", () => {
  const mockUserId = 1;
  const mockToken = "mockToken";
  const mockExpiry = new Date(Date.now() + 10000);
  const mockRoles = ["user"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", async () => {
      const expectedToken = "mockToken";

      const result = await TokenGenerationService.generateAccessToken(
        mockUserId,
        mockRoles
      );

      expect(result).toBe(expectedToken);
      expect(mockedTokenRepository.createToken).toHaveBeenCalledWith({
        userId: mockUserId,
        token: expect.any(String),
        type: TokenType.Access,
        expiration: expect.any(Date),
      });
    });
  });

  describe("generateEmailVerificationToken", () => {
    it("should generate an email verification token", async () => {
      mockedTokenRepository.getUserTokens.mockResolvedValue([]);
      const result =
        await TokenGenerationService.generateEmailVerificationToken(mockUserId);

      expect(mockedTokenRepository.createToken).toHaveBeenCalledWith({
        userId: mockUserId,
        token: expect.any(String),
        type: TokenType.EmailVerification,
        expiration: expect.any(Date),
      });
      expect(result.token).toBeDefined();
    });
  });

  describe("generatePasswordResetToken", () => {
    it("should generate a password reset token", async () => {
      mockedTokenRepository.getUserTokens.mockResolvedValue([]);
      const result = await TokenGenerationService.generatePasswordResetToken(
        mockUserId
      );

      expect(mockedTokenRepository.createToken).toHaveBeenCalledWith({
        userId: mockUserId,
        token: expect.any(String),
        type: TokenType.PasswordReset,
        expiration: expect.any(Date),
      });
      expect(result.token).toBeDefined();
    });
  });
});
