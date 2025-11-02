import axios from "axios";

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
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
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
