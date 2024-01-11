// ./tests/errors/AuthenticationError.test.ts

import AuthenticationError from "../../errors/AuthenticationError";

test("AuthenticationError instance has correct properties", () => {
  const errorMessage = "Invalid credentials";
  const error = new AuthenticationError(errorMessage);

  expect(error).toBeInstanceOf(AuthenticationError);
  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe(errorMessage);
  expect(error.name).toBe("AuthenticationError");
  expect(error.statusCode).toBe(401);
});
