// src/api/apiConfig.tsx
import axios from 'axios';

const API_URL = 'http://localhost:3100';

const apiClient = axios.create({
  baseURL: API_URL,
  validateStatus: (status: number) => status >= 200 && status < 500,
});

// Set Authorization header dynamically for each request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    return Promise.reject(error);
  },
);

export default apiClient;
