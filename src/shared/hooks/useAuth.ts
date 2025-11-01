import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/shared/context/AuthContext";

export type { AuthContextValue } from "@/shared/context/AuthContext";
export type { AuthUser, AuthCredentials, RegisterPayload } from "@/entities/auth/types";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
