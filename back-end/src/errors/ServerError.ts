// ./errors/ServerError.ts

class ServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeError() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      name: this.name,
    };
  }
}

export default ServerError;
