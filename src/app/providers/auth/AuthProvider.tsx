import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "@/shared/routes/paths";
import { authStorage } from "@/features/auth/lib/authStorage";
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  type RegisterPayload,
} from "@/features/auth/api/authService";
import type { AuthSession } from "@/entities/session/model/auth";
import {
  AuthContext,
  type AuthContextValue,
  type ExtendedLoginPayload,
} from "./AuthContext";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.load());

  const applySession = useCallback((next: AuthSession | null, options?: { remember?: boolean }) => {
    setSession(next);
    authStorage.save(next, { remember: options?.remember });
  }, []);

  useEffect(() => {
    return authStorage.subscribe(() => {
      applySession(null);
      navigate({ pathname: paths.home, search: "?auth=login" }, { replace: true });
    });
  }, [applySession, navigate]);

  const login = useCallback(
    async (payload: ExtendedLoginPayload) => {
      const { remember, ...credentials } = payload;
      const nextSession = await loginRequest(credentials);
      applySession(nextSession, { remember });
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
