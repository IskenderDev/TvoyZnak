import { createContext } from "react";

import type { AuthSession, AuthUser, Role } from "@/entities/session/model/auth";
import type { LoginPayload, RegisterPayload } from "@/features/auth/api/authService";

export type ExtendedLoginPayload = LoginPayload & { remember?: boolean };

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  login: (payload: ExtendedLoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
