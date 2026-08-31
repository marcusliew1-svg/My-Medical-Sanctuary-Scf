import type { Metadata } from "next";
import {
  CTASection,
  EditorialSplit,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
  TrustBar,
} from "@/components/PublicExperience";
import { medicineAccessFactors } from "@/data/platformModules";

export const metadata: Metadata = {
  title: "International Medicine Access Intelligence",
  description:
    "Understand why medicine access, availability and patient cost can differ between countries, with MMS positioned as an educational and coordination layer.",
};

const markets = [
  ["United States", "High patient-cost signal", "Insurance design, brand pricing and distribution structures can strongly affect the final bill."],
  ["Gulf / Arab markets", "Premium private-access signal", "Private-pay pathways, import structures and country-specific availability can vary widely."],
  ["Australia", "Subsidy-dependent signal", "Public subsidy status and private prescription pathways can create very different patient costs."],
  ["Singapore", "High private-cost signal", "Private specialist care, pharmacy pricing and supply availability can create a premium environment."],
  ["Indonesia", "Variable access signal", "Registration, local distribution and city-level supply can differ substantially."],
  ["Malaysia / Thailand", "Potential value corridor", "Some pathways may be more accessible, subject to lawful, licensed and professionally reviewed care."],
];

const pathway = [
  { title: "Question", text: "Clarify the medicine, country and patient concern without collecting unnecessary private data." },
  { title: "Compare", text: "Understand registration, availability, active ingredient, formulation and supply factors." },
  { title: "Review", text: "Move patient-specific issues into professional and licensed-party review." },
  { title: "Coordinate", text: "Keep continuity visible so the access question does not become an isolated transaction." },
];

export default function InternationalMedicineAccessPage() {
  return (
    <main>
      <PublicHero
        eyebrow="Medicine Intelligence"
        title="The same medicine can live inside very different systems."
        brandLine="Understand cost, access and rules before taking the next step."
        lead="MMS helps patients frame international medicine-access questions responsibly before any personalised review, prescription, dispensing or licensed coordination."
        image="/mms-medicine-access-consult.png"
        imageAlt="Private consultation discussing international healthcare access."
        primaryLabel="Request Discussion"
        primaryHref="/contact"
        secondaryLabel="Health Intelligence"
        secondaryHref="/health-intelligence"
        imagePosition="62% center"
      />

      <TrustBar
        items={[
          { title: "No price engine yet", text: "Release 1B does not fabricate live prices." },
          { title: "No medicine shop", text: "MMS does not sell medicines through this page." },
          { title: "Licensed review", text: "Prescribing and dispensing stay with appropriate professionals." },
          { title: "Generic questions", text: "Active ingredient and formulation matter." },
          { title: "Country rules", text: "Registration and supply differ by market." },
          { title: "Future private layer", text: "Patient-specific review belongs in My Sanctuary." },
        ]}
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeading
            eyebrow="Global comparison"
            title="Patients already feel the price difference. MMS can make the question safer."
            lead="The future commercial value is a verified access-intelligence discussion, not a public promise that any medicine is available or cheaper."
          />
          <div className="grid gap-5">
            {markets.map(([market, signal, reason]) => (
              <article key={market} className="grid gap-3 border-t border-gold/35 pt-5 md:grid-cols-[0.65fr_0.65fr_1.3fr]">
                <h3 className="font-serif text-3xl leading-tight text-navy">{market}</h3>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-deep-green">{signal}</p>
                <p className="text-sm leading-6 text-warm-gray">{reason}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EditorialSplit
        eyebrow="What MMS can explain"
        title="Price is only one part of the access question."
        lead="A responsible review considers country registration, licensed dispensing, prescription requirements, manufacturer supply, continuity and follow-up."
        image="/mms-medicine-intelligence.webp"
        imageAlt="Medicine intelligence and access visual."
        dark
        reverse
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {medicineAccessFactors.map((factor) => (
            <p key={factor} className="border-t border-champagne/35 pt-4 text-sm leading-6 text-ivory/72">{factor}</p>
          ))}
        </div>
      </EditorialSplit>

      <section className="bg-warm-white px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Future paid workflow"
            title="From curiosity to verified access discussion."
            lead="Public education can create qualified demand. The paid layer later should verify the medicine question, jurisdictional context and appropriate next professional step."
          />
          <div className="mt-12">
            <JourneyStepRail steps={pathway} />
          </div>
        </div>
      </section>

      <CTASection title="Start with a clear access question." lead="MMS can help you frame the discussion before any professional or licensed-party next step." />
    </main>
  );
}
