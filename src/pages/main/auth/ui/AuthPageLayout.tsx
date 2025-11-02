import { LuX } from "react-icons/lu";
import type { PropsWithChildren, ReactNode } from "react";

interface AuthPageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: ReactNode;
  onClose?: () => void;
  titleId?: string;
}

export default function AuthPageLayout({
  title,
  subtitle,
  onClose,
  titleId,
  children,
}: AuthPageLayoutProps) {
  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-[#0F1624] px-6 pb-10 pt-12 text-white shadow-xl sm:px-10">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-white/60 transition hover:text-white"
          aria-label="Закрыть окно"
        >
          <LuX className="h-5 w-5" />
        </button>
      ) : null}

      <div className="mb-8 pr-8">
        <h1 id={titleId} className="text-3xl font-actay-wide uppercase tracking-wide">
          {title}
        </h1>
        {subtitle ? <p className="mt-3 text-sm text-white/70">{subtitle}</p> : null}
      </div>

      {children}
    </div>
  );
}
