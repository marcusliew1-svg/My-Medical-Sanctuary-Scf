import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "light" | "outline" | "dark";
  className?: string;
};

const variants = {
  primary:
    "bg-gold text-navy shadow-[0_14px_34px_rgba(212,175,55,0.24)] hover:bg-gold-light",
  light: "bg-ivory text-navy hover:bg-white",
  outline:
    "border border-gold/70 bg-transparent text-navy hover:bg-gold hover:text-navy",
  dark: "bg-navy text-ivory hover:bg-deep-green",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
