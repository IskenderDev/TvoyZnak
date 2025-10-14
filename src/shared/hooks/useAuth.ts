import { useMemo } from "react";

export type Role = "admin" | "user";

export function useAuth() {
  const isAuthenticated = true; 
  const role: Role | undefined = "admin";

  return useMemo(() => ({ isAuthenticated, role }), [isAuthenticated, role]);
}
