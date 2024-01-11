// src/tests/models/user.test.ts

import bcrypt from "bcrypt";
import db from "../../config/database";
import { User as UserType } from "../../models";
import Role from "../../models/Role";

describe("User Model", () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterEach(async () => {
    await UserType.destroy({ where: {} });
    await Role.destroy({ where: {} });
  });

  test("it creates a new user", async () => {
    const user = await UserType.create({
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      phone: "1234567890",
    });

    const isPasswordValid = await bcrypt.compare(
      "password123",
      user.password
    );

    expect(user.id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.phone).toBe("1234567890");
    expect(user.isVerified).toBe(false);
    expect(isPasswordValid).toBe(true);
  });

  test("it validates user password", async () => {
    const user = await UserType.create({
      name: "Jane Doe",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 10),
      phone: "0987654321",
    });

    const isCorrectPassword = await user.validatePassword("password123");
    const isIncorrectPassword = await user.validatePassword("wrongpassword");

    expect(isCorrectPassword).toBe(true);
    expect(isIncorrectPassword).toBe(false);
  });

  test("it associates user with roles", async () => {
    const user = await UserType.create({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      phone: "1122334455",
    });
    const role = await Role.create({ name: "Admin" });
    await user.addRole(role);
    await user.reload();
    const roles = await user.getRoles();
    expect(roles).toHaveLength(1);
    expect(roles[0].name).toBe(role.name);
  });
});
