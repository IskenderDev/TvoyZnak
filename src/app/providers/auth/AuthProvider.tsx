import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
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
import { useAuthDialog } from "@/shared/lib/hooks/useAuthDialog";

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
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.load());
  const { openLogin } = useAuthDialog();

  const applySession = useCallback((next: AuthSession | null) => {
    setSession(next);
    authStorage.save(next);
  }, []);

  useEffect(() => {
    return authStorage.subscribe(() => {
      applySession(null);
      const currentLocation = (() => {
        if (typeof window === "undefined") {
          return null;
        }
        const { pathname, search, hash } = window.location;
        const target = `${pathname}${search}${hash}`;
        return target && target.trim() ? target : null;
      })();
      openLogin({ redirectTo: currentLocation });
    });
  }, [applySession, openLogin]);

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
      console.warn("Logout request failed", error);
    });
    applySession(null);
    authStorage.clear();
    authStorage.emitLogout();
  }, [applySession]);

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
