import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { EditorialHero, ImagePanel, JourneyLine } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Contact / Discovery Form | My Medical Sanctuary",
  description:
    "Start a discovery discussion with My Medical Sanctuary for health screening, membership, wellness coordination or corporate executive wellness.",
};

const contactPath = [
  {
    title: "Share context",
    text: "Tell us what prompted the enquiry and who the discussion is for.",
  },
  {
    title: "Route carefully",
    text: "MMS can guide the enquiry toward screening, membership, Ling education or corporate wellness.",
  },
  {
    title: "Speak clearly",
    text: "A team member can contact you with a practical next step and appointment pathway.",
  },
  {
    title: "Review first",
    text: "Personalised medical decisions remain subject to professional review and suitability assessment.",
  },
  {
    title: "Continue",
    text: "If appropriate, MMS can support longer-term follow-up and coordination.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Contact MMS"
        title="Start with a private discovery discussion."
        lead="Share your context once. MMS can help you understand the right next step before any programme or recommendation is considered."
        image="/mms-concierge-lounge.png"
        imageAlt="Private doctor-led consultation at My Medical Sanctuary."
        primaryLabel="Send enquiry"
        primaryHref="#discovery-form"
        secondaryLabel="Ask Ling first"
        secondaryHref="/ling"
        imagePosition="50% center"
        trustItems={[
          { title: "Private intake", text: "A calm first discussion before recommendations." },
          { title: "Careful routing", text: "Screening, membership, corporate or education pathways." },
          { title: "Professional review", text: "Medical decisions remain doctor-led." },
          { title: "Clear follow-up", text: "MMS helps organise the next step." },
        ]}
      />

      <section id="discovery-form" className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="lg:sticky lg:top-28">
            <p className="editorial-kicker mb-4 text-deep-green">Concierge intake</p>
            <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-6xl">
              A calm first step, not a sales counter.
            </h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              The discovery form helps MMS understand whether you are looking for screening, continuity,
              education, executive wellness or a broader preventive health journey.
            </p>
            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-gold-light/60 bg-white shadow-premium">
              <ImagePanel
                src="/mms-doctor-couple-consult.png"
                alt="Doctor and patient in a private discovery discussion."
                objectPosition="50% center"
                className="min-h-[340px]"
              />
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>

      <section className="bg-navy px-4 py-20 text-ivory md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="editorial-kicker mb-5 text-gold-light">What happens after you enquire</p>
          <h2 className="max-w-3xl text-balance font-serif text-4xl leading-tight md:text-6xl">
            The next step should match the patient, not the other way around.
          </h2>
          <div className="mt-12">
            <JourneyLine dark steps={contactPath} />
          </div>
        </div>
      </section>
    </main>
  );
}
