import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton } from "@/components/CTAButton";
import { HealthGoalExplorer } from "@/components/HealthGoalExplorer";
import { LingResearchGuide } from "@/components/LingResearchGuide";
import { treatmentEducation } from "@/data/treatmentEducation";
import { treatmentEducationExtra } from "@/data/treatmentEducationExtra";

const indexMedicalEducation = (process.env.MMS_MEDICAL_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allTreatmentEducation = [...treatmentEducation, ...treatmentEducationExtra];

export const metadata: Metadata = {
  title: "Treatment Research Library",
  description: "Plain-English MMS treatment guides covering evidence, safety questions and the role of qualified medical review.",
  robots: { index: indexMedicalEducation, follow: indexMedicalEducation },
};

const evidenceTone: Record<string, string> = {
  "Established / indication-specific": "bg-[#dfe9e3] text-deep-green",
  "Evidence varies by indication": "bg-[#efe8de] text-navy",
  "Emerging / tightly regulated": "bg-navy text-ivory",
  "Assessment / screening": "bg-white text-deep-green",
};

const systemFamilies = [
  ["Discovery & heart", "Screening · ECG · risk"],
  ["Metabolic & hormones", "Weight · glucose · hormones"],
  ["Gut & nutrition", "Digestive health · microbiome"],
  ["Recovery & tissue", "PRP · PRGF · red light · HBOT"],
  ["Cellular science", "NAD+ · MSC · exosomes"],
  ["Immune & oncology", "NK · MCED · CAR-T"],
];

export default function TreatmentResearchPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#062e29] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_22%,rgba(112,165,142,.24),transparent_30%),radial-gradient(circle_at_18%_80%,rgba(196,174,133,.12),transparent_34%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 py-16 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d7c9a7]">MMS treatment research library</p>
            <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[1.03] md:text-7xl">Understand the science before you discuss the service.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">Plain-English guides for screening, wellness, recovery and advanced-care topics that may come up during an MMS membership journey.</p>
            <div className="mt-8 flex flex-wrap gap-3"><CTAButton href="/treatments">View all MMS pathways</CTAButton><CTAButton href="/health-concerns" variant="outline">Research by health concern</CTAButton></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"><p className="font-serif text-4xl text-[#d7c9a7]">{allTreatmentEducation.length}</p><p className="mt-1 text-sm text-ivory/65">plain-English guides</p></div>
            <div className="rounded-[1.5rem] border border-white/10 bg-ivory p-5 text-navy"><p className="font-serif text-4xl text-deep-green">4</p><p className="mt-1 text-sm text-warm-gray">evidence categories</p></div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {systemFamilies.map(([title, text], index) => (
              <div key={title} className="rounded-[1.4rem] border border-stone-200 bg-white p-4 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">0{index + 1}</span>
                <p className="mt-2 font-serif text-xl leading-tight text-navy">{title}</p>
                <p className="mt-2 text-[11px] leading-5 text-warm-gray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HealthGoalExplorer />
      <LingResearchGuide />

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Full guide library</p>
            <h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Or browse by treatment name.</h2>
          </div>
          <div className="flex max-w-2xl flex-wrap gap-2">{Object.keys(evidenceTone).map(label=><span key={label} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${evidenceTone[label]}`}>{label}</span>)}</div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{allTreatmentEducation.map((item,index)=><Link key={item.slug} href={`/treatments/${item.slug}`} className="group rounded-[1.7rem] border border-stone-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-[#95ad9f]"><div className="flex items-start justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">Guide {String(index+1).padStart(2,"0")}</span><span className="text-deep-green transition group-hover:translate-x-1">→</span></div><p className="mt-4 text-xs font-bold uppercase tracking-[.13em] text-warm-gray">{item.eyebrow}</p><h2 className="mt-2 font-serif text-3xl text-navy">{item.name}</h2><p className="mt-3 text-sm leading-6 text-warm-gray">{item.summary}</p><span className={`mt-5 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold ${evidenceTone[item.evidence]}`}>{item.evidence}</span></Link>)}</div>
      </div></section>

      <section className="bg-[#07372f] px-4 py-20 text-ivory"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">Use the library properly</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Research creates better questions—not automatic treatment choices.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-ivory/70">Availability, medical suitability, product status and evidence can change. A qualified healthcare professional must review the individual patient and the exact product, device or procedure.</p></div></section>
    </main>
  );
}
