// src/tests/middleware/errorHandler.test.ts

import errorHandler from "../../middleware/errorHandler";
import httpMocks from "node-mocks-http";
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
  AuthenticationError,
  ServerError,
} from "../../errors";
import logger from "../../middleware/logger";

describe("errorHandler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should send a 404 response for NotFoundError", () => {
    errorHandler(new NotFoundError("Not found"), req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: "Not found",
      statusCode: 404,
      name: "NotFoundError",
    });
  });

  it("should send a 400 response for ValidationError", () => {
    errorHandler(new ValidationError("Invalid input"), req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Invalid input",
      statusCode: 400,
      name: "ValidationError",
    });
  });

  it("should send a 401 response for AuthenticationError", () => {
    errorHandler(new AuthenticationError("Unauthorized"), req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: "Unauthorized",
      statusCode: 401,
      name: "AuthenticationError",
    });
  });

  it("should send a 403 response for AuthorizationError", () => {
    errorHandler(new AuthorizationError("Forbidden"), req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Forbidden",
      statusCode: 403,
      name: "AuthorizationError",
    });
  });

  it("should send a 500 response for ServerError", () => {
    errorHandler(new ServerError("Internal Server Error"), req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal Server Error",
      statusCode: 500,
      name: "ServerError",
    });
  });

  it("should handle unknown errors with a 500 response", () => {
    const unknownError = new Error("Unknown error");
    errorHandler(unknownError, req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal Server Error",
      name: "UnknownError",
      statusCode: 500,
    });
  });

  it("logs the error details", () => {
    const error = new ValidationError("Test validation error");
    errorHandler(error, req, res, next);
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        path: req.path,
        body: req.body,
        query: req.query,
      })
    );
  });
});
