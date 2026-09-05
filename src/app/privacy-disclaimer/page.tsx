import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { EditorialHero } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Privacy / Disclaimer | My Medical Sanctuary",
  description: "Privacy and medical disclaimer information for My Medical Sanctuary.",
};

const boundaries = [
  {
    title: "General information only",
    text: "Website content is for general information and education. It should not be treated as personalised medical advice.",
  },
  {
    title: "Professional review required",
    text: "Any membership journey, wellness pathway or service discussion requires discovery, professional review and suitability assessment.",
  },
  {
    title: "No outcome promises",
    text: "MMS does not promise specific outcomes. Individual experiences vary and depend on many personal factors.",
  },
  {
    title: "Jurisdiction matters",
    text: "Availability of services may depend on Malaysian laws, professional requirements, licensing and clinical governance.",
  },
  {
    title: "Planned locations are not operating claims",
    text: "MMS Bangsar, MMS SS2 and MMS Johor are presented as planned. The website does not represent those centres, dialysis services or laboratory capabilities as open, licensed or accepting appointments.",
  },
  {
    title: "Emergency care",
    text: "This website and its enquiry tools are not emergency services. Anyone who may need urgent medical attention should contact the appropriate local emergency service without waiting for an MMS response.",
  },
];

export default function PrivacyDisclaimerPage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Privacy / Disclaimer"
        title="Trust begins with clear boundaries."
        lead="MMS provides education, discovery support and coordinated health journeys. Personalised decisions require appropriate professional review."
        image="/mms-about-hero.png"
        imageAlt="Private healthcare consultation with clear patient boundaries."
        primaryLabel="Contact MMS"
        primaryHref="/contact"
        secondaryLabel="Ask Ling"
        secondaryHref="/ling"
      />
      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-5">
          {boundaries.map((item) => (
            <DisclaimerBox key={item.title} title={item.title}>
              <p>{item.text}</p>
            </DisclaimerBox>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-5xl border-t border-gold/40 pt-6 text-sm leading-7 text-warm-gray">
          Publication status: the medical boundaries above are conservative, but final legal-entity details, jurisdictional wording, effective date and dated Medical/Legal approval remain launch blockers.
        </p>
      </section>
    </main>
  );
}
