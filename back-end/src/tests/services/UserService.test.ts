import UserService from "../../services/UserService";
import { User, Role } from "../../models";
import TokenService from "../../services/TokenService";
import EmailService from "../../services/EmailService";
import bcrypt from "bcrypt";

jest.mock("../../models");
jest.mock("../../services/TokenService");
jest.mock("../../services/EmailService");
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should fetch a user by ID", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        Roles: [],
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Array),
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("createUser", () => {
    it("should successfully create a new user", async () => {
      const mockUserData = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        phone: "1234567890",
      };
      const mockUser = {
        ...mockUserData,
        save: jest.fn(),
        verificationToken: "token",
        verificationTokenExpiration: Date.now() + 3600000,
      };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.createUser(mockUserData);

      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toMatchObject({
        name: mockUserData.name,
        email: mockUserData.email,
      });
    });
  });

  describe("authenticate", () => {
    it("should authenticate a user with valid credentials", async () => {
      const mockUser = {
        email: "john@example.com",
        password: "hashedPassword",
        Roles: [{ name: "User" }],
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await UserService.authenticate({
        email: "john@example.com",
        password: "password123",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
        include: expect.any(Array),
      });
      expect(result).toHaveProperty("accessToken");
    });
  });

  describe("verifyEmailToken", () => {
    it("should verify a user with a valid token", async () => {
      const mockUser = { save: jest.fn(), isVerified: false };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.verifyEmailToken("valid_token");

      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          verificationToken: "valid_token",
          verificationTokenExpiration: expect.any(Object),
        },
      });
      expect(mockUser.isVerified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
