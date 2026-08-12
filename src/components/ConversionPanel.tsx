import { assuranceCopy, conversionActions } from "@/lib/content";
import { ButtonLink } from "@/components/ButtonLink";

type ConversionPanelProps = {
  title?: string;
  text?: string;
};

export function ConversionPanel({
  title = "Ready to take the next step?",
  text = "Start with a consultation request. MMS can guide you toward the right screening, doctor review, or programme pathway.",
}: ConversionPanelProps) {
  return (
    <section className="bg-warm-white px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-gold-light/50 bg-white/[0.94] p-8 shadow-premium md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Next Step
          </p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-navy md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-warm-gray">{text}</p>
          <p className="mt-4 text-xs font-medium leading-6 text-warm-gray">{assuranceCopy}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {conversionActions.map((action, index) => (
            <ButtonLink key={action.label} href={action.href} variant={index === 0 ? "primary" : "outline"}>
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
