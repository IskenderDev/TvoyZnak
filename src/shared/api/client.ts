import axios from "axios";

const baseURL = ((): string => {
  const url = import.meta?.env?.VITE_API_BASE_URL;
  if (url && typeof url === "string" && url.trim()) {
    return url;
  }
  return "http://172.20.10.3:8081";
})();

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
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
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
