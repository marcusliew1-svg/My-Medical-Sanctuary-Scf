import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { knowledgeCategories } from "@/lib/content";

export default function HealthArticlesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Health Articles / Blog"
        title="The education hub for preventive health and longevity."
        lead="MMS articles should support SEO, patient education, AI knowledge flows, and better doctor conversations."
      />
      <Section
        eyebrow="Categories"
        title="Content pillars for future SEO and AI."
        lead="Each category can become a scalable CMS collection with medical review status, author profile, and structured data."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {knowledgeCategories.map((category) => (
            <article key={category} className="rounded-lg border border-stone-200 bg-white p-7">
              <h2 className="text-xl font-semibold">{category}</h2>
              <p className="mt-4 leading-7 text-stone-600">Educational articles, FAQs, and guide pages.</p>
            </article>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Not sure what to read first?" text="Ask Ling or book a screening consultation to understand which health topic matters most for you." />
    </main>
  );
}
