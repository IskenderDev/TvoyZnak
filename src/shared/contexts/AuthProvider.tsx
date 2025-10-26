import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { isAxiosError } from "axios";

import {
  login as loginRequest,
  me as meRequest,
  register as registerRequest,
  type AuthUser,
  type RegisterPayload,
} from "@/shared/services/authApi";

export type Role = "admin" | "user";

export interface ExtendedAuthUser extends AuthUser {
  phone?: string | null;
  phoneNumber?: string | null;
  role?: Role;
  token?: string | null;
}

export interface AuthContextValue {
  user: ExtendedAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  role?: Role;
  login: (email: string, password: string) => Promise<ExtendedAuthUser>;
  register: (payload: RegisterPayload) => Promise<ExtendedAuthUser>;
  ensureSession: () => Promise<ExtendedAuthUser | null>;
  logout: () => void;
  setUser: (user: ExtendedAuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapUser = (user: AuthUser | null): ExtendedAuthUser | null => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    phone: "phone" in user ? (user as { phone?: string | null }).phone ?? null : null,
    phoneNumber:
      "phoneNumber" in user ? (user as { phoneNumber?: string | null }).phoneNumber ?? null : null,
  };
};

const isUnauthorizedError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 401;

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUserState] = useState<ExtendedAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setUser = useCallback((value: ExtendedAuthUser | null) => {
    setUserState(value);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const ensureSession = useCallback(async () => {
    setLoading(true);
    try {
      const me = await meRequest();
      const mapped = mapUser(me);
      setUser(mapped);
      return mapped;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setUser(null);
        return null;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void ensureSession().catch(() => {
      // Ошибку проглатываем, состояние already handled
    });
  }, [ensureSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const nextUser = await loginRequest({ email, password });
        const mapped = mapUser(nextUser);
        setUser(mapped);
        return (
          mapped ?? {
            id: nextUser.id,
            fullName: nextUser.fullName,
            email: nextUser.email,
          }
        ) as ExtendedAuthUser;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const nextUser = await registerRequest(payload);
        const mapped = mapUser(nextUser);
        setUser(mapped);
        return (
          mapped ?? {
            id: nextUser.id,
            fullName: nextUser.fullName,
            email: nextUser.email,
          }
        ) as ExtendedAuthUser;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? (user ? "user" : undefined);

    return {
      user,
      loading,
      isAuthenticated: Boolean(user),
      role,
      login,
      register,
      ensureSession,
      logout,
      setUser,
    };
  }, [ensureSession, loading, login, logout, register, setUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

AuthProvider.displayName = "AuthProvider";
