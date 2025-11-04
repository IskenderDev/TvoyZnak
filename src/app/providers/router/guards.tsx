import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/lib/hooks/useAuth";
import type { Role } from "@/entities/session/model/auth";
import { paths } from "@/shared/routes/paths";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set("auth", "login");
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    if (redirectTo) {
      params.set("redirectTo", redirectTo);
    }

    return (
      <Navigate
        to={{ pathname: paths.home, search: `?${params.toString()}` }}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export function RequireRole({ role }: { role: Role }) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set("auth", "login");
    return <Navigate to={{ pathname: paths.home, search: `?${params.toString()}` }} replace />;
  }

  const hasRole = roles.some((current) => current === role);

  if (!hasRole) {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}
