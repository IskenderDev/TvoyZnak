import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "admin" | "user";

export interface AuthUser {
  id?: string | number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role?: Role;
  token?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role?: Role;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

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

  const setUser = useCallback((value: AuthUser | null) => {
    setUserState(value);
    persistUser(value);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role ?? "admin",
      setUser,
      logout,
    }),
    [logout, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

