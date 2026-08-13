import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function PatientAccessShell({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-warm-white px-4 pb-20 pt-32 md:pt-40">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-gold-light/40 bg-white shadow-premium lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="relative min-h-[360px] overflow-hidden bg-deep-green lg:min-h-[680px]">
          <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent health guide" fill priority className="object-cover object-[50%_22%]" sizes="(min-width: 1024px) 40vw, 100vw" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-green via-deep-green/88 to-transparent p-8 pt-24 text-ivory">
            <p className="font-serif text-3xl">Hello, I’m Ling.</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-ivory/80">I’ll help organise your journey. Your doctor remains responsible for every medical decision and recommendation.</p>
          </div>
        </aside>
        <section className="flex flex-col justify-center p-7 md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-5xl">{title}</h1>
          <p className="mt-4 leading-7 text-warm-gray">{lead}</p>
          <div className="mt-8">{children}</div>
          <Link href="/privacy-pdpa" className="mt-8 text-xs leading-5 text-warm-gray underline decoration-gold-light underline-offset-4">How MMS handles privacy and consent</Link>
        </section>
      </div>
    </main>
  );
}
