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
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input[type="text"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  "select:not([disabled])",
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

  const userRoles = user?.roles?.length ? user.roles : user?.role ? [user.role] : [];
  const isAdmin = userRoles.includes("admin");
  const profileDestination = isAdmin ? paths.admin.lots : paths.profile;

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusable.item(0);
    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;

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
      className={`fixed inset-0 z-400 transition duration-200 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
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
        className={`
          ml-auto flex h-full w-full max-w-xs flex-col
          bg-[radial-gradient(circle_at_top,_#003C8F_0,_#020617_55%,_#000814_100%)]
          text-white
          shadow-[0_24px_80px_rgba(15,23,42,0.95)]
          ring-1 ring-white/10
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-6">
          <Link
            to={paths.home}
            onClick={onClose}
            className="inline-flex items-center rounded-full bg-black/40 px-3 py-1.5 ring-1 ring-white/10"
          >
            <img src="/logo.svg" alt="Знак отличия" className="h-7 w-auto" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full bg-white/5 p-2
              text-white
              ring-1 ring-white/15
              backdrop-blur-xl
              transition
              hover:bg-white/10 hover:ring-white/30
            "
            aria-label="Закрыть меню"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-8 pt-2">
          {user ? (
            <Link
              to={profileDestination}
              onClick={onClose}
              className="
                flex items-center gap-3
                rounded-2xl
                bg-white/5
                px-4 py-3
                text-left text-slate-100
                ring-1 ring-white/10
                backdrop-blur-xl
                transition
                hover:bg-white/10 hover:text-white hover:ring-white/30
              "
            >
              <LuCircleUserRound className="h-7 w-7" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.fullName}</span>
                <span className="text-xs text-white/70">
                  {isAdmin ? "Перейти в админку" : "Перейти в профиль"}
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                onLoginClick();
                onClose();
              }}
              className="
                flex items-center gap-3
                rounded-2xl
                bg-white/5
                px-4 py-3
                text-left text-slate-100
                ring-1 ring-white/10
                backdrop-blur-xl
                transition
                hover:bg-white/10 hover:text-white hover:ring-white/30
              "
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
            className="
              w-full rounded-full
              bg-gradient-to-r from-[#1D9BFF] via-[#1A6DFF] to-[#005CDB]
              px-4 py-3
              text-sm font-semibold text-white
              shadow-[0_0_32px_rgba(59,130,246,0.7)]
              transition
              hover:shadow-[0_0_42px_rgba(59,130,246,0.95)]
              hover:brightness-110
            "
          >
            Продать номер
          </Button>

          <div
            className="
              rounded-2xl
              bg-black/40
              px-3 py-3
              ring-1 ring-white/10
              backdrop-blur-2xl
              shadow-[0_18px_45px_rgba(15,23,42,0.8)]
            "
          >
            <HeaderNav
              orientation="vertical"
              onNavigate={onClose}
              className="gap-3 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(overlay, document.body);
}
