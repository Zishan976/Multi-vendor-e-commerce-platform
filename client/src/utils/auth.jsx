import { jwtDecode } from "jwt-decode";
import { api } from "./api";

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
    // The refresh endpoint doesn't require authentication, so api.post is fine
    const response = await api.post("/auth/refresh", { refreshToken });
    const data = response.data;

    storeTokens(data.accessToken, null); // Don't overwrite refresh token
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    throw error;
  }
};
