import { Navigate, Outlet } from "react-router-dom";
import type { PropsWithChildren } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { paths } from "@/shared/routes/paths";
import type { UserRole } from "@/shared/types";

interface RequireRoleProps extends PropsWithChildren {
  role?: UserRole;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={paths.home} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}

export default RequireRole;
