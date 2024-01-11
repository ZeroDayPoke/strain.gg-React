// src/tests/middleware/requestLogger.test.ts

import httpMocks from "node-mocks-http";
import requestLogger from "../../middleware/requestLogger";
import logger from "../../middleware/logger";

describe("requestLogger Middleware", () => {
  it("should log the request details", () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/test",
      ip: "127.0.0.1",
      body: { data: "test" },
      query: { param: "value" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(logger.info).toHaveBeenCalledWith(
      "HTTP Request",
      expect.objectContaining({
        ip: "127.0.0.1",
        method: "GET",
        path: "/test",
        body: { data: "test" },
        query: { param: "value" },
        time: expect.any(String),
      })
    );
    expect(next).toHaveBeenCalled();
  });
});
