// Type definitions for User and Role models

/**
 * RoleAttributes
 * @interface
 * @property id - The ID of the role record.
 * @property name - The name of the role.
 */
export interface RoleAttributes {
  id: number;
  name: string;
}

export interface TokenPayload {
  userId: number;
  roles: string[];
}

export interface AuthenticateParams {
  email: string;
  password: string;
}

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  lastLogin?: Date;
  isVerified: boolean;
}

export interface CreateUserParams {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * UserResponse
 * @interface
 * @property message - A message to be displayed to the user.
 * @property userId - The ID of the user.
 * @property token - The JWT access token.
 * @property roles - The roles of the user.
 */
export interface UserResponse {
  message: string;
  userId: number;
  token: string;
  roles?: string[];
}

/**
 * UserRolesAttributes
 * @interface
 * @property id - The ID of the user role record.
 */

export interface UserRoleAttributes {
  id: number;
}
