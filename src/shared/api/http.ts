import axios from "axios";

import { authStorage } from "@/features/auth/lib/authStorage";

const baseURL = (() => {
  const env = import.meta?.env ?? {};
  const candidate =
    (env.VITE_API_URL as string | undefined) ??
    (env.VITE_API_BASE_URL as string | undefined);

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate;
  }

  return "http://localhost:8081/";
})();

const http = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const session = authStorage.load();
  const token = session?.token;

  if (token) {
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    (config.headers as Record<string, string>)["Authorization"] = token;
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

    const normalized = new Error(
      extractErrorMessage(error, "Неизвестная ошибка запроса"),
    );
    return Promise.reject(normalized);
  },
);

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const axiosError = error as {
      message?: unknown;
      response?: { data?: { message?: unknown; error?: unknown } };
    };

    const responseMessage = axiosError.response?.data?.message;
    const responseError = axiosError.response?.data?.error;
    const message = axiosError.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
};

export { baseURL as API_BASE_URL };
export default http;
