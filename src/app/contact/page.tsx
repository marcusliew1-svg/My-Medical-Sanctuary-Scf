import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import {
  CTASection,
  EditorialSplit,
  JourneyStepRail,
  PublicHero,
  SectionHeading,
  TrustBar,
} from "@/components/PublicExperience";

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
      <PublicHero
        eyebrow="Contact MMS"
        title="Start with a private discovery discussion."
        brandLine="Private, careful and suitability-first."
        lead="Share your context once. MMS can help route you toward the right first step before any programme or recommendation is considered."
        image="/mms-concierge-lounge.png"
        imageAlt="Private concierge lounge for a discovery discussion at My Medical Sanctuary."
        primaryLabel="Send Private Enquiry"
        primaryHref="#discovery-form"
        secondaryLabel="Ask Ling First"
        secondaryHref="/ling"
        imagePosition="50% center"
      />

      <TrustBar
        items={[
          { title: "Private", text: "A discreet first conversation before recommendations." },
          { title: "Routed", text: "Screening, membership, corporate or education pathways." },
          { title: "Doctor-led", text: "Medical decisions remain professionally reviewed." },
          { title: "Clear", text: "A practical next step, not a pressure sequence." },
          { title: "Human", text: "A team member reviews the context." },
          { title: "Prepared", text: "Your appointment can begin with better information." },
        ]}
      />

      <section id="discovery-form" className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div className="min-w-0 lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Concierge intake"
              title="A calm first step, not a sales counter."
              lead="The form helps MMS understand whether you are looking for screening, continuity, education, executive wellness or a broader preventive health journey."
            />
            <div className="mt-8 grid gap-4 border-y border-gold/35 py-6 text-sm leading-6 text-warm-gray">
              <p>
                <strong className="text-navy">What to share:</strong> symptoms, goals, travel needs, family context,
                prior screening, current concerns or uncertainty about where to begin.
              </p>
              <p>
                <strong className="text-navy">What happens next:</strong> MMS reviews the enquiry and guides the
                appropriate appointment, education or membership conversation.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <EditorialSplit
        eyebrow="What happens after you enquire"
        title="The next step should match the patient, not the other way around."
        lead="A strong patient experience begins by listening carefully, then routing the enquiry toward the correct clinical or concierge pathway."
        image="/mms-doctor-couple-consult.png"
        imageAlt="Doctor and patient in a private discovery discussion."
        imagePosition="50% center"
        dark
        reverse
      >
        <JourneyStepRail dark steps={contactPath} />
      </EditorialSplit>

      <CTASection
        title="Start with clarity."
        lead="Send a private enquiry and let MMS guide the most appropriate first conversation."
      />
    </main>
  );
}
