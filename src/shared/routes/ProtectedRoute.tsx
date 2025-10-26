import type { PropsWithChildren, ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/contexts/AuthProvider";
import { buildCurrentPath, buildNextSearch } from "@/shared/lib/navigation";

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, redirectTo = "/sell", fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[240px] w-full items-center justify-center text-sm text-white/70">
        {fallback ?? "Проверяем авторизацию…"}
      </div>
    );
  }

  if (!user) {
    const current = buildCurrentPath(location.pathname, location.search, location.hash);
    const query = buildNextSearch(current);
    const target = query ? `${redirectTo}?${query}` : redirectTo;
    return <Navigate to={target} replace />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}
