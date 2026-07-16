import Link from "next/link";
import type { ReactNode } from "react";

type CTAButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

const variants = {
  primary: "bg-gold text-navy hover:bg-gold-light",
  secondary: "bg-navy text-ivory hover:bg-deep-green",
  outline: "border border-gold text-gold hover:bg-gold hover:text-navy",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}: CTAButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
