import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/context/AuthContext";

export { type Role, type AuthUser, type AuthSession } from "@/types/auth";
export { type LoginPayload, type RegisterPayload } from "@/services/authService";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
