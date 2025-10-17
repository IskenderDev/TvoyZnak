import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
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
