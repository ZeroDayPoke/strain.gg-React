// src/errors/NotFoundError.ts
import { IErrorResponse } from "@zerodaypoke/strange-types";
/**
 * Custom error class for handling "Not Found" scenarios.
 * It is used when a requested resource is not found in the database or the application.
 * This class extends the native JavaScript Error class and adds a 'statusCode' property,
 * set to 404, which is the HTTP status code for "Not Found".
 *
 * @param {string} message - Descriptive message explaining the error context.
 *
 * Usage:
 * This error should be thrown in scenarios where the requested resource (like a specific user, product, etc.) does not exist.
 *
 * Example:
 *   if (!user) {
 *     throw new NotFoundError("User not found");
 *   }
 */
class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default NotFoundError;
