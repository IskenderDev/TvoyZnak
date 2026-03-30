import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 disabled:hover:bg-blue-600",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-100 active:bg-slate-200",
} satisfies Record<string, string>;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-lg",
} satisfies Record<string, string>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
