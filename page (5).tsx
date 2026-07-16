import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Contact / Discovery Form",
  description:
    "Contact My Medical Sanctuary to start a discovery discussion for membership, wellness coordination or corporate executive wellness.",
};

export default function ContactPage() {
  return (
    <main>
      <Hero
        eyebrow="Contact / Discovery Form"
        title="Start with a discovery discussion."
        subtitle="Share your context and the MMS team can guide the next appropriate step for your structured wellness journey."
        image="/mms-about-hero.png"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Zoho-ready later"
              title="Discovery enquiry"
              description="This v0.1 form logs submissions in the browser and can be connected to Zoho Forms or Zoho CRM later."
            />
            <p className="leading-8 text-warm-gray">
              Recommended future mapping: contact details, interest, membership preference, enquiry type, consent, source page and timestamp.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
