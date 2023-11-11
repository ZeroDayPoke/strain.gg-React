// ./src/api/apiConfig.js

import axios from "axios";

const API_URL = "http://localhost:3100"; // Update with your backend API URL

// Set the default base URL for Axios requests
axios.defaults.baseURL = API_URL;

// Error handling
export const handleApiError = (error) => {
  let errorMsg = "";
  if (axios.isCancel(error)) {
    console.log("API request canceled:", error.message);
  } else {
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    } else if (error.message) {
      errorMsg = error.message;
    } else {
      errorMsg = "An unexpected error occurred";
    }
    console.error("API Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

// Helper function to handle API responses
export const handleApiResponse = (response) => response.data;

// API factory function
export const createApi = (endpoint) => ({
  create: (data, userId, config = {}) => {
    if (data instanceof FormData) {
      data.append("userId", userId);
      return axios
        .post(`/${endpoint}`, data, config)
        .then(handleApiResponse)
        .catch(handleApiError);
    } else {
      return axios
        .post(`/${endpoint}`, { ...data, userId }, config)
        .then(handleApiResponse)
        .catch(handleApiError);
    }
  },

  get: (id, params) =>
    axios
      .get(id ? `/${endpoint}/${id}` : `/${endpoint}`, { params })
      .then(handleApiResponse)
      .catch(handleApiError),

  update: (id, data, config = {}) =>
    axios
      .put(`/${endpoint}/${id}`, data, config)
      .then(handleApiResponse)
      .catch(handleApiError),

  delete: (id) =>
    axios
      .delete(`/${endpoint}/${id}`)
      .then(handleApiResponse)
      .catch(handleApiError),
});
