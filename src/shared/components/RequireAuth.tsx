import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={paths.auth.register} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
