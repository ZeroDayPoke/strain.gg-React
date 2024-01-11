// ./errors/NotFoundError.ts

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default NotFoundError;
