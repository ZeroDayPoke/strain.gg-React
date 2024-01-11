// src/tests/config/config.test.ts

import config from "../../config/config";
import ENV from "../../utils/loadEnv";

describe("Configuration Loading", () => {
  it("loads development configuration correctly", () => {
    process.env.NODE_ENV = "development";
    const devConfig = config.development;
    expect(devConfig).toBeDefined();
    expect(devConfig.dialect).toEqual("mysql");
    expect(devConfig.username).toEqual(ENV.DB_USER);
    expect(devConfig.password).toEqual(ENV.DB_PASS);
    expect(devConfig.database).toEqual(`${ENV.DB_NAME}_dev`);
    expect(devConfig.host).toEqual(ENV.DB_HOST);
    expect(typeof devConfig.logging).toBe("function");
  });

  it("loads test configuration correctly", () => {
    process.env.NODE_ENV = "test";
    const testConfig = config.test;
    expect(testConfig).toBeDefined();
    expect(testConfig.dialect).toEqual("mysql");
    expect(testConfig.username).toEqual(ENV.DB_USER);
    expect(testConfig.password).toEqual(ENV.DB_PASS);
    expect(testConfig.database).toEqual(`${ENV.DB_NAME}_test`);
    expect(testConfig.host).toEqual(ENV.DB_HOST);
    expect(testConfig.logging).toEqual(false);
  });

  it("loads production configuration correctly", () => {
    process.env.NODE_ENV = "production";
    const prodConfig = config.production;
    expect(prodConfig).toBeDefined();
  });
});
