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
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await checkAuthorizationHeader(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(jest.mocked(logger.info)).toHaveBeenCalledWith(
      "Authorization header: Bearer token"
    );
  });

  it("should throw AuthenticationError if Authorization header is missing", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await checkAuthorizationHeader(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(AuthenticationError);
    expect(jest.mocked(logger.info)).toHaveBeenCalledWith(
      "Authorization header missing"
    );
  });
});
