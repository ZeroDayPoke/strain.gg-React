// src/tests/config/database.test.ts

import { Sequelize } from "sequelize";
import config from "../../config/config";
import ENV from "../../utils/loadEnv";

describe("Database Connection", () => {
  const env = (ENV.NODE_ENV as keyof typeof config) || "test";
  const dbConfig = config[env];

  it("should have the correct environment configuration", () => {
    expect(dbConfig).toBeDefined();
    expect(dbConfig.username).toBeDefined();
    expect(dbConfig.password).toBeDefined();
    expect(dbConfig.database).toBeDefined();
    expect(dbConfig.host).toBeDefined();
    expect(dbConfig.dialect).toBeDefined();
  });

  if (process.env.TEST_TYPE === "integration") {
    let db: Sequelize;

    beforeAll(() => {
      db = require("../../config/database").default;
    });

    it("should create a new Sequelize instance with correct configuration for integration tests", () => {
      expect(db).toBeDefined();
      expect(db).toBeInstanceOf(Sequelize);
    });
  }
});
