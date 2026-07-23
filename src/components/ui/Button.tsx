import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "md" | "lg";
  variant?: "primary" | "secondary";
};

export function Button({ size = "md", variant = "primary", className = "", ...props }: ButtonProps) {
  const sizeClasses = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  const variantClasses =
    variant === "primary"
      ? "bg-gradient-to-r from-berry-deep to-berry-strong text-white hover:-translate-y-0.5"
      : "border border-beige-line text-choco hover:bg-white";

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition disabled:opacity-60 ${sizeClasses} ${variantClasses} ${className}`}
    />
  );
}
