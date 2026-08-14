import Image from "next/image";
import Link from "next/link";

const miniPillars = [
  ["01", "Prevent", "See risks earlier"],
  ["02", "Personalise", "Plan around the individual"],
  ["03", "Coordinate", "One connected journey"],
  ["04", "Evolve", "Bring in future capability"],
];

export function MMSStoryGrid() {
  return (
    <section className="bg-warm-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-deep-green p-8 text-ivory shadow-premium md:p-10">
            <div className="absolute -right-24 -top-24 size-72 rounded-full border border-white/10" />
            <div className="absolute -right-8 -top-8 size-48 rounded-full border border-white/10" />
            <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Why MMS exists</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight md:text-5xl">Health should feel connected, not fragmented.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-ivory/72">Screening, doctors, longevity, records, follow-up and cross-border care should work as one experience.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {miniPillars.map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3"><span className="font-serif text-2xl text-gold-light">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-ivory/62">{text}</p></div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/health-discovery" className="group relative min-h-[330px] overflow-hidden rounded-[2rem] shadow-soft">
              <Image src="/mms-health-screening-hero.png" alt="Preventive health discovery" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width:1024px) 28vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Health Discovery</p>
                <h3 className="mt-2 font-serif text-3xl">Know more, earlier.</h3>
              </div>
            </Link>

            <Link href="/ling" className="group relative min-h-[330px] overflow-hidden rounded-[2rem] bg-navy shadow-soft">
              <Image src="/ling-mms-guide.png" alt="Ling" fill className="object-cover object-[50%_18%] transition duration-700 group-hover:scale-105" sizes="(min-width:1024px) 28vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-light">Ling</p>
                <h3 className="mt-2 font-serif text-3xl">Intelligence with a human handoff.</h3>
              </div>
            </Link>

            <Link href="/medical-tourism" className="group relative overflow-hidden rounded-[2rem] bg-ivory p-7 shadow-soft sm:col-span-2">
              <div className="grid items-center gap-6 md:grid-cols-[.8fr_1.2fr]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-deep-green">Malaysia ↔ Thailand</p>
                  <h3 className="mt-3 font-serif text-3xl text-navy md:text-4xl">Cross-border care, without losing continuity.</h3>
                  <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-warm-gray">
                    <span className="rounded-full border border-deep-green/20 bg-white px-3 py-2">Clinic matching</span>
                    <span>→</span>
                    <span className="rounded-full border border-deep-green/20 bg-white px-3 py-2">Care coordination</span>
                    <span>→</span>
                    <span className="rounded-full border border-deep-green/20 bg-white px-3 py-2">Follow-up</span>
                  </div>
                </div>
                <div className="relative h-52 overflow-hidden rounded-[1.5rem] md:h-64">
                  <Image src="/mms-membership-journey.webp" alt="MMS coordinated care journey" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width:768px) 42vw, 100vw" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
