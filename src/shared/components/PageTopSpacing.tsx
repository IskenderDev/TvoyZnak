import type { PropsWithChildren } from "react";

type PageTopSpacingProps = PropsWithChildren<{
  className?: string;
}>;

export default function PageTopSpacing({ children, className = "" }: PageTopSpacingProps) {
  return <div className={`pt-12 ${className}`.trim()}>{children}</div>;
}
