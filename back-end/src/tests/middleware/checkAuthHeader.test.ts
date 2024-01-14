// src/tests/middleware/checkAuthHeader.test.ts

import checkAuthorizationHeader from "../../middleware/checkAuthHeader";
import httpMocks from "node-mocks-http";
import { AuthenticationError } from "../../errors";
import logger from "../../middleware/logger";

describe("checkAuthorizationHeader Middleware", () => {
  it("should call next if Authorization header exists", async () => {
    const req = httpMocks.createRequest({
      headers: {
        Authorization: "Bearer token",
      },
      session: { destroy: jest.fn() },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await checkAuthorizationHeader(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      "Checking authorization header: Bearer token"
    );
  });

  it("should throw AuthenticationError if Authorization header is missing", async () => {
    const mockSessionDestroy = jest.fn();
    const req = httpMocks.createRequest({
      session: { destroy: mockSessionDestroy },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await checkAuthorizationHeader(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(logger.info).toHaveBeenCalledWith("Authorization header missing");
    expect(mockSessionDestroy).toHaveBeenCalled();
  });
});
