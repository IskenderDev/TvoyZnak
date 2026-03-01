import type { PropsWithChildren } from "react";

type PageTopSpacingProps = PropsWithChildren<{
  className?: string;
}>;

export default function PageTopSpacing({ children, className = "" }: PageTopSpacingProps) {
  return <div className={`pt-[var(--page-content-offset)] ${className}`.trim()}>{children}</div>;
}
