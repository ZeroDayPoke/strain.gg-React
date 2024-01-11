// tests/services/TokenService.test.js

import jwt from "jsonwebtoken";
import crypto from "crypto";
import TokenService from "../../services/TokenService";

// Mock external dependencies
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));
jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
}));

// Setup environment variables
process.env.JWT_SECRET = "default_jwt_secret";
process.env.ACCESS_TOKEN_EXPIRY = "1h";

describe("TokenService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", async () => {
      const userId = 1;
      const roles = ["User"];
      jwt.sign.mockReturnValue("mockedAccessToken");

      const token = await TokenService.generateAccessToken(userId, roles);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: userId, roles }),
        process.env.JWT_SECRET,
        expect.objectContaining({ expiresIn: "1h" })
      );
      expect(token).toBe("mockedAccessToken");
    });
  });

  describe("generateVerificationToken", () => {
    it("should generate a verification token", () => {
      const expectedTokenLength = 40;
      const mockedToken = Buffer.from("a".repeat(20), "utf8").toString("hex");
      // Ensure that the mockedToken is 40 characters long when converted to hex
      crypto.randomBytes.mockReturnValue(mockedToken);

      const token = TokenService.generateEmailVerificationToken();

      expect(crypto.randomBytes).toHaveBeenCalledWith(20);
      expect(token).toBe(mockedToken);
      expect(token.length).toBe(expectedTokenLength);
    });
  });

  describe("generateResetToken", () => {
    it("should generate a reset token", async () => {
      const userId = 1;
      jwt.sign.mockReturnValue("mockedResetToken");

      const token = await TokenService.generatePasswordResetToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: userId }),
        process.env.JWT_SECRET,
        expect.any(Object) // Add specific expectation for expiresIn if necessary
      );
      expect(token).toBe("mockedResetToken");
    });
  });

  describe("validateAccessToken", () => {
    it("should validate a given access token", async () => {
      const token = "validToken";
      const decodedPayload = { id: 1, email: "test@example.com" };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decodedPayload);
      });

      const result = await TokenService.validateAccessToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        process.env.JWT_SECRET,
        expect.any(Function)
      );
      expect(result).toEqual(decodedPayload);
    });

    it("should return null for an invalid token", async () => {
      const invalidToken = "invalidToken";
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("invalid token"), null);
      });

      const result = await TokenService.validateAccessToken(invalidToken);

      expect(result).toBeNull();
    });
  });

  describe("refreshToken", () => {
    it("should refresh a valid access token", async () => {
      const originalToken = "validToken";
      const userId = 1;
      const email = "test@example.com";
      const roles = ["User"];

      // Mock the verification to return a payload
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: userId, email, roles });
      });

      // Mock the sign function for the new token
      jwt.sign.mockReturnValue("refreshedAccessToken");

      const newToken = await TokenService._refreshToken(originalToken);

      expect(newToken).toBeDefined();
      expect(newToken).toBe("refreshedAccessToken");
    });

    // Additional test cases for invalid or expired tokens
  });
});
