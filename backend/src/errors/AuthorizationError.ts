// src/errors/AuthorizationError.ts
import { IErrorResponse } from "@zerodaypoke/strange-types";
/**
 * Custom error class representing authorization errors.
 * This class extends the native JavaScript Error class and adds a 'statusCode' property,
 * set to 403, which is the HTTP status code for forbidden access.
 *
 * @param {string} message - A message describing the error, typically explaining why access is forbidden.
 *
 * Usage:
 * This error should be thrown when a user tries to access a resource for which they don't have the necessary permissions.
 * It is typically used in authorization middleware or when checking user roles and permissions.
 *
 * Example:
 *   if (!userHasPermission) {
 *     throw new AuthorizationError("User does not have the required permission");
 *   }
 */
class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  serializeError(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default AuthorizationError;
