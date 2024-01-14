/**
 * Represents a generic error response structure for API responses.
 * @interface
 * @property {string} message - A human-readable message providing more details about the error.
 * @property {number} statusCode - The HTTP status code associated with the error.
 * @property {string} name - The name of the error.
 */
export interface IErrorResponse {
  message: string;
  statusCode: number;
  name: string;
}
