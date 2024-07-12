// src/errors/ServerError.ts
import { IErrorResponse } from "@zerodaypoke/strange-types";
/**
 * Custom error class representing internal server errors.
 * It is used to signify unexpected situations or errors within the server.
 * This class extends the native JavaScript Error class and adds a 'statusCode' property,
 * set to 500, which is the HTTP status code for "Internal Server Error".
 *
 * @param {string} message - A message that gives more details about the server error.
 *
 * Usage:
 * This error is usually thrown in catch blocks or when an unexpected condition is detected.
 *
 * Example:
 *   try {
 *     // some operation that might fail
 *   } catch (error) {
 *     throw new ServerError("An unexpected error occurred");
 *   }
 */
class ServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeError(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default ServerError;
