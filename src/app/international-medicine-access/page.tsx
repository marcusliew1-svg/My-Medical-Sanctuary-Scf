import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EditorialHero, FinalInvitation, ImagePanel, JourneyLine, SplitStory } from "@/components/Editorial";
import { medicineAccessFactors } from "@/data/platformModules";

export const metadata: Metadata = {
  title: "International Medicine Access Intelligence | My Medical Sanctuary",
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
    signal: "Very high patient cost signal",
    reason: "Insurance design, brand pricing, distribution and pharmacy benefit structures can strongly affect final patient cost.",
  },
  {
    market: "Gulf / Arab markets",
    signal: "Premium private access signal",
    reason: "Private-pay pathways, import structures and availability timing can vary widely by country and product.",
  },
  {
    market: "Australia",
    signal: "Subsidy-dependent signal",
    reason: "Public subsidy status, private prescription rules and registration determine whether the same medicine is affordable or costly.",
  },
  {
    market: "Singapore",
    signal: "High private cost signal",
    reason: "Specialist care, private pharmacy pricing and supply availability can create a premium access environment.",
  },
  {
    market: "Indonesia",
    signal: "Variable access signal",
    reason: "Registration, city-level availability, local distribution and private access pathways can differ substantially.",
  },
  {
    market: "Malaysia / Thailand",
    signal: "Potential value corridor",
    reason: "Selected medicines or pathways may be more accessible, but only after regulatory, prescription and licensed-provider review.",
  },
];

export default function InternationalMedicineAccessPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Medicine Access Intelligence"
        title="Different countries. Different systems. Better questions first."
        lead="MMS helps patients and families understand why medicine access, availability and cost can vary before any professional or licensed-party next step."
        image="/mms-medicine-access-consult.png"
        imageAlt="Private consultation discussing international healthcare access."
        primaryLabel="Request discussion"
        primaryHref="/contact"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
        imagePosition="62% center"
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
            <p className="editorial-kicker mb-4 text-gold-light">Price difference strategy</p>
            <h2 className="text-balance font-serif text-4xl leading-tight md:text-6xl">
              The same active ingredient can sit behind very different patient bills.
            </h2>
            <p className="mt-6 text-lg leading-8 text-ivory/72">
              MMS can turn this into a qualified revenue stream by helping patients compare access
              intelligently: country rules, registration, prescription requirements, supply route,
              continuity and verified quotations before licensed coordination.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-gold-light/25 bg-ivory/10 p-5 text-sm leading-7 text-ivory/70">
              Public example: a patient asks why a medicine is costly in the US, Gulf, Australia,
              Singapore or Indonesia, and whether Malaysia or Thailand may offer a lawful,
              professionally reviewed pathway. MMS sells the verified intelligence and coordination,
              not an online medicine promise.
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
            <p className="editorial-kicker mb-4 text-deep-green">Commercial pathway</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              From curiosity to a paid, verified access discussion.
            </h2>
            <div className="mt-8 grid gap-5 border-y border-gold/40 py-6">
              {[
                "Free education: public pages explain why country-level price differences happen.",
                "Qualified enquiry: patient names the active ingredient, country concern and desired access question.",
                "Paid access intelligence: MMS prepares a verified discussion pathway with country, registration and continuity factors.",
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
