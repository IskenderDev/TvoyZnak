import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

const baseStyles =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, error, wrapperClassName, ...props }, ref) => {
    const inputId = id ?? (label ? `input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label
        className={twMerge("flex w-full flex-col gap-2", wrapperClassName)}
        htmlFor={inputId}
      >
        {label ? <span className="text-sm font-medium text-slate-600">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(baseStyles, error ? "border-red-400 focus-visible:ring-red-400" : "", className)}
          {...props}
        />
        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";

export default Input;
