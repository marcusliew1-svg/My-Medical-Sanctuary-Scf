import Link from "next/link";
import type { ReactNode } from "react";
import { publicButtonClasses, type PublicButtonVariant } from "@/lib/publicDesign";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Exclude<PublicButtonVariant, "secondary">;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  // Release 1B.2 gold shadow baseline: rgba(169,138,82,0.22).
  return (
    <Link
      href={href}
      className={publicButtonClasses(variant, className)}
    >
      {children}
    </Link>
  );
}
