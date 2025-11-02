import { useContext } from "react";

import {
  AuthContext,
  type AuthContextValue,
} from "@/app/providers/auth/AuthProvider";

export { type Role, type AuthUser, type AuthSession } from "@/entities/session/model/auth";
export { type LoginPayload, type RegisterPayload } from "@/features/auth/api/authService";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
