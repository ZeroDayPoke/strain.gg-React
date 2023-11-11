// ./middleware/errorHandler.js

import {
  NotFoundError,
  AuthorizationError,
  ValidationError,
  AuthenticationError,
  ServerError,
} from "../errors/index.js";
import { logger } from "./requestLogger.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    logger.error(`ValidationError: ${err.message}`);
    res.status(400).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    logger.error(`NotFoundError: ${err.message}`);
    res.status(404).json({ error: err.message });
  } else if (err instanceof AuthorizationError) {
    logger.error(`AuthorizationError: ${err.message}`);
    res.status(403).json({ error: err.message });
  } else if (err instanceof AuthenticationError) {
    logger.error(`AuthenticationError: ${err.message}`);
    res.status(401).json({ error: err.message });
  } else if (err instanceof ServerError) {
    logger.error(`ServerError: ${err.message}`);
    res.status(500).json({ error: err.message });
  } else {
    logger.error(`Unknown Error: ${err.message}`);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export default errorHandler;
