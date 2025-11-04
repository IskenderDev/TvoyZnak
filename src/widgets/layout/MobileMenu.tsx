import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { LuCircleUserRound, LuX } from "react-icons/lu";

import Button from "@/shared/components/Button";
import { useLockBodyScroll } from "@/shared/lib/hooks/useLockBodyScroll";
import { paths } from "@/shared/routes/paths";
import type { AuthUser } from "@/shared/lib/hooks/useAuth";

import HeaderNav from "./HeaderNav";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onSellClick: () => void;
  user: AuthUser | null;
  menuId: string;
  onLoginClick: () => void;
};

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input[type="text"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function MobileMenu({
  isOpen,
  onClose,
  onSellClick,
  user,
  menuId,
  onLoginClick,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElement.current = document.activeElement;

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const focusable = panel.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusable.item(0);
    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) {
          return;
        }

        const focusable = panel.querySelectorAll<HTMLElement>(focusableSelectors);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const previous = previouslyFocusedElement.current as HTMLElement | null;
      if (previous) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  const overlay = (
    <div
      className={`fixed inset-0 z-40 transition duration-200 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
        tabIndex={-1}
        id={menuId}
        className={`ml-auto flex h-full w-full max-w-xs flex-col bg-gradient-to-b from-[#001833] via-[#003979] to-[#004899] p-6 shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to={paths.home} onClick={onClose} className="shrink-0">
            <img src="/logo.svg" alt="Знак отличия" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Закрыть меню"
          >
            <LuX className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto pb-6">
          {user ? (
            <Link
              to={paths.profile}
              onClick={onClose}
              className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
            >
              <LuCircleUserRound className="h-7 w-7" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-xs text-white/70">Перейти в профиль</span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                onLoginClick();
                onClose();
              }}
              className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
            >
              <LuCircleUserRound className="h-7 w-7" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Войти</span>
                <span className="text-xs text-white/70">Авторизация</span>
              </div>
            </button>
          )}

          <Button
            onClick={() => {
              onSellClick();
              onClose();
            }}
            className="w-full rounded-full bg-gradient-to-r from-[#0074FF] to-[#005CDB] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Продать номер
          </Button>

          <HeaderNav
            orientation="vertical"
            onNavigate={onClose}
            className="gap-5 text-white"
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(overlay, document.body);
}
