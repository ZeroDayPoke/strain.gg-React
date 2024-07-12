// ./tests/errors/AuthorizationError.test.ts

import AuthorizationError from "../../errors/AuthorizationError";

describe("AuthorizationError", () => {
  it("should create an instance of AuthorizationError with the correct message", () => {
    const errorMessage = "Unauthorized access";
    const error = new AuthorizationError(errorMessage);

    expect(error).toBeInstanceOf(AuthorizationError);
    expect(error.message).toEqual(errorMessage);
    expect(error.name).toEqual("AuthorizationError");
    expect(error.statusCode).toEqual(403);
  });
});
