// src/tests/middleware/asyncErrorHandler.test.ts

import asyncErrorHandler from "../../middleware/asyncErrorHandler";
import httpMocks from "node-mocks-http";

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
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe("Test error");
  });

  it("should not call next with error if the provided function resolves successfully", async () => {
    const mockFn = jest.fn().mockImplementation(async () => Promise.resolve());
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await asyncErrorHandler(mockFn)(req, res, next);

    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});
