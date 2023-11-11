// ./src/api/userApi.js

import axios from "axios";
import { handleApiResponse, handleApiError, createApi } from "./apiConfig";

const userApi = {
  ...createApi("users"),
  signup: (userData) =>
    axios
      .post("/users/signup", userData)
      .then((response) => {
        localStorage.setItem("accessToken", response.data.token);
        const userWithRoles = {
          roles: response.data.roles,
          userId: response.data.userId,
          email: response.data.email,
        };
        return handleApiResponse({ ...response, data: userWithRoles });
      })
      .catch(handleApiError),

  login: (userData) =>
    axios
      .post("/users/login", userData)
      .then((response) => {
        localStorage.setItem("accessToken", response.data.token);
        const userWithRolesAndFavorites = {
          roles: response.data.roles,
          userId: response.data.id,
          email: response.data.email,
          favorites: response.data.favorites || [],
        };
        console.log("userWithRolesAndFavorites", userWithRolesAndFavorites);
        return handleApiResponse({
          ...response,
          data: userWithRolesAndFavorites,
        });
      })
      .catch(handleApiError),

  logout: () => {
    localStorage.removeItem("accessToken");
    return Promise.resolve({ status: "OK", message: "User logged out" });
  },

  getAccount: () =>
    axios
      .get("/users/account", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(handleApiResponse)
      .catch(handleApiError),

  getAllUsers: () =>
    axios
      .get("/users/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(handleApiResponse)
      .catch(handleApiError),

  addToFavorites: (userId, strainId) =>
    axios
      .post(
        `/users/${userId}/favorites/${strainId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(handleApiResponse)
      .catch(handleApiError),

  removeFromFavorites: (userId, strainId) =>
    axios
      .delete(`/users/${userId}/favorites/${strainId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(handleApiResponse)
      .catch(handleApiError),

  getFavorites: async (userId) => {
    try {
      const response = await axios.get(`/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get favorites:", error);
      throw error;
    }
  },

  // Method to update favorites in the backend
  updateFavorites: (userId, favorites) =>
    axios
      .put(
        `/users/${userId}/favorites`,
        favorites.map((fav) => fav),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(handleApiResponse)
      .catch(handleApiError),

  // Additional methods for reset password and verification email
  requestResetPassword: (email) =>
    axios
      .post("/users/request-reset-password", { email })
      .then(handleApiResponse)
      .catch(handleApiError),

  resetPassword: (token, password) =>
    axios
      .post(`/users/reset-password/${token}`, { password })
      .then(handleApiResponse)
      .catch(handleApiError),

  requestVerificationEmail: (email) =>
    axios
      .post("/users/request-verification-email", { email })
      .then(handleApiResponse)
      .catch(handleApiError),

  verifyEmail: (token) =>
    axios
      .post(`/users/verify-email/${token}`)
      .then(handleApiResponse)
      .catch(handleApiError),
};

export default userApi;
