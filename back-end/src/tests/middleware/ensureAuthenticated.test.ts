// src/tests/middleware/ensureAuthenticated.test.ts

import ensureAuthenticated from "../../middleware/authenticate";
import httpMocks from "node-mocks-http";
import { AuthenticationError } from "../../errors";
import logger from "../../middleware/logger";

describe("ensureAuthenticated Middleware", () => {
  it("should call next without error when user is authenticated", async () => {
    const req = httpMocks.createRequest({
      session: { userId: 1 },
      accessToken: { userId: 1 },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await ensureAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(logger.info).toHaveBeenCalledWith("Authenticated successfully: 1");
  });

  it("should throw AuthenticationError if user is not authenticated", async () => {
    const req = httpMocks.createRequest({
      session: {},
      accessToken: {},
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await ensureAuthenticated(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    expect(logger.error).toHaveBeenCalledWith(
      "Failed to authenticate: session userId: undefined, token userId: undefined"
    );
  });
});
