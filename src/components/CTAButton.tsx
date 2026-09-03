import Link from "next/link";
import type { ReactNode } from "react";
import { publicButtonClasses, type PublicButtonVariant } from "@/lib/publicDesign";

type CTAButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: Extract<PublicButtonVariant, "primary" | "secondary" | "outline">;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
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
  // Release 1B.2 gold shadow baseline: rgba(169,138,82,0.22).
  const classes = publicButtonClasses(variant, className);

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
