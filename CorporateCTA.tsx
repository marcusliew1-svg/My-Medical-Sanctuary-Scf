import { CTAButton } from "@/components/CTAButton";

export function CorporateCTA() {
  return (
    <section className="bg-deep-green px-4 py-16 text-ivory">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-light">
            Corporate Executive Wellness
          </p>
          <h2 className="font-serif text-3xl leading-tight md:text-5xl">
            Preventive wellness pathways for leadership teams.
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-ivory/78">
            MMS supports organisations with discovery-led executive wellness, HRM coordination and professional review pathways.
          </p>
        </div>
        <CTAButton href="/corporate-executive-wellness">Explore Corporate Wellness</CTAButton>
      </div>
    </section>
  );
}
