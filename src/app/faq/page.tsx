import { EditorialHero, FinalInvitation } from "@/components/Editorial";
import { metadataFor } from "@/components/PatientEditorialPage";
import { lingDisclaimer } from "@/lib/content";

export const metadata = metadataFor(
  "FAQ",
  "Clear answers about MMS, health screening, Ling, suitability and professional review.",
);

const faqs = [
  ["What is MMS?", "A private preventive healthcare and personalised longevity institution focused on earlier understanding, doctor review and continuity."],
  ["Should I start with treatment?", "No. The recommended first step is to understand your health through screening and professional review."],
  ["Does Ling replace a doctor?", lingDisclaimer],
  ["Are outcomes promised?", "No. Programmes are subject to doctor assessment. Suitable candidates only. Individual outcomes vary."],
  ["Can MMS support regional care?", "MMS can help frame regional access questions and coordination. Suitability and availability must be confirmed case by case."],
  ["What if I am not sure where to begin?", "Start with a discovery conversation or ask Ling to help organise your questions."],
];

export default function FaqPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="FAQ"
        title="Clear answers before you book."
        lead="A good healthcare site should reduce uncertainty before asking for commitment."
        image="/mms-about-hero.png"
        imageAlt="Calm private healthcare consultation."
        primaryLabel="Speak with MMS"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Patient briefing</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              The important answers should be easy to find.
            </h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group border-t border-gold/40 py-5">
                <summary className="cursor-pointer list-none font-serif text-2xl text-navy marker:hidden">
                  {question}
                  <span className="float-right text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl leading-7 text-warm-gray">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FinalInvitation title="Still unsure? Begin with one careful conversation." />
    </main>
  );
}
