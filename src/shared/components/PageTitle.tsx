import type { PropsWithChildren } from "react";

type PageTitleProps = PropsWithChildren<{ className?: string }>;

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={`mb-4 text-2xl font-semibold ${className ?? ""}`.trim()}>{children}</h1>
  );
}
