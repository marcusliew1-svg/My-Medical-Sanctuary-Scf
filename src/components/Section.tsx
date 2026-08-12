import type { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  dark?: boolean;
  center?: boolean;
  className?: string;
};

export function Section({
  eyebrow,
  title,
  lead,
  children,
  dark = false,
  center = false,
  className = "",
}: SectionProps) {
  return (
    <section className={`px-4 py-20 md:py-24 ${dark ? "bg-navy text-white" : ""} ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              {eyebrow}
            </p>
          ) : null}
          <h2 className={`text-balance font-serif text-4xl leading-tight md:text-5xl ${dark ? "text-ivory" : "text-navy"}`}>
            {title}
          </h2>
          {lead ? (
            <p className={`mt-5 text-pretty text-base leading-8 md:text-lg ${dark ? "text-white/70" : "text-stone-600"}`}>
              {lead}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
