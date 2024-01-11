// src/tests/utils/envValues.test.ts

import ENV from "../../utils/loadEnv";

describe("Environment Variables", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it("should have a default NODE_ENV value of 'development'", () => {
    delete process.env.NODE_ENV;
    const ENV = require("../../utils/loadEnv").default;
    expect(ENV.NODE_ENV).toBe("development");
  });
});
