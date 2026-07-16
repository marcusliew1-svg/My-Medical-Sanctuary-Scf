import { ButtonLink } from "@/components/ButtonLink";
import { Section } from "@/components/Section";
import { knowledgeCategories } from "@/lib/content";

export default function KnowledgeHubPage() {
  return (
    <main>
      <section className="bg-stone-950 px-4 pb-20 pt-36 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-teal-200">Knowledge Hub</p>
          <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-tight md:text-7xl">
            Education before decisions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.72]">
            MMS content should help people understand their health and prepare for better doctor
            conversations.
          </p>
        </div>
      </section>

      <Section
        eyebrow="Categories"
        title="A premium health library for patients and families."
        lead="Sprint 2 can expand these into article indexes, author profiles, SEO pages, and Ling-supported education flows."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {knowledgeCategories.map((category) => (
            <article key={category} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-xl font-semibold">{category}</h2>
              <p className="mt-4 leading-7 text-stone-600">
                Clear explainers, patient questions, and clinically reviewed educational content.
              </p>
            </article>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-lg bg-[#eef6f3] p-8 md:flex-row md:items-center md:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-5xl">Not sure what to read first?</h2>
          <ButtonLink href="/ling">Ask Ling</ButtonLink>
        </div>
      </section>
    </main>
  );
}
