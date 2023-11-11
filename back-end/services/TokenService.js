// ./services/TokenService.js

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;

export default class TokenService {
  static generateAccessToken(userId, email) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: email,
        id: userId,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      JWT_SECRET
    );
  }

  static generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }

  static generateResetToken(userId) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setHours(today.getHours() + 1);  // Token expires in 1 hour

    return jwt.sign(
      {
        id: userId,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      JWT_SECRET
    );
  }

  static verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }

  static validateAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return null;
    }
  }

  static refreshToken(token) {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { id, email } = decodedToken;

    return this.generateAccessToken(id, email);
  }
}
