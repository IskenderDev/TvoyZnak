import type { PropsWithChildren, ReactNode } from "react";

export type EmptyStateProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export default function EmptyState({
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
      {action}
    </div>
  );
}
