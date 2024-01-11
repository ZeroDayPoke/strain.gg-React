// ./services/EmailService.ts

import nodemailer from "nodemailer";
import ENV from "../utils/loadEnv";
import logger from "../middleware/logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USERNAME,
    pass: ENV.EMAIL_PASSWORD,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

class EmailService {
  static async sendEmail(mailOptions: MailOptions): Promise<void> {
    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw error;
    }
  }

  static async sendVerificationEmail(
    userEmail: string,
    token: string
  ): Promise<void> {
    const mailOptions: MailOptions = {
      from: ENV.EMAIL_USERNAME,
      to: userEmail,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: https://tulsahomesales.com/verify_account_email/${token}`,
    };

    try {
      await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw error;
    }
  }

  static async sendResetPasswordEmail(
    userEmail: string,
    token: string
  ): Promise<void> {
    const mailOptions: MailOptions = {
      from: ENV.EMAIL_USERNAME,
      to: userEmail,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Please click the following link to reset your password: https://tulsahomesales.com/reset-password?token=${token}`,
    };
    try {
      await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw error;
    }
  }
}

export default EmailService;
