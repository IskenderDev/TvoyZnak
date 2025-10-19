import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/shared/context/AuthContext";

export type { Role, AuthUser } from "@/shared/context/AuthContext";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
