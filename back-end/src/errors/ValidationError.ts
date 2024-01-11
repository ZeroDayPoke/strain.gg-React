// ./errors/ValidationError.ts

class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeError() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default ValidationError;
