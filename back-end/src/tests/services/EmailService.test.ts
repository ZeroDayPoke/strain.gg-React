import nodemailer from "nodemailer";
import EmailService from "../../services/EmailService";
import ENV from "../../utils/loadEnv";

// Mock nodemailer's createTransport and sendMail
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ response: "Email sent" }),
  }),
}));

describe("EmailService", () => {
  let sendMailMock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Retrieve the mock function for sendMail
    sendMailMock = nodemailer.createTransport().sendMail;
  });

  describe("sendVerificationEmail", () => {
    it("should send a verification email", async () => {
      const userEmail = "test@example.com";
      const token = "testtoken123";

      await EmailService.sendVerificationEmail(userEmail, token);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: ENV.EMAIL_USERNAME,
        to: userEmail,
        subject: "Email Verification",
        text: `Please verify your email by clicking the following link: https://zerodaypoke.com/verify_account_email/${token}`,
      });
    });
  });

  describe("sendResetPasswordEmail", () => {
    it("should send a reset password email", async () => {
      const userEmail = "reset@example.com";
      const token = "resettoken123";

      await EmailService.sendResetPasswordEmail(userEmail, token);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: ENV.EMAIL_USERNAME,
        to: userEmail,
        subject: "Password Reset Request",
        text: `You have requested to reset your password. Please click the following link to reset your password: ${ENV.BASE_URL}/reset-password?token=${token}`,
      });
    });
  });
});
