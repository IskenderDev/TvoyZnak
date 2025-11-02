import axios, { AxiosHeaders } from "axios";

import { authStorage } from "@/features/auth/lib/authStorage";

const baseURL = ((): string => {
  const url = import.meta?.env?.VITE_API_BASE_URL;
  if (typeof url === "string" && url.trim()) {
    return url;
  }
  return "http://localhost:8081/";
})();

const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authStorage.clear();
      authStorage.emitLogout();
    }
    return Promise.reject(error);
  },
);

export { baseURL as API_BASE_URL };
export default http;
