import { ButtonLink } from "@/components/ButtonLink";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  primaryHref = "/book-appointment",
  primaryLabel = "Book Appointment",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#102f36] px-4 pb-16 pt-32 text-ivory md:pb-20 md:pt-40">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_28%,rgba(226,185,143,.15),transparent_27%),radial-gradient(circle_at_20%_80%,rgba(95,143,128,.14),transparent_34%)]" />
      <div className="mms-kinetic-ring -right-28 top-16 -z-10 size-[38rem]" />
      <div className="mms-kinetic-ring right-20 top-40 -z-10 size-[22rem]" />
      <div className="mx-auto grid min-h-[58vh] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.72fr]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#e4bd97]/20 bg-white/[.05] px-4 py-2 backdrop-blur-xl"><span className="size-1.5 rounded-full bg-[#e4bd97]"/><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#eac6a4]">{eyebrow}</p></div>
          <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl leading-[1.02] md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/66">{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink><ButtonLink href="/contact" variant="light">Contact MMS</ButtonLink></div>
        </div>
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
          {["Understand","Coordinate","Review","Continue"].map((item,index)=><div key={item} className={`mms-shimmer min-h-[155px] rounded-[1.7rem] border p-5 ${index===2?"border-[#dfb78f]/35 bg-[#e2bb95] text-navy":"border-white/10 bg-white/[.05]"}`}><span className={`text-[9px] font-bold ${index===2?"text-[#7c4e33]":"text-[#dfb78f]"}`}>0{index+1}</span><p className="mt-9 font-serif text-2xl">{item}</p></div>)}
        </div>
      </div>
    </section>
  );
}
