import axios from "axios";
import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://multi-vendor-e-commerce-platform-4vxy.onrender.com/api" ||
    "http://localhost:3000/api",
  withCredentials: true, // Required for sending cookies in cross-origin requests (OAuth flow)
});

// Request deduplication map
const pendingRequests = new Map();

const getRequestKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
};

// Add request interceptor to dynamically set the token and deduplicate
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Request deduplication - cancel duplicate requests
  const requestKey = getRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    // Cancel current request if there's already one pending
    config.cancelToken = new axios.CancelToken((cancel) => {
      // Store cancel function but don't cancel yet - we'll handle this in adapter
    });
  } else {
    pendingRequests.set(requestKey, true);
    config.pendingRequestKey = requestKey;
  }

  return config;
});

// Remove request from deduplication map on completion
api.interceptors.response.use(
  (response) => {
    if (response.config.pendingRequestKey) {
      pendingRequests.delete(response.config.pendingRequestKey);
    }
    return response;
  },
  (error) => {
    if (error.config?.pendingRequestKey) {
      pendingRequests.delete(error.config.pendingRequestKey);
    }
    return Promise.reject(error);
  },
);

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

        // Dispatch custom event to notify components that token has been refreshed
        window.dispatchEvent(new Event("tokenRefreshed"));

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        clearTokens();
        // Notify app (e.g. Navbar) so UI updates to "Login" before redirect
        window.dispatchEvent(new Event("sessionEnded"));
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
