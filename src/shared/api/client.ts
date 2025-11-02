import axios from "axios";
import { authStorage, emitUnauthorized } from "@/shared/lib/authStorage";

const baseURL = ((): string => {
  const url = import.meta?.env?.VITE_API_BASE_URL;
  if (url && typeof url === "string" && url.trim()) {
    return url;
  }
  return "http://localhost:8081";
})();

export const API_BASE_URL = baseURL;

export const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      emitUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
