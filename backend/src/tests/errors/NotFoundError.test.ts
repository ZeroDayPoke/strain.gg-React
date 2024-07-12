// ./tests/errors/NotFoundError.test.ts

import NotFoundError from "../../errors/NotFoundError";

test("NotFoundError should have the correct properties", () => {
  const errorMessage = "Resource not found";
  const error = new NotFoundError(errorMessage);

  expect(error).toBeInstanceOf(Error);
  expect(error).toBeInstanceOf(NotFoundError);
  expect(error.message).toBe(errorMessage);
  expect(error.name).toBe("NotFoundError");
  expect(error.statusCode).toBe(404);
});
