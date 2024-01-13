// Type definitions for User

interface User {
  id?: number;
  name?: string;
  email: string;
  password: string;
  lastLogin?: Date | null;
  phone?: string;
  isVerified?: boolean;
}

type UserCredentials = Pick<User, "email" | "password">;

interface UserResponse {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string | null;
}

export type { User, UserCredentials, UserResponse };
