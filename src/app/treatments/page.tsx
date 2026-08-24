import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { DisclaimerBox } from "@/components/DisclaimerBox";

export const metadata: Metadata = {
  title: "Treatments & Wellness Pathways",
  description: "Explore MMS screening, wellness, recovery and advanced-care pathways with clear suitability and medical boundaries.",
};

const pathways = [
  {
    number: "01",
    title: "Screening & Assessment",
    line: "Understand before deciding.",
    image: "/mms-health-screening-hero.png",
    items: [
      ["Health Screening & Ultrasound", "health-screening-ultrasound"],
      ["ECG & Cardiovascular Review", "ecg-cardiovascular-risk-review"],
      ["MCED / Multi-Cancer Detection", "mced"],
    ],
  },
  {
    number: "02",
    title: "Cellular Wellness",
    line: "Support energy and cellular health.",
    image: "/mms-medicine-intelligence.webp",
    items: [
      ["IV Wellness", "iv-wellness-antioxidant-support"],
      ["NAD+", "nad-plus"],
      ["Red-Light / Photobiomodulation", "red-light-photobiomodulation"],
    ],
  },
  {
    number: "03",
    title: "Metabolic & Hormonal",
    line: "Work on the systems that shape vitality.",
    image: "/mms-service-collage.webp",
    items: [
      ["Weight & Metabolic Health", "medical-weight-management"],
      ["Hormone Review", "hormone-therapy"],
      ["Peptides", "peptides"],
    ],
  },
  {
    number: "04",
    title: "Recovery & Performance",
    line: "Recover better. Function better.",
    image: "/mms-membership-journey.webp",
    items: [
      ["Hyperbaric Oxygen", "hyperbaric-oxygen"],
      ["Gut & Microbiome Support", "gut-health-microbiome-support"],
      ["Colon Cleansing", "colon-cleansing"],
    ],
  },
  {
    number: "05",
    title: "Regenerative Support",
    line: "Selected options, reviewed individually.",
    image: "/mms-about-hero.png",
    items: [
      ["PRP", "prp"],
      ["PRGF", "prgf"],
      ["Exosome-Related Services", "exosome-services"],
    ],
  },
  {
    number: "06",
    title: "Advanced & Specialist",
    line: "Education first. Regulation always matters.",
    image: "/mms-medicine-intelligence.webp",
    items: [
      ["MSC / Stem-Cell Pathways", "msc-stem-cell-pathways"],
      ["NK-Cell Therapy", "nk-cell-therapy"],
      ["CAR-T", "car-t"],
    ],
  },
];

export default function TreatmentsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[82vh] overflow-hidden bg-[#0d2d33] px-4 pb-16 pt-32 text-ivory md:pt-40">
        <Image src="/mms-service-collage.webp" alt="" fill priority className="-z-30 object-cover opacity-52" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(9,31,36,.98),rgba(9,31,36,.88)_47%,rgba(9,31,36,.28))]" />
        <div className="mms-kinetic-ring -right-24 top-28 -z-10 size-[34rem]" />
        <div className="mms-kinetic-ring right-14 top-48 -z-10 size-[21rem]" />
        <div className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-12 lg:grid-cols-[.92fr_1.08fr]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e1b98f]">Treatment discovery</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Explore first.<span className="block text-[#e6c29f]">Decide later.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/64">Browse the possibilities. A qualified professional decides what is appropriate for you.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="/health-discovery">Start with discovery</CTAButton><CTAButton href="/ling" variant="outline">Ask Ling</CTAButton></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Screen","Understand","Discuss","Review"].map((item,index)=><div key={item} className={`mms-shimmer min-h-[170px] rounded-[1.7rem] border p-5 ${index===3?"border-[#dfb78f]/40 bg-[#e5c29e] text-navy":"border-white/10 bg-white/[.055]"}`}><span className={`text-[10px] font-bold ${index===3?"text-[#7b4f35]":"text-[#dfb78f]"}`}>0{index+1}</span><p className="mt-10 font-serif text-3xl">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#efe5d8] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">Browse by pathway</p><h2 className="mt-4 font-serif text-5xl leading-tight text-navy md:text-6xl">Six doors into the MMS experience.</h2></div>
            <p className="max-w-xl text-base leading-8 text-warm-gray lg:justify-self-end">The detailed medical explanation lives inside each guide. This page is for orientation, not self-prescribing.</p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {pathways.map((pathway,index)=><article key={pathway.title} className="group overflow-hidden rounded-[2.2rem] border border-[#d6c3b1] bg-white shadow-[0_26px_70px_rgba(36,44,43,.08)]">
              <div className="relative min-h-[300px] overflow-hidden">
                <Image src={pathway.image} alt="" fill className="object-cover transition duration-1000 group-hover:scale-[1.035]" sizes="(min-width:1024px) 50vw,100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102f36]/92 via-[#102f36]/28 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-5 text-ivory">
                  <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#dfb78f]">{pathway.number}</p><h3 className="mt-2 font-serif text-4xl">{pathway.title}</h3><p className="mt-2 text-sm text-ivory/62">{pathway.line}</p></div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[.07] text-xl">↗</span>
                </div>
              </div>
              <div className="grid gap-px bg-[#e0d5ca] sm:grid-cols-3">
                {pathway.items.map(([name,slug])=><Link key={slug} href={`/treatments/${slug}`} className="group/link bg-[#faf6f0] p-5 transition hover:bg-[#f1e6da]"><p className="font-serif text-xl leading-snug text-navy">{name}</p><p className="mt-3 text-[9px] font-bold uppercase tracking-[.16em] text-terracotta transition group-hover/link:translate-x-1">Open guide →</p></Link>)}
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#15383f] px-4 py-24 text-ivory md:py-28">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(224,183,141,.12),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-9 lg:grid-cols-[1fr_.7fr] lg:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#dfb78f]">The rule</p><h2 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Advanced does not automatically mean better.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-ivory/62">The right option depends on evidence, regulation, goals, risks and professional assessment.</p></div>
          <div className="grid grid-cols-2 gap-3 lg:justify-self-end"><div className="rounded-[1.6rem] border border-white/10 bg-white/[.05] p-5"><span className="text-[9px] font-bold text-[#dfb78f]">01</span><p className="mt-5 font-serif text-2xl">Suitability</p></div><div className="rounded-[1.6rem] border border-[#dcb58d]/30 bg-[#e3bd98] p-5 text-navy"><span className="text-[9px] font-bold text-[#7d5034]">02</span><p className="mt-5 font-serif text-2xl">Medical review</p></div></div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-4 py-10"><div className="mx-auto max-w-5xl"><DisclaimerBox><p>Educational information only. Treatment availability, legality and suitability vary by location, product, indication and individual clinical assessment.</p></DisclaimerBox></div></section>
    </main>
  );
}
