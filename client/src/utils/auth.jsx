import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getUserFromToken();
  return user && user.role === "admin";
};

export const isVendor = () => {
  const user = getUserFromToken();
  return user && user.role === "vendor";
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    // Use axios directly to bypass the request interceptor that adds the expired token
    // The /auth/refresh endpoint now requires authentication, but we'll use a direct axios call
    // to avoid the circular dependency (interceptor adds expired token -> causes 401 -> tries to refresh)
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/refresh`,
      { refreshToken },
    );
    const data = response.data;

    storeTokens(data.accessToken, null); // Don't overwrite refresh token
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    throw error;
  }
};
