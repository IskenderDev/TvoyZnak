import { useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiService } from "@/shared/api/apiService";
import { AuthContext } from "@/shared/context/AuthContext";
import { paths } from "@/shared/routes/paths";
import type {
  CarNumberLot,
  CreateCarNumberLotWithRegistrationPayload,
  User,
  UserCredentials,
  UserRegistrationPayload,
} from "@/shared/types";

interface AuthHookResult {
  user: User | null;
  isAuthenticated: boolean;
  role: User["role"] | null;
  token: string | null;
  loading: boolean;
  login: (credentials: UserCredentials) => Promise<User | null>;
  register: (payload: UserRegistrationPayload) => Promise<User | null>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
  autoRegisterWithLot: (
    payload: CreateCarNumberLotWithRegistrationPayload,
  ) => Promise<{ user: User; lot: CarNumberLot } | null>;
}

export function useAuth(): AuthHookResult {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, token, setAuthState, logout: contextLogout, updateUser } = context;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = useCallback(
    (authToken: string, authUser: User) => {
      setAuthState({ token: authToken, user: authUser });
      return authUser;
    },
    [setAuthState],
  );

  const login = useCallback(
    async (credentials: UserCredentials) => {
      try {
        setLoading(true);
        const auth = await apiService.auth.login(credentials);
        handleAuthSuccess(auth.token, auth.user);
        return auth.user;
      } catch (error) {
        console.error("Login failed", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess],
  );

  const register = useCallback(
    async (payload: UserRegistrationPayload) => {
      try {
        setLoading(true);
        const auth = await apiService.auth.register(payload);
        handleAuthSuccess(auth.token, auth.user);
        return auth.user;
      } catch (error) {
        console.error("Registration failed", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess],
  );

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    try {
      setLoading(true);
      const profile = await apiService.auth.me();
      updateUser(profile);
      return profile;
    } catch (error) {
      console.error("Failed to refresh profile", error);
      contextLogout();
      navigate(paths.auth.login, { replace: true });
      return null;
    } finally {
      setLoading(false);
    }
  }, [contextLogout, navigate, token, updateUser]);

  const logout = useCallback(() => {
    contextLogout();
    navigate(paths.auth.login, { replace: true });
  }, [contextLogout, navigate]);

  const autoRegisterWithLot = useCallback(
    async (payload: CreateCarNumberLotWithRegistrationPayload) => {
      try {
        setLoading(true);
        const response = await apiService.carNumberLots.createAndRegister(payload);
        handleAuthSuccess(response.token, response.user);
        return { user: response.user, lot: response.lot };
      } catch (error) {
        console.error("Auto registration failed", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess],
  );

  return useMemo(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      register,
      logout,
      refreshProfile,
      autoRegisterWithLot,
    }),
    [autoRegisterWithLot, loading, login, logout, register, refreshProfile, token, user],
  );
}
