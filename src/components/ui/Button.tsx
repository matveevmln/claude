import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        size === "lg" ? "px-8 py-4 text-base sm:text-lg" : "px-6 py-3 text-sm sm:text-base",
        variant === "primary" &&
          "bg-gradient-to-r from-berry-deep to-berry-strong text-white shadow-[0_10px_26px_-8px_rgba(161,44,80,0.55)] hover:shadow-[0_14px_32px_-6px_rgba(161,44,80,0.65)] hover:-translate-y-0.5 active:translate-y-0",
        variant === "secondary" &&
          "bg-choco text-cream hover:bg-choco-soft hover:-translate-y-0.5 active:translate-y-0",
        variant === "ghost" &&
          "border border-beige-line text-choco hover:bg-white/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
