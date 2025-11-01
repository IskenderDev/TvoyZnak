import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import type { UserRole } from "@/entities/user/types";
import { paths } from "@/shared/routes/paths";

export function RequireRole({ role }: { role: UserRole }) {
  const { isAuthenticated, role: currentRole } = useAuth();
  if (!isAuthenticated) return <Navigate to={paths.auth.login} replace />;
  if (currentRole !== role) return <Navigate to={paths.home} replace />;
  return <Outlet />;
}
