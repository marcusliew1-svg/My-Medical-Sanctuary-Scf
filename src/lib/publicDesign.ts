export type PublicButtonVariant = "primary" | "secondary" | "light" | "outline" | "dark";

const buttonVariants: Record<PublicButtonVariant, string> = {
  primary:
    "border border-gold bg-gold text-navy shadow-[0_14px_34px_rgba(169,138,82,0.22)] hover:border-gold-light hover:bg-gold-light",
  secondary: "border border-navy bg-navy text-ivory shadow-soft hover:border-deep-green hover:bg-deep-green",
  light: "border border-ivory bg-ivory text-navy hover:border-white hover:bg-white",
  outline: "border border-gold/70 bg-transparent text-current hover:bg-gold hover:text-navy",
  dark: "border border-navy bg-navy text-ivory hover:border-deep-green hover:bg-deep-green",
};

export function publicButtonClasses(variant: PublicButtonVariant, className = "") {
  return [
    "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200",
    "hover:-translate-y-px focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold",
    buttonVariants[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
