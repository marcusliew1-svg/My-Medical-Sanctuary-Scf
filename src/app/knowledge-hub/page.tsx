import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { platformModules } from "@/data/platformModules";
import { knowledgeCategories } from "@/lib/content";

export default function KnowledgeHubPage() {
  return (
    <main>
      <PageHero
        eyebrow="Knowledge Hub"
        title="Education before decisions."
        lead="MMS content helps people understand their health and prepare for better doctor conversations."
        primaryHref="/ling"
        primaryLabel="Ask Ling"
      />

      <Section
        eyebrow="Categories"
        title="A premium health library for patients and families."
        lead="Sprint 2 can expand these into article indexes, author profiles, SEO pages, and Ling-supported education flows."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {knowledgeCategories.map((category) => (
            <article key={category} className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
              <div className="mb-5 h-px w-12 bg-gold" />
              <h2 className="font-serif text-2xl text-navy">{category}</h2>
              <p className="mt-4 leading-7 text-warm-gray">
                Clear explainers, patient questions, and clinically reviewed educational content.
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Platform Education"
        title="Advanced topics need careful public education."
        lead="These pages help visitors understand the direction of MMS without turning future capability or medicine access into a sales menu."
        className="bg-warm-white"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {platformModules.map((module) => (
            <article key={module.href} className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                {module.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-navy">{module.title}</h2>
              <p className="mt-4 leading-7 text-warm-gray">{module.text}</p>
              <ButtonLink href={module.href} variant="outline" className="mt-5">
                Read More
              </ButtonLink>
            </article>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg border border-gold-light/50 bg-navy p-8 text-ivory shadow-premium md:flex-row md:items-center md:p-12">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight md:text-5xl">Not sure what to read first?</h2>
          <ButtonLink href="/ling" variant="light">Ask Ling</ButtonLink>
        </div>
      </section>
    </main>
  );
}
