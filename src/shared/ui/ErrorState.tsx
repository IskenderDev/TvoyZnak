import type { ReactNode } from "react";

import Button from "./Button";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  extra?: ReactNode;
};

export default function ErrorState({
  title = "Что-то пошло не так",
  description = "Попробуйте обновить страницу или повторить попытку позже.",
  actionLabel = "Повторить",
  onRetry,
  extra,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-100 bg-red-50 p-10 text-center shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-600">{title}</h3>
        <p className="max-w-md text-sm text-red-500">{description}</p>
      </div>
      {extra}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
