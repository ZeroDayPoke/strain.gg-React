// tests/controllers/UserController.test.ts

import UserService from "../../services/UserService";
import request from "supertest";
import app from "../../app";
import { AuthenticationError, ServerError } from "../../errors";
import { mock } from "node:test";

jest.mock("../../services/UserService");

const mockCreateUser = UserService.createUser as jest.MockedFunction<
  typeof UserService.createUser
>;
const mockAuthenticate = UserService.authenticate as jest.MockedFunction<
  typeof UserService.authenticate
>;

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/signup", () => {
    it("should create a new user and return it", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "1234567890",
      };

      const mockUser = {
        getDataValue: jest.fn().mockImplementation((key: string) => {
          if (key === "id") return 1;
          return userData[key];
        }),
      };

      mockCreateUser.mockResolvedValue(mockUser as any);

      const response = await request(app).post("/users/signup").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(1);
      expect(response.body.email).toBe(userData.email);
    });

    it("should handle errors when creating a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "1234567890",
      };

      mockCreateUser.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/users/signup").send(userData);

      expect(response.status).toBe(500);
      expect(response.text).toBe("Server error");
    });
  });

  describe("POST /users/login", () => {
    it("should log in a user and return a token", async () => {
      const loginData = { email: "john@example.com", password: "password123" };
      const mockResponse = {
        user: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          phone: "1234567890",
        },
        accessToken: "token123",
      };

      mockAuthenticate.mockResolvedValue(mockResponse);

      const response = await request(app).post("/users/login").send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("token123");
      expect(response.body.email).toBe(loginData.email);
    });

    it("should handle errors when logging in", async () => {
      const loginData = { email: "john@example.com", password: "password123" };

      mockAuthenticate.mockRejectedValue(new Error("Authentication failed"));

      const response = await request(app).post("/users/login").send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error");
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
