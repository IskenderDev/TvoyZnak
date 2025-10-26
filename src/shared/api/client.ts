import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { buildNextSearch } from "@/shared/lib/navigation";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    skipAuthRedirect?: boolean;
  }
}

const resolveBaseUrl = (): string => {
  const url = import.meta?.env?.VITE_API_BASE_URL;
  if (url && typeof url === "string" && url.trim().length > 0) {
    return url;
  }
  return "http://localhost:8081";
};

const apiClient: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const handleUnauthorized = (config?: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!config?.requiresAuth || config.skipAuthRedirect) {
    return;
  }

  const nextPath = window.location.pathname + window.location.search + window.location.hash;
  const query = buildNextSearch(nextPath);
  const target = query ? `/sell?${query}` : "/sell";
  window.location.assign(target);
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleUnauthorized(error.config);
    }

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
