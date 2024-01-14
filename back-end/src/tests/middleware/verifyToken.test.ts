// src/tests/middleware/verifyToken.test.ts
import httpMocks from "node-mocks-http";
import { AuthenticationError } from "../../errors";
import { TokenUtilityService } from "../../services/TokenService";
import verifyToken from "../../middleware/verifyToken";

export enum TokenType {
  Access = "access",
  EmailVerification = "email-verification",
  PasswordReset = "password-reset",
}

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
}));
jest.mock("../../services/TokenService");
const mockedTokenUtilityService = jest.mocked(TokenUtilityService);

describe("verifyToken Middleware", () => {
  it("should verify the token and attach decoded token to the request", async () => {
    const token = "validToken";
    const req = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${token}`,
      },
      session: { destroy: jest.fn() },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const mockDecodedToken = { userId: 1, roles: ["user"] };

    mockedTokenUtilityService._verifyJwt.mockResolvedValue(mockDecodedToken);

    await verifyToken(req, res, next);

    expect(req.decodedToken).toEqual(mockDecodedToken);
    expect(next).toHaveBeenCalled();
  });

  it("should throw an AuthenticationError for invalid token", async () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: "Bearer invalidToken",
      },
      session: { destroy: jest.fn() },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    mockedTokenUtilityService._verifyJwt.mockRejectedValue(
      new Error("Invalid token")
    );

    await verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(req.session.destroy).toHaveBeenCalled();
  });
});
