// src/middleware/errorHandler.ts

import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
  AuthenticationError,
  ServerError,
} from "../errors";
import logger from "./logger";

/**
 * Error handling middleware for Express applications.
 * It logs the error and sends a formatted response based on the type of error.
 * Known errors (NotFoundError, ValidationError, etc.) are handled explicitly,
 * while other unknown errors default to a 500 Internal Server Error.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
    body: req.body,
    query: req.query,
  });

  if (
    err instanceof ValidationError ||
    err instanceof NotFoundError ||
    err instanceof AuthorizationError ||
    err instanceof AuthenticationError ||
    err instanceof ServerError
  ) {
    return res.status(err.statusCode).json(err.serializeError());
  } else {
    // Handle unknown errors
    res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
      name: "UnknownError",
    });
  }
};

export default errorHandler;
