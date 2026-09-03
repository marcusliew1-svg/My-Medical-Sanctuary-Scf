import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-gold text-navy shadow-[0_14px_34px_rgba(169,138,82,0.22)] hover:bg-gold-light",
  secondary: "bg-navy text-ivory shadow-soft hover:bg-deep-green",
  outline:
    "border border-gold/80 bg-transparent text-gold hover:bg-gold hover:text-navy",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: CTAButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
    >
      {children}
    </button>
  );
}
