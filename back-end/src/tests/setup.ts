// src/tests/setup.ts
import { jest } from "@jest/globals";

jest.mock("../middleware/logger", () => {
  return {
    __esModule: true,
    default: {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
  };
});

if (process.env.TEST_TYPE === "unit") {
  jest.mock("../config/database", () => ({
    sync: jest.fn(),
    close: jest.fn(),
  }));
} else if (process.env.TEST_TYPE === "integration") {
  const db = require("../config/database").default;
  beforeAll(async () => {
    await db.sync({ force: true });
  });
  afterAll(async () => {
    await db.close();
  });
}
