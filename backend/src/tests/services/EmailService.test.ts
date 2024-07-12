import nodemailer from "nodemailer";
import ENV from "../setup";
import EmailService from "../../services";

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
        text: `Please verify your email by clicking the following link: https://tulsahomesales.com/verify_account_email/${token}`,
      });
    });
  });
});
