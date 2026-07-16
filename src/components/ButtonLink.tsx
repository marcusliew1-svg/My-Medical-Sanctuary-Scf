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
    "bg-teal-700 text-white shadow-[0_16px_34px_rgba(13,117,109,0.22)] hover:bg-teal-800",
  light: "bg-white text-stone-950 hover:bg-teal-50",
  outline:
    "border border-stone-950/20 bg-transparent text-stone-950 hover:border-teal-700 hover:text-teal-800",
  dark: "bg-stone-950 text-white hover:bg-stone-800",
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
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
