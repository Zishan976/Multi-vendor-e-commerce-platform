import axios from "axios";

export const api = axios.create({
  //   baseURL: import.meta.env.PROD
  //     ? "https://habitto.onrender.com/api"
  //     : "http://localhost:3000/api",
  baseURL: "http://localhost:3000/api",
});

// Add request interceptor to dynamically set the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `bearer ${token}`;
  }
  return config;
});
