// ./src/api/userApi.tsx
import apiClient from './apiConfig';
import { UserCredentials, UserResponse } from '@zerodaypoke/shared-types';

const BASE_ENDPOINT = '/users';

const userApi = {
  async signUp(userData: UserCredentials): Promise<UserResponse> {
    try {
      const response = await apiClient.post(
        `${BASE_ENDPOINT}/signup`,
        userData,
      );
      return response.data;
    } catch (error) {
      console.error('Error in signUp:', error);
      return { success: false, message: 'Sign up failed' };
    }
  },

  async logIn(userData: UserCredentials): Promise<UserResponse> {
    try {
      const response = await apiClient.post(`${BASE_ENDPOINT}/login`, userData);
      return response.data;
    } catch (error) {
      console.error('Error in logIn:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  async logOut(): Promise<boolean> {
    try {
      await apiClient.post(`${BASE_ENDPOINT}/logout`);
      return true;
    } catch (error) {
      console.error('Error in logOut:', error);
      return false;
    }
  },

  async checkSession(): Promise<UserResponse> {
    try {
      const response = await apiClient.post(`${BASE_ENDPOINT}/checkSession`);
      return response.data;
    } catch (error) {
      console.error('Error in checkSession:', error);
      return { success: false, message: 'Session check failed' };
    }
  },

  async validateToken(token: string): Promise<UserResponse> {
    try {
      const response = await apiClient.post(`${BASE_ENDPOINT}/validateToken`, {
        token,
      });
      return response.data;
    } catch (error) {
      console.error('Error in validateToken:', error);
      return { success: false, message: 'Token validation failed' };
    }
  },

  async getAccount(): Promise<UserResponse> {
    try {
      const response = await apiClient.get(`${BASE_ENDPOINT}/account`);
      return response.data;
    } catch (error) {
      console.error('Error in getAccount:', error);
      return { success: false, message: 'Get account failed' };
    }
  },

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const response = await apiClient.get(`${BASE_ENDPOINT}/all`);
      return response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  },
};

export default userApi;
