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
    <section className="relative overflow-hidden bg-navy px-4 py-18 text-ivory md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_18%,rgba(212,175,55,0.16),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 border-y border-gold-light/30 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Next Step
          </p>
          <h2 className="text-balance font-serif text-4xl leading-tight text-ivory md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ivory/72">{text}</p>
          <p className="mt-4 text-xs font-medium leading-6 text-ivory/58">{assuranceCopy}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {conversionActions.map((action, index) => (
            <ButtonLink key={action.label} href={action.href} variant={index === 0 ? "primary" : "light"}>
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
