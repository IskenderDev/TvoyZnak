import { useCallback, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { useAuth } from "@/shared/lib/hooks/useAuth";

export type AuthModalView = "login" | "register";

const AUTH_PARAM = "auth";
const REDIRECT_PARAM = "redirectTo";

interface OpenOptions {
  replace?: boolean;
  redirectTo?: string;
}

const sanitizeRedirect = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    return undefined;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("?") || trimmed.startsWith("#")) {
    return trimmed;
  }
  return undefined;
};

export function useAuthModal() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedView = searchParams.get(AUTH_PARAM);
  const isRequestedOpen = requestedView === "login" || requestedView === "register";
  const view: AuthModalView = requestedView === "register" ? "register" : "login";
  const redirectTo = sanitizeRedirect(searchParams.get(REDIRECT_PARAM));

  const open = useCallback(
    (nextView: AuthModalView, options: OpenOptions = {}) => {
      const sanitizedRedirect = sanitizeRedirect(options.redirectTo ?? redirectTo ?? undefined);

      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(AUTH_PARAM, nextView);
          if (sanitizedRedirect) {
            params.set(REDIRECT_PARAM, sanitizedRedirect);
          } else {
            params.delete(REDIRECT_PARAM);
          }
          return params;
        },
        { replace: options.replace ?? false },
      );
    },
    [redirectTo, setSearchParams],
  );

  const close = useCallback(
    (options?: { replace?: boolean }) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.delete(AUTH_PARAM);
          params.delete(REDIRECT_PARAM);
          return params;
        },
        { replace: options?.replace ?? true },
      );
    },
    [setSearchParams],
  );

  const switchTo = useCallback(
    (nextView: AuthModalView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(AUTH_PARAM, nextView);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return useMemo(
    () => ({
      isOpen: isRequestedOpen,
      view,
      redirectTo,
      open,
      openLogin: (options?: OpenOptions) => open("login", options),
      openRegister: (options?: OpenOptions) => open("register", options),
      close,
      switchTo,
      isAuthenticated,
      currentLocation: `${location.pathname}${location.search}${location.hash}`,
    }),
    [
      close,
      isAuthenticated,
      isRequestedOpen,
      location.hash,
      location.pathname,
      location.search,
      open,
      redirectTo,
      switchTo,
      view,
    ],
  );
}
