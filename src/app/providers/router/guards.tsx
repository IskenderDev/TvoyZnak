import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/lib/hooks/useAuth";
import type { Role } from "@/entities/session/model/auth";
import { paths } from "@/shared/routes/paths";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireRole({ role }: { role: Role }) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  const hasRole = roles.some((current) => current === role);

  if (!hasRole) {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}
