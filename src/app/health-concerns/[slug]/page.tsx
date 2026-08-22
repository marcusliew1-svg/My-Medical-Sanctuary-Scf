import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CTAButton } from "@/components/CTAButton";
import { HealthConcernExplainer } from "@/components/HealthConcernExplainer";
import { healthConcerns } from "@/data/healthConcerns";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";

const indexHealthEducation = (process.env.MMS_HEALTH_EDUCATION_INDEXABLE ?? "false").toLowerCase() === "true";
const allConcerns = [...healthConcerns, ...extraHealthConcerns, ...expandedHealthConcerns];
const concernAliases: Record<string, string> = {
  "menopause-perimenopause-symptoms": "menopause-hot-flushes-hormone-changes",
};

type HealthConcernPageProps = {
  params: Promise<{ slug: string }>;
};

function resolveConcernSlug(slug: string) {
  return concernAliases[slug] ?? slug;
}

function getConcern(slug: string) {
  return allConcerns.find((item) => item.slug === resolveConcernSlug(slug));
}

export function generateStaticParams() {
  return allConcerns.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: HealthConcernPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concern = getConcern(slug);
  if (!concern) return {};
  return {
    title: concern.searchTitle,
    description: concern.intro,
    keywords: concern.seoTerms,
    robots: { index: indexHealthEducation, follow: indexHealthEducation },
  };
}

const tone: Record<string, string> = {
  "Established clinical pathway": "bg-[#dfe9e3] text-deep-green",
  "Evidence varies / discuss": "bg-[#efe8de] text-navy",
  "Research or tightly regulated": "bg-navy text-ivory",
  "Assessment first": "bg-white text-deep-green",
};

const treatmentSlugs: Record<string, string> = {
  "IV wellness / NAD+": "nad-plus",
  "IV wellness & antioxidant support": "iv-wellness-antioxidant-support",
  "PRP": "prp",
  "PRGF": "prgf",
  "Red-light / photobiomodulation": "red-light-photobiomodulation",
  "MSC / stem-cell products": "msc-stem-cell-pathways",
  "Exosome-related services": "exosome-services",
  "Hormone review": "hormone-therapy",
  "Structured metabolic programme": "medical-weight-management",
  "GLP-1 / incretin medicines": "medical-weight-management",
  "Medical weight management": "medical-weight-management",
  "Peptides": "peptides",
  "MCED": "mced",
  "CAR-T": "car-t",
  "NK-cell therapy": "nk-cell-therapy",
  "Hyperbaric oxygen": "hyperbaric-oxygen",
  "ECG & cardiovascular risk review": "ecg-cardiovascular-risk-review",
  "Health screening": "health-screening-ultrasound",
  "Gut health & microbiome support": "gut-health-microbiome-support",
  "Colon cleansing / colonic irrigation": "colon-cleansing",
};

function topicHref(label: string, href?: string) {
  const slug = treatmentSlugs[label];
  if (slug) return `/treatments/${slug}`;
  return href;
}

export default async function HealthConcernDetailPage({ params }: HealthConcernPageProps) {
  const { slug } = await params;
  const resolvedSlug = resolveConcernSlug(slug);
  if (resolvedSlug !== slug) redirect(`/health-concerns/${resolvedSlug}`);

  const concern = getConcern(slug);
  if (!concern) notFound();

  return (
    <main>
      <section className="bg-[#062e29] px-4 pb-16 pt-28 text-ivory md:pt-36">
        <div className="mx-auto max-w-5xl">
          <Link href="/health-concerns" className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">← Health concern guides</Link>
          <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-[1.04] md:text-7xl">{concern.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/72">{concern.intro}</p>
        </div>
      </section>

      <HealthConcernExplainer concern={concern} />

      <section className="bg-warm-white px-4 py-16"><div className="mx-auto max-w-5xl"><div className="grid gap-6 lg:grid-cols-2"><article className="rounded-[1.8rem] border border-stone-200 bg-white p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-deep-green">What usually needs checking first</p><ul className="mt-5 grid gap-3">{concern.firstChecks.map(item=><li key={item} className="flex gap-3 rounded-xl bg-ivory p-4 text-sm leading-6 text-navy"><span className="font-bold text-deep-green">✓</span><span>{item}</span></li>)}</ul></article><article className="rounded-[1.8rem] border border-[#d8b9ad] bg-[#f5ece8] p-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8a5140]">Seek prompt medical attention if</p><ul className="mt-5 grid gap-3">{concern.redFlags.map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-navy"><span className="font-bold text-[#8a5140]">!</span><span>{item}</span></li>)}</ul></article></div></div></section>

      <section className="bg-ivory px-4 py-16"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">Topics you may discuss</p><h2 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Not every treatment belongs at the same evidence level.</h2><p className="mt-4 max-w-3xl leading-7 text-warm-gray">These links are intended to help you research and prepare questions. They are not a recommendation that you undergo the treatment.</p></div><div className="grid gap-5 md:grid-cols-2">{concern.relatedTopics.map(topic=>{const href=topicHref(topic.label,topic.href);return <article key={topic.label} className="rounded-[1.7rem] border border-stone-200 bg-white p-6 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><h3 className="font-serif text-2xl text-navy">{topic.label}</h3><span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${tone[topic.evidence]}`}>{topic.evidence}</span></div><p className="mt-4 text-sm leading-6 text-warm-gray">{topic.note}</p>{href?<Link href={href} className="mt-5 inline-flex text-sm font-bold text-deep-green">Read more →</Link>:null}</article>})}</div></div></section>

      <section className="bg-[#07372f] px-4 py-18 text-ivory"><div className="mx-auto max-w-5xl py-16 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#d7c9a7]">Next step</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">Turn research into a qualified discussion.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-ivory/70">Bring your symptoms, history, medications, test results and questions. MMS can help organise the discussion; a qualified professional decides what assessment or treatment is appropriate.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><CTAButton href="/ling">Ask Ling</CTAButton><CTAButton href="/health-discovery" variant="outline">Start health discovery</CTAButton></div></div></section>
    </main>
  );
}
