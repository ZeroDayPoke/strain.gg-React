// tests/controllers/UserController.test.ts

import request from "supertest";
import app from "../../app";
import { AuthenticationError, ServerError } from "../../errors";
import { UserProfileService, UserAuthenticationService } from "../../services";

jest.mock("../../services/UserService");

const mockCreateUser = UserProfileService.createUser as jest.MockedFunction<
  typeof UserProfileService.createUser
>;
const mockAuthenticate =
  UserAuthenticationService.authenticate as jest.MockedFunction<
    typeof UserAuthenticationService.authenticate
  >;

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/signup", () => {
    it("should handle errors when creating a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "1234567890",
      };

      mockCreateUser.mockRejectedValue(new Error("unkonwn error"));

      const response = await request(app).post("/users/signup").send(userData);

      expect(response.status).toBe(500);
      expect(response.text).toContain("UnknownError");
    });
  });

  describe("POST /users/login", () => {
    it("should handle errors when logging in", async () => {
      const loginData = { email: "john@example.com", password: "password123" };

      mockAuthenticate.mockRejectedValue(new Error("Authentication failed"));

      const response = await request(app).post("/users/login").send(loginData);

      expect(response.status).toBe(500);
      expect(response.text).toContain("UnknownError");
    });

    it("should return 401 for invalid credentials", async () => {
      const loginData = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      mockAuthenticate.mockRejectedValue(
        new AuthenticationError("Invalid credentials")
      );

      const response = await request(app).post("/users/login").send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should handle server errors", async () => {
      const loginData = { email: "john@example.com", password: "password123" };

      mockAuthenticate.mockRejectedValue(new ServerError("Server error"));

      const response = await request(app).post("/users/login").send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Server error");
    });
  });
});
