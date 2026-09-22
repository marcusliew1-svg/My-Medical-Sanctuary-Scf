import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EditorialHero, FinalInvitation, ImagePanel, JourneyLine, SplitStory } from "@/components/Editorial";
import { medicineAccessFactors } from "@/data/platformModules";

export const metadata: Metadata = {
  title: "International Medicine Access Intelligence",
  description:
    "Understand why medicine availability and costs can differ between countries, with MMS positioned as an education and coordination layer.",
};

const pathway = [
  {
    title: "Question",
    text: "Clarify what the patient is trying to understand before collecting sensitive medical detail.",
  },
  {
    title: "Context",
    text: "Consider country, regulatory, prescription and continuity requirements.",
  },
  {
    title: "Boundary",
    text: "Keep diagnosis, prescribing, dispensing and dosage decisions with licensed professionals.",
  },
  {
    title: "Coordinate",
    text: "Where suitable, route the discussion toward appropriate professional or licensed-party review.",
  },
  {
    title: "Follow",
    text: "Keep continuity visible so access questions do not become isolated transactions.",
  },
];

const comparisonMarkets = [
  {
    market: "United States",
    signal: "Insurance & access complexity",
    reason: "Coverage design, formulary rules, pharmacy benefit structures and prescribing pathways can affect patient access.",
  },
  {
    market: "Gulf markets",
    signal: "Jurisdiction-specific access",
    reason: "Registration, import arrangements, private-pay pathways and local prescribing requirements can vary by country.",
  },
  {
    market: "Australia",
    signal: "Registration & subsidy context",
    reason: "Public subsidy status, private prescribing and registration influence how medicines are accessed.",
  },
  {
    market: "Singapore",
    signal: "Specialist & private access",
    reason: "Specialist pathways, registration and private dispensing structures shape access and continuity.",
  },
  {
    market: "Indonesia",
    signal: "Distribution variability",
    reason: "Registration, local distribution, city-level availability and licensed-provider pathways may differ substantially.",
  },
  {
    market: "Malaysia / Thailand",
    signal: "Regional licensed pathways",
    reason: "Selected medicines or services may be available through local licensed pathways, subject to registration, prescribing and continuity review.",
  },
];

export default function InternationalMedicineAccessPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Medicine Access Intelligence"
        title="Different countries. Different systems. Better questions first."
        lead="MMS helps patients and families understand why medicine access, availability and cost can vary before any professional or licensed-party next step."
        image="/ling-regional.png"
        imageAlt="Ling, the MMS virtual health spokesperson, explaining international medicine access questions."
        primaryLabel="Request discussion"
        primaryHref="/contact"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="70% center"
        spokespersonName="Ling"
        spokespersonMessage="I’ll help you understand why access and cost differ across countries, what questions to ask and where licensed professional review begins."
      />

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">Why it matters</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              The same medicine can sit inside very different systems.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Availability, timing and cost may differ because healthcare systems, registration
              pathways and supply structures are not identical across markets.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {medicineAccessFactors.map((factor) => (
              <article key={factor} className="border-t border-gold/40 pt-5">
                <h2 className="font-serif text-2xl leading-tight text-navy">{factor}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="editorial-kicker mb-4 text-gold-light">Access context</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              The same medicine can sit inside very different regulatory and care systems.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ivory/72">
              MMS helps patients understand access more intelligently by considering country rules, registration,
              prescription requirements, licensed providers, supply pathways and continuity before any next step.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-gold-light/25 bg-ivory/10 p-5 text-sm leading-7 text-ivory/70">
              A patient may ask why access differs between countries or whether another jurisdiction offers a lawful,
              professionally reviewed pathway. MMS helps frame that question without turning the website into a medicine marketplace.
            </div>
          </div>
          <div className="grid gap-3">
            {comparisonMarkets.map((item) => (
              <article
                key={item.market}
                className="grid gap-3 rounded-[1.5rem] border border-gold-light/20 bg-ivory px-5 py-5 text-charcoal shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-white md:grid-cols-[0.8fr_0.72fr_1.48fr]"
              >
                <h3 className="font-serif text-2xl text-navy">{item.market}</h3>
                <p className="text-sm font-semibold text-deep-green">{item.signal}</p>
                <p className="text-sm leading-6 text-warm-gray">{item.reason}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ImagePanel
            src="/mms-medicine-access-consult.png"
            alt="Doctor reviewing verified medicine access information."
            className="min-h-[460px] rounded-[1.5rem] shadow-premium"
            objectPosition="50% center"
          />
          <div>
            <p className="editorial-kicker mb-4 text-deep-green">A responsible pathway</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              From a question to a properly reviewed access discussion.
            </h2>
            <div className="mt-8 grid gap-5 border-y border-gold/40 py-6">
              {[
                "Free education: public pages explain why country-level price differences happen.",
                "Focused enquiry: the patient identifies the medicine, country concern and access question.",
                "Verified access discussion: MMS helps organise country, registration and continuity factors before licensed review.",
                "Licensed next step: any prescription, dispensing, dosage, quotation or supply conversation stays with appropriate licensed parties.",
              ].map((item) => (
                <p key={item} className="leading-7 text-warm-gray">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SplitStory
        eyebrow="MMS role"
        title="A coordination and education layer, not a public medicine shop."
        lead="The public website should help people frame better questions while respecting medical, pharmacy and jurisdictional requirements."
        image="/mms-medicine-access-consult.png"
        imageAlt="Doctor reviewing health information before appropriate next steps."
        dark
        reverse
      >
        <JourneyLine dark compact steps={pathway} />
      </SplitStory>

      <section className="bg-warm-white px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="editorial-kicker mb-4 text-deep-green">Important boundary</p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
            Access discussions require professional and jurisdictional review.
          </h2>
          <div className="mt-10">
            <DisclaimerBox title="Medicine access boundary">
              <p>
                Information on this page is educational and coordination-focused. MMS does not
                provide diagnosis, prescribing, dosage recommendations, dispensing services or
                promises of medicine availability through this website.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>

      <FinalInvitation
        title="Start with a clear access question."
        lead="MMS can help route the discussion before any professional or licensed-party next step."
      />
    </main>
  );
}
