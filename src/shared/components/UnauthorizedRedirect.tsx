import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

export function UnauthorizedRedirect() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      void logout().finally(() => {
        navigate(paths.auth.login, { replace: true });
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handleUnauthorized);
      return () => {
        window.removeEventListener("auth:unauthorized", handleUnauthorized);
      };
    }

    return undefined;
  }, [logout, navigate]);

  return null;
}
