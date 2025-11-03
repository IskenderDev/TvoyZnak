import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "@/shared/routes/paths";
import { authStorage } from "@/features/auth/lib/authStorage";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
} from "@/features/auth/api/authService";
import type {
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/api/authService";
import type { AuthSession, AuthUser, Role } from "@/entities/session/model/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.load());

  const applySession = useCallback((next: AuthSession | null) => {
    setSession(next);
    authStorage.save(next);
  }, []);

  useEffect(() => {
    return authStorage.subscribe(() => {
      applySession(null);
      navigate(paths.auth.login, { replace: true });
    });
  }, [applySession, navigate]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const nextSession = await loginRequest(payload);
      applySession(nextSession);
      return nextSession;
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const nextSession = await registerRequest(payload);
      applySession(nextSession);
      return nextSession;
    },
    [applySession],
  );

  const logout = useCallback(() => {
    logoutRequest().catch((error) => {
      console.warn("Failed to call logout endpoint", error);
    });
    authStorage.clear();
    authStorage.emitLogout();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      roles: session?.user?.roles ?? [],
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }),
    [login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
