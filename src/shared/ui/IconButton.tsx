import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const baseStyles =
  "inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={twMerge(baseStyles, className)}
      {...props}
    />
  ),
);

IconButton.displayName = "IconButton";

export default IconButton;
