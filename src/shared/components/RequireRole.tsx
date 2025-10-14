import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Role } from "@/shared/hooks/useAuth"; 
import { paths } from "@/shared/routes/paths";

export function RequireRole({ role }: { role: Role }) {
  const { isAuthenticated, role: currentRole } = useAuth();
  if (!isAuthenticated) return <Navigate to={paths.auth.register} replace />;
  if (currentRole !== role) return <Navigate to={paths.home} replace />;
  return <Outlet />;
}
