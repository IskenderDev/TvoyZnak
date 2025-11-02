import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/lib/hooks/useAuth";
import type { Role } from "@/entities/session/model/auth";
import { paths } from "@/shared/routes/paths";
import { useAuthDialog } from "@/shared/lib/hooks/useAuthDialog";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { openLogin } = useAuthDialog();

  useEffect(() => {
    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}${location.hash}`;
      openLogin({ redirectTo: redirect });
    }
  }, [isAuthenticated, location.hash, location.pathname, location.search, openLogin]);

  if (!isAuthenticated) {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}

export function RequireRole({ role }: { role: Role }) {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();
  const { openLogin } = useAuthDialog();

  useEffect(() => {
    if (!isAuthenticated) {
      const redirect = `${location.pathname}${location.search}${location.hash}`;
      openLogin({ redirectTo: redirect });
    }
  }, [isAuthenticated, location.hash, location.pathname, location.search, openLogin]);

  if (!isAuthenticated) {
    return <Navigate to={paths.home} replace />;
  }

  const hasRole = roles.some((current) => current === role);

  if (!hasRole) {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}
