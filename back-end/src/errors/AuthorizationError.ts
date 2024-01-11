// ./errors/AuthorizationError.ts

class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 403;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  serializeError() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default AuthorizationError;
