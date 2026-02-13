import axios from "axios";
import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

export const api = axios.create({
  //   baseURL: import.meta.env.PROD
  //     ? "https://habitto.onrender.com/api"
  //     : "http://localhost:3000/api",
  baseURL: "http://localhost:3000/api",
});

// Add request interceptor to dynamically set the token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data?.error === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        const newToken = getAccessToken();
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        clearTokens();
        // Optionally redirect to login page
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
