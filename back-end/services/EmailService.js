// ./services/EmailService.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default class EmailService {
  static sendVerificationEmail(userEmail, token) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: http://localhost:3100/users/verify?token=${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }

  static sendResetPasswordEmail(userEmail, token) {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Please click the following link to reset your password: ${process.env.BASE_URL}/reset-password?token=${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}
