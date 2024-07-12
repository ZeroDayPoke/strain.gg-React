// ./tests/errors/ServerError.test.ts

import ServerError from "../../errors/ServerError";

describe("ServerError", () => {
  it("should create a new instance of ServerError", () => {
    const errorMessage = "Internal Server Error";
    const serverError = new ServerError(errorMessage);

    expect(serverError).toBeInstanceOf(ServerError);
    expect(serverError.message).toBe(errorMessage);
    expect(serverError.name).toBe("ServerError");
    expect(serverError.statusCode).toBe(500);
  });
});
