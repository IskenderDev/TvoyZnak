import { twMerge } from "tailwind-merge";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      className={twMerge(
        "inline-block animate-spin rounded-full border-blue-500 border-t-transparent",
        sizes[size],
        className,
      )}
      aria-hidden
    />
  );
}
