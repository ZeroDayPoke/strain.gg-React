// UserUtilityService.ts
import bcrypt from "bcrypt";
import ENV from "../../utils/loadEnv";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ENV.SALT_ROUNDS);
}

export async function verifyPassword(
  providedPassword: string,
  storedPassword: string
): Promise<boolean> {
  return bcrypt.compare(providedPassword, storedPassword);
}
