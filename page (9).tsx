import { ConversionPanel } from "@/components/ConversionPanel";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { lingDisclaimer } from "@/lib/content";

const faqs = [
  ["What is MMS?", "A premium preventive healthcare, longevity and wellness institution focused on early detection and personalised health optimisation."],
  ["Should I start with treatment?", "No. The recommended first step is to understand your health through screening and doctor review."],
  ["Does Ling replace a doctor?", lingDisclaimer],
  ["Are outcomes promised?", "No. Programmes are subject to doctor assessment. Suitable candidates only. Individual outcomes vary."],
  ["Can companies work with MMS?", "Yes. Corporate wellness programmes can be discussed through the contact and booking flow."],
];

export default function FaqPage() {
  return (
    <main>
      <PageHero
        eyebrow="FAQ"
        title="Clear answers before you book."
        lead="MMS should reduce uncertainty and help visitors understand the most appropriate next step."
      />
      <Section eyebrow="Questions" title="Frequently asked questions.">
        <div className="grid gap-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-lg border border-stone-200 bg-white p-6">
              <summary className="cursor-pointer text-lg font-semibold">{question}</summary>
              <p className="mt-4 leading-7 text-stone-600">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
      <ConversionPanel title="Still unsure where to start?" />
    </main>
  );
}
