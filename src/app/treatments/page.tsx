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
  { number: "01", title: "Screening & Assessment", line: "Understand before deciding.", image: "/mms-health-screening-hero.png", items: [["Health Screening & Ultrasound", "health-screening-ultrasound"],["ECG & Cardiovascular Review", "ecg-cardiovascular-risk-review"],["MCED / Multi-Cancer Detection", "mced"]] },
  { number: "02", title: "Cellular Wellness", line: "Support energy and cellular health.", image: "/mms-medicine-intelligence.webp", items: [["IV Wellness", "iv-wellness-antioxidant-support"],["NAD+", "nad-plus"],["Red-Light / Photobiomodulation", "red-light-photobiomodulation"]] },
  { number: "03", title: "Metabolic & Hormonal", line: "Work on the systems that shape vitality.", image: "/mms-service-collage.webp", items: [["Weight & Metabolic Health", "medical-weight-management"],["Hormone Review", "hormone-therapy"],["Peptides", "peptides"]] },
  { number: "04", title: "Recovery & Performance", line: "Recover better. Function better.", image: "/mms-membership-journey.webp", items: [["Hyperbaric Oxygen", "hyperbaric-oxygen"],["Gut & Microbiome Support", "gut-health-microbiome-support"],["Colon Cleansing", "colon-cleansing"]] },
  { number: "05", title: "Regenerative Support", line: "Selected options, reviewed individually.", image: "/mms-about-hero.png", items: [["PRP", "prp"],["PRGF", "prgf"],["Exosome-Related Services", "exosome-services"]] },
  { number: "06", title: "Advanced & Specialist", line: "Education first. Regulation always matters.", image: "/mms-medicine-intelligence.webp", items: [["MSC / Stem-Cell Pathways", "msc-stem-cell-pathways"],["NK-Cell Therapy", "nk-cell-therapy"],["CAR-T", "car-t"]] },
];

export default function TreatmentsPage() {
  return (
    <main className="overflow-hidden bg-[#f7f1e8]">
      <section className="relative isolate min-h-[84vh] overflow-hidden bg-[#15383a] text-ivory">
        <Image src="/mms-service-collage.webp" alt="" fill priority className="-z-30 object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(20,55,57,.96),rgba(20,55,57,.78)_48%,rgba(20,55,57,.18))]" />
        <div className="mx-auto flex min-h-[84vh] max-w-7xl items-center px-5 pb-20 pt-36 md:px-8 md:pt-44">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#e9c3a0]">Treatment knowledge</p>
            <h1 className="mt-5 font-serif text-6xl leading-[.98] md:text-8xl">Understand first.<span className="block text-[#edc8a6]">Decide later.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ivory/72">Explore what different therapies are intended to do, where evidence is stronger or weaker, and what deserves professional review before any decision.</p>
            <div className="mt-9 flex flex-wrap gap-3"><CTAButton href="/health-discovery">Start with Health Discovery</CTAButton><CTAButton href="/ling" variant="outline">Ask Ling</CTAButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-terracotta">How to use this section</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] text-navy md:text-7xl">Browse by health pathway, not by hype.</h2></div>
            <p className="max-w-xl text-lg leading-8 text-warm-gray lg:justify-self-end">This is orientation and education. The detailed guides explain purpose, evidence, limitations and questions worth discussing with a qualified professional.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#eadccc]">
        {pathways.map((pathway, index) => (
          <article key={pathway.title} className="border-t border-[#c6b19d] first:border-t-0">
            <div className={`mx-auto grid max-w-[1500px] lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative min-h-[420px] lg:min-h-[560px]">
                <Image src={pathway.image} alt="" fill className="object-cover" sizes="(min-width:1024px) 50vw,100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15383a]/52 via-transparent to-transparent" />
                <span className="absolute bottom-7 left-7 text-[10px] font-bold tracking-[.2em] text-white/75">{pathway.number}</span>
              </div>
              <div className="flex items-center px-5 py-14 md:px-10 lg:px-16 lg:py-20">
                <div className="w-full max-w-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[.24em] text-terracotta">{pathway.line}</p>
                  <h2 className="mt-4 font-serif text-4xl leading-[1.05] text-navy md:text-6xl">{pathway.title}</h2>
                  <div className="mt-9 divide-y divide-[#c8b49f] border-y border-[#c8b49f]">
                    {pathway.items.map(([name, slug]) => (
                      <Link key={slug} href={`/treatments/${slug}`} className="group flex items-center justify-between gap-6 py-5">
                        <span className="font-serif text-xl text-navy md:text-2xl">{name}</span>
                        <span className="text-lg text-terracotta transition group-hover:translate-x-2">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="relative overflow-hidden bg-[#15383a] px-5 py-24 text-ivory md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[.26em] text-[#e6bd98]">The MMS rule</p><h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-7xl">Advanced does not automatically mean better.</h2></div>
          <div className="max-w-xl lg:justify-self-end"><p className="text-lg leading-8 text-ivory/68">The right option depends on evidence, regulation, your goals, possible risks and professional assessment.</p><div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/18 pt-6 text-[10px] font-semibold uppercase tracking-[.15em] text-ivory/62"><span>Evidence</span><span>Suitability</span><span>Regulation</span><span>Medical review</span></div></div>
        </div>
      </section>

      <section className="bg-[#f8f3eb] px-5 py-10 md:px-8"><div className="mx-auto max-w-5xl"><DisclaimerBox><p>Educational information only. Treatment availability, legality and suitability vary by location, product, indication and individual clinical assessment.</p></DisclaimerBox></div></section>
    </main>
  );
}
