import axios from "axios";
import { clearAuthToken, getAuthToken } from "@/shared/api/tokenStorage";

const baseURL = ((): string => {
  const url = import.meta?.env?.VITE_API_BASE_URL;
  if (url && typeof url === "string" && url.trim()) {
    return url;
  }
  return "http://localhost:8081/";
})();

export const API_BASE_URL = baseURL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API error:",
        error.response.status,
        error.response.data ?? error.message,
      );
      if (error.response.status === 401) {
        clearAuthToken();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
