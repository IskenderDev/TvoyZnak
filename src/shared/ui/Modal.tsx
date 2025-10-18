import type { MouseEvent as ReactMouseEvent, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input, select, details,[tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, children }: PropsWithChildren<ModalProps>) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const mouseDownTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirstElement = () => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        contentRef.current?.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    focusFirstElement();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  const getFocusableElements = () => {
    if (!contentRef.current) return [] as HTMLElement[];
    return Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
  };

  const handleOverlayMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = event.target;
  };

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === mouseDownTarget.current) {
      onClose();
    }
  };

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div
        className="absolute inset-0 bg-black/70"
        onMouseDown={handleOverlayMouseDown}
        onMouseUp={handleOverlayClick}
      />
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[720px] outline-none"
        tabIndex={-1}
        role="document"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
