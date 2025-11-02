import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authStorage, AUTH_EVENTS } from "@/shared/lib/authStorage";
import type { User, UserRole } from "@/shared/types";

interface AuthState {
  user: User | null;
  token: string | null;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setAuthState: (state: AuthState) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthStateInternal] = useState<AuthState>(() => ({
    user: authStorage.getUser<User>(),
    token: authStorage.getToken(),
  }));

  const setAuthState = useCallback((state: AuthState) => {
    setAuthStateInternal(state);
    authStorage.setToken(state.token);
    authStorage.setUser(state.user);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setAuthStateInternal({ user: null, token: null });
  }, []);

  const updateUser = useCallback((user: User) => {
    setAuthStateInternal((prev) => {
      const next: AuthState = { ...prev, user };
      authStorage.setUser(user);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      setAuthStateInternal({ user: null, token: null });
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handler);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handler);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const { user, token } = authState;
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
      role: user?.role ?? null,
      setAuthState,
      logout,
      updateUser,
    };
  }, [authState, logout, setAuthState, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
