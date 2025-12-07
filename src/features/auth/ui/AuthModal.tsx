import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { useLockBodyScroll } from "@/shared/lib/hooks/useLockBodyScroll";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { paths } from "@/shared/routes/paths";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuthModal, type AuthModalView } from "@/features/auth/lib/useAuthModal";

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const ANIMATION_MS = 200;

const VIEW_TITLE: Record<AuthModalView, string> = {
  login: "ВОЙТИ В СИСТЕМУ",
  register: "ЗАРЕГИСТРИРОВАТЬСЯ",
};

export default function AuthModal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isOpen,
    view,
    close,
    switchTo,
    redirectTo,
    isAuthenticated,
  } = useAuthModal();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const [renderState, setRenderState] = useState<"closed" | "opening" | "open" | "closing">(
    () => (isOpen ? "opening" : "closed"),
  );
  const [shouldRender, setShouldRender] = useState(isOpen);

  useLockBodyScroll(shouldRender);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setRenderState("opening");
      const frame = requestAnimationFrame(() => setRenderState("open"));
      return () => cancelAnimationFrame(frame);
    }

    if (shouldRender) {
      setRenderState("closing");
      const timeout = window.setTimeout(() => {
        setShouldRender(false);
        setRenderState("closed");
      }, ANIMATION_MS);
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      return;
    }

    const node = contentRef.current;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusable = node.querySelectorAll<HTMLElement>(focusableSelectors);
    const first = focusable.item(0);
    if (first) {
      first.focus({ preventScroll: true });
    } else {
      node.focus({ preventScroll: true });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableInside = node.querySelectorAll<HTMLElement>(focusableSelectors);
      if (focusableInside.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableInside.item(0);
      const lastElement = focusableInside.item(focusableInside.length - 1);
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus({ preventScroll: true });
    };
  }, [close, isOpen]);

  const handleOverlayMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = event.target;
  };

  const handleOverlayMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === mouseDownTarget.current) {
      close();
    }
  };

  const handleSuccess = () => {
    const target = redirectTo;
    close();
    if (target) {
      navigate(target, { replace: true });
    }
  };

  const stateAttribute = useMemo(() => {
    switch (renderState) {
      case "opening":
        return "opening";
      case "open":
        return "open";
      case "closing":
        return "closing";
      default:
        return "closed";
    }
  }, [renderState]);

  if (typeof document === "undefined" || !shouldRender) {
    return null;
  }

  const showAuthenticatedMessage = isAuthenticated;

  return createPortal(
    <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center px-4 py-6 sm:py-10">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.70)] transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=opening]:opacity-0 data-[state=closing]:opacity-0"
        data-state={stateAttribute}
        onMouseDown={handleOverlayMouseDown}
        onMouseUp={handleOverlayMouseUp}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        tabIndex={-1}
        data-state={stateAttribute}
        className="relative z-10 flex w-full max-w-[640px] flex-col overflow-hidden rounded-3xl bg-[#1B1B1B] px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] outline-none transition-all duration-200 ease-out data-[state=opening]:translate-y-2 data-[state=opening]:opacity-0 data-[state=closing]:translate-y-2 data-[state=closing]:opacity-0 sm:px-8 sm:py-8 max-h-[90vh]"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <h2
              id="auth-modal-title"
              className="text-[36px] font-extrabold uppercase tracking-wide text-[#1E66FF] sm:text-[24px]"
            >
              {showAuthenticatedMessage ? "ВЫ УЖЕ В СИСТЕМЕ" : VIEW_TITLE[view]}
            </h2>
            <p
              id="auth-modal-description"
              className={showAuthenticatedMessage ? "text-sm text-white/60" : "sr-only"}
            >
              {showAuthenticatedMessage
                ? `Аккаунт ${user?.fullName ?? ""} уже авторизован.`
                : "Модальное окно авторизации"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => close()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Закрыть авторизацию"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {!showAuthenticatedMessage ? (
          <div className="mt-6 flex flex-1 flex-col overflow-y-auto">
            {view === "login" ? (
              <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => switchTo("register")} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => switchTo("login")} />
            )}
          </div>
        ) : (
          <div className="mt-6 flex flex-1 flex-col gap-6">
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              Вы уже авторизованы. Если хотите использовать другой аккаунт, выйдите из текущего профиля.
            </p>
            <div className="mt-auto grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  close();
                  if (user) {
                    navigate(paths.profile);
                  }
                }}
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#1E66FF] px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
              >
                В профиль
              </button>
              <button
                type="button"
                onClick={() => close()}
                className="inline-flex h-12 items-center justify-center rounded-[10px] border border-white/20 px-6 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
              >
                Продолжить просмотр
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
