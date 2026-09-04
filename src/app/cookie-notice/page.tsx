import type { Metadata } from "next";
import { EditorialHero } from "@/components/Editorial";

export const metadata: Metadata = {
  title: "Cookie Notice | My Medical Sanctuary",
  description: "Current first-party cookie and attribution behavior on the My Medical Sanctuary website.",
};

const sections = [
  {
    title: "Current first-party attribution cookie",
    text: "When a valid MMS Partner referral code is present in the ref query parameter, the website stores it in an HttpOnly, SameSite=Lax first-party cookie named mms_partner_ref for up to 30 days. It contains a Partner ID only and must not contain health or clinical information.",
  },
  {
    title: "Referral and campaign parameters",
    text: "The enquiry journey may retain bounded ref, utm_source, utm_medium, utm_campaign, utm_content and locale values. Unknown or malformed attribution values are rejected by the booking workflow.",
  },
  {
    title: "Analytics",
    text: "No third-party analytics provider is enabled in the reviewed baseline. Analytics or additional non-essential cookies must not be enabled until their purpose, provider, consent behavior, retention and cross-border handling are approved and documented.",
  },
  {
    title: "Launch-blocking legal decisions",
    text: "The verified legal entity responsible for this website, privacy contact, final cookie classification, consent requirements and effective date remain pending owner and legal-counsel approval. This interim notice is not a substitute for that approval.",
  },
];

export default function CookieNoticePage() {
  return (
    <main>
      <EditorialHero
        eyebrow="Cookie Notice"
        title="A clear record of current website storage."
        lead="This interim notice describes the limited first-party attribution behavior present in the reviewed website baseline and identifies what must be approved before launch."
        image="/mms-about-hero.png"
        imageAlt="Private consultation environment representing careful information handling."
        primaryLabel="Privacy / PDPA"
        primaryHref="/privacy-pdpa"
        secondaryLabel="Contact MMS"
        secondaryHref="/contact"
      />
      <section className="bg-ivory px-4 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8">
            {sections.map((section) => (
              <article key={section.title} className="border-t border-gold/40 pt-6">
                <h2 className="font-serif text-3xl text-navy">{section.title}</h2>
                <p className="mt-3 text-lg leading-8 text-charcoal">{section.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
