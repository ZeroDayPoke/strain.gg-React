// ./middleware/errorHandler.ts

import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
  AuthenticationError,
  ServerError,
} from "../errors";
import logger from "./logger";

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    err instanceof ValidationError ||
    err instanceof NotFoundError ||
    err instanceof AuthorizationError ||
    err instanceof AuthenticationError ||
    err instanceof ServerError
  ) {
    logger.error(`${err.name}: ${err.message}`, {
      path: req.path,
      body: req.body,
      query: req.query,
    });
    return res.status(err.statusCode).json(err.serializeError());
  } else {
    logger.error(`Unknown Error: ${err.message}`, {
      path: req.path,
      body: req.body,
      query: req.query,
    });
    res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
  }
};

export default errorHandler;
