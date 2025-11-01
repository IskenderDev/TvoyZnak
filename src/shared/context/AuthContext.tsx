import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthCredentials, AuthUser, RegisterPayload } from "@/entities/auth/types";
import type { UserRole } from "@/entities/user/types";
import { apiService, type AuthResult } from "@/shared/api/apiService";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/shared/api/tokenStorage";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role?: UserRole;
  login: (credentials: AuthCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  refresh: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "authUser";

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && typeof parsed.fullName === "string") {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse stored user", error);
  }

  return null;
};

const persistUser = (user: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());

  const applyAuthResult = useCallback((result: AuthResult): AuthUser => {
    const nextUser: AuthUser = {
      ...result.user,
      token: result.token ?? result.user.token,
    };
    setAuthToken(nextUser.token ?? null);
    persistUser(nextUser);
    setUserState(nextUser);
    return nextUser;
  }, []);

  const setUser = useCallback((value: AuthUser | null) => {
    setUserState(value);
    persistUser(value);
    if (value?.token) {
      setAuthToken(value.token);
    } else if (!value) {
      clearAuthToken();
    }
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const result = await apiService.auth.login(credentials);
      return applyAuthResult(result);
    },
    [applyAuthResult],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await apiService.auth.register(payload);
      return applyAuthResult(result);
    },
    [applyAuthResult],
  );

  const refresh = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      return null;
    }

    const result = await apiService.auth.me();
    if (!result) {
      setUser(null);
      return null;
    }

    return applyAuthResult({ ...result, token: result.token ?? token });
  }, [applyAuthResult, setUser]);

  const logout = useCallback(async () => {
    await apiService.auth.logout();
    setUser(null);
    clearAuthToken();
  }, [setUser]);

  useEffect(() => {
    const token = getAuthToken();
    if (token && !user) {
      void refresh();
    }
  }, [refresh, user]);

  useEffect(() => {
    const handler = () => {
      setUser(null);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handler);
      return () => {
        window.removeEventListener("auth:unauthorized", handler);
      };
    }

    return undefined;
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      role: user?.role ?? "user",
      login,
      register,
      refresh,
      logout,
      setUser,
    }),
    [login, logout, refresh, register, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
