// src/tests/utils/loadEnv.test.ts

import dotenv from "dotenv";

describe("Environment Variables Loading", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it("loads variables from .test.env for test environment", () => {
    process.env.NODE_ENV = "test";
    jest.mock("dotenv", () => ({ config: jest.fn() }));
    const dotenvMock = require("dotenv") as jest.Mocked<typeof dotenv>;
    require("../../utils/loadEnv");

    expect(dotenvMock.config).toHaveBeenCalledWith({
      path: expect.stringContaining(".test.env"),
    });
  });

  it("loads default environment variables for non-test environments", () => {
    delete process.env.NODE_ENV;
    jest.mock("dotenv", () => ({ config: jest.fn() }));
    const dotenvMock = require("dotenv") as jest.Mocked<typeof dotenv>;
    require("../../utils/loadEnv");

    expect(dotenvMock.config).toHaveBeenCalledWith({
      path: expect.stringContaining(".env"),
    });
  });
});
