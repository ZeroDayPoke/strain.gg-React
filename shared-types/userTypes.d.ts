// Type definitions for User

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  lastLogin?: Date;
  isVerified: boolean;
}

export interface UserResponse {
  message: string;
  userId: number;
  token: string;
  roles?: string[];
}
