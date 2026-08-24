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
    <section className={`relative overflow-hidden px-5 py-24 md:px-8 md:py-32 ${dark ? "bg-[#15383a] text-white" : "bg-[#f8f2e9]"} ${className}`}>
      {dark ? <div className="absolute -right-40 top-1/2 size-[34rem] -translate-y-1/2 rounded-full border border-[#e6bc97]/10" /> : null}
      <div className="relative mx-auto max-w-7xl">
        <div className={`${center ? "mx-auto mb-14 max-w-4xl text-center" : "mb-14 grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end"}`}>
          <div>
            {eyebrow ? <p className={`text-[10px] font-bold uppercase tracking-[.26em] ${dark ? "text-[#e5bc98]" : "text-terracotta"}`}>{eyebrow}</p> : null}
            <h2 className={`mt-4 text-balance font-serif text-5xl leading-[1.03] md:text-6xl ${dark ? "text-ivory" : "text-navy"}`}>{title}</h2>
          </div>
          {lead ? <p className={`max-w-xl text-pretty text-base leading-8 ${center ? "mx-auto mt-5" : "lg:justify-self-end"} ${dark ? "text-white/60" : "text-warm-gray"}`}>{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
