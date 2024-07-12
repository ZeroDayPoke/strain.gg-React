// src/errors/AuthenticationError.ts
import { IErrorResponse } from "@zerodaypoke/strange-types";
/**
 * Custom error class representing authentication errors.
 * This class extends the native JavaScript Error class and adds a 'statusCode' property,
 * set to 401, which is the HTTP status code for unauthorized access.
 *
 * @param {string} message - A message describing the error, typically explaining why authentication failed.
 *
 * Usage:
 * This error should be thrown when a user fails to authenticate successfully.
 * It is typically used in authentication middleware or during the login process.
 *
 * Example:
 *   if (!userIsValid) {
 *     throw new AuthenticationError("Invalid username or password");
 *   }
 */
class AuthenticationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serializeError(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default AuthenticationError;
