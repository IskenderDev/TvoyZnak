import type { PropsWithChildren, ReactNode } from "react";

interface AuthPageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: ReactNode;
}

export default function AuthPageLayout({ title, subtitle, children }: AuthPageLayoutProps) {
  return (
    <section className="py-12 text-white">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-3xl border border-white/10 bg-[#0F1624] px-6 py-10 shadow-xl sm:px-10">
        <div>
          <h1 className="text-3xl uppercase tracking-wide">{title}</h1>
          {subtitle ? <p className="mt-3 text-sm text-white/70">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
