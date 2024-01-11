// src/tests/middleware/asyncErrorHandler.test.ts

import asyncErrorHandler from "../../middleware/asyncErrorHandler";
import httpMocks from "node-mocks-http";
import logger from "../../middleware/logger";

describe("asyncErrorHandler Middleware", () => {
  it("should call the next function with error if the provided function throws", async () => {
    const mockFn = jest.fn().mockImplementation(async () => {
      throw new Error("Test error");
    });
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await asyncErrorHandler(mockFn)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(logger.error).toHaveBeenCalledWith(
      "Async error occurred: ",
      expect.objectContaining({
        message: "Test error",
        stack: expect.any(String),
        path: req.path,
        method: req.method,
      })
    );
  });
});
