import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useNavigate } from "react-router-dom";

import LoginDialog from "@/features/auth/ui/LoginDialog";
import RegisterDialog from "@/features/auth/ui/RegisterDialog";
import { paths } from "@/shared/routes/paths";

export type AuthDialogMode = "login" | "register";

interface DialogState {
  mode: AuthDialogMode;
  redirectTo: string | null;
}

interface OpenOptions {
  redirectTo?: string | null;
}

export interface AuthDialogContextValue {
  isOpen: boolean;
  mode: AuthDialogMode | null;
  redirectTo: string | null;
  openLogin: (options?: OpenOptions) => void;
  openRegister: (options?: OpenOptions) => void;
  close: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);

const DEFAULT_REDIRECT = paths.profile;

export function AuthDialogProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [state, setState] = useState<DialogState | null>(null);

  const openLogin = useCallback((options?: OpenOptions) => {
    setState({
      mode: "login",
      redirectTo: options?.redirectTo ?? null,
    });
  }, []);

  const openRegister = useCallback((options?: OpenOptions) => {
    setState({
      mode: "register",
      redirectTo: options?.redirectTo ?? null,
    });
  }, []);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const handleSuccess = useCallback(
    (explicitRedirect?: string | null) => {
      const target = explicitRedirect ?? state?.redirectTo ?? DEFAULT_REDIRECT;
      close();
      if (target) {
        navigate(target, { replace: true });
      }
    },
    [close, navigate, state?.redirectTo],
  );

  const contextValue = useMemo<AuthDialogContextValue>(() => ({
    isOpen: Boolean(state),
    mode: state?.mode ?? null,
    redirectTo: state?.redirectTo ?? null,
    openLogin,
    openRegister,
    close,
  }), [close, openLogin, openRegister, state]);

  return (
    <AuthDialogContext.Provider value={contextValue}>
      {children}
      {state?.mode === "login" ? (
        <LoginDialog
          onClose={close}
          redirectTo={state.redirectTo}
          onSwitchToRegister={() => openRegister({ redirectTo: state.redirectTo })}
          onSuccess={handleSuccess}
        />
      ) : null}
      {state?.mode === "register" ? (
        <RegisterDialog
          onClose={close}
          redirectTo={state.redirectTo}
          onSwitchToLogin={() => openLogin({ redirectTo: state.redirectTo })}
          onSuccess={handleSuccess}
        />
      ) : null}
    </AuthDialogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthDialogContext(): AuthDialogContextValue {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialogContext must be used within AuthDialogProvider");
  }
  return context;
}
