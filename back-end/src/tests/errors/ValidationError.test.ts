// ./tests/errors/ValidationError.test.ts

import ValidationError from "../../errors/ValidationError";

test("ValidationError should have the correct properties", () => {
  const errorMessage = "Invalid input";
  const error = new ValidationError(errorMessage);

  expect(error).toBeInstanceOf(Error);
  expect(error).toBeInstanceOf(ValidationError);
  expect(error.message).toBe(errorMessage);
  expect(error.name).toBe("ValidationError");
  expect(error.statusCode).toBe(400);
});
