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
    <section className={`relative overflow-hidden px-4 py-24 md:py-32 ${dark ? "mms-trust-grid bg-[#102f36] text-white" : "bg-[#f8f3eb]"} ${className}`}>
      {dark ? <><div className="mms-kinetic-ring -right-24 -top-24 size-72"/><div className="mms-kinetic-ring -right-2 top-6 size-44"/></> : null}
      <div className="relative mx-auto max-w-7xl">
        <div className={`mb-14 grid gap-7 ${center ? "mx-auto max-w-4xl text-center" : "lg:grid-cols-[.72fr_1.28fr] lg:items-end"}`}>
          <div>
            {eyebrow ? <p className={`text-[10px] font-bold uppercase tracking-[.24em] ${dark ? "text-[#dfb78f]" : "text-terracotta"}`}>{eyebrow}</p> : null}
            <h2 className={`mt-4 text-balance font-serif text-5xl leading-[1.04] md:text-6xl ${dark ? "text-ivory" : "text-navy"}`}>{title}</h2>
          </div>
          {lead ? <p className={`max-w-xl text-pretty text-base leading-8 ${center ? "mx-auto mt-2" : "lg:justify-self-end"} ${dark ? "text-white/58" : "text-warm-gray"}`}>{lead}</p> : <div />}
        </div>
        {children}
      </div>
    </section>
  );
}
