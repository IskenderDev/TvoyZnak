export interface StoredAuth {
  token: string;
  user: unknown;
}

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  },
  getUser<T>(): T | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn("Failed to parse stored user", error);
      return null;
    }
  },
  setUser<T>(user: T | null) {
    if (typeof window === "undefined") return;
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};

export const AUTH_EVENTS = {
  UNAUTHORIZED: "auth:unauthorized",
};

export const emitUnauthorized = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
};
