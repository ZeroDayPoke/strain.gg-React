// src/errors/ValidationError.ts
import { IErrorResponse } from "@zerodaypoke/strange-types";
/**
 * Custom error class for handling validation errors.
 * It is used when input or data fails validation checks.
 * This class extends the native JavaScript Error class and adds a 'statusCode' property,
 * set to 400, which is the HTTP status code for "Bad Request".
 *
 * @param {string} message - A message detailing what validation failed.
 *
 * Usage:
 * This error should be thrown during data validation processes, like form inputs or API request data.
 *
 * Example:
 *   if (!isValidEmail(email)) {
 *     throw new ValidationError("Email format is invalid");
 *   }
 */
class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeError(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default ValidationError;
