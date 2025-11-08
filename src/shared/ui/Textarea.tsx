import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const baseStyles =
  "w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, error, ...props }, ref) => {
    const textareaId = id ?? (label ? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label className="flex w-full flex-col gap-2" htmlFor={textareaId}>
        {label ? <span className="text-sm font-medium text-slate-600">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          className={twMerge(baseStyles, error ? "border-red-400 focus-visible:ring-red-400" : "", className)}
          {...props}
        />
        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
