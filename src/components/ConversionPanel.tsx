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
    <section className="bg-[#eef6f3] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg border border-stone-200 bg-white p-8 shadow-[0_22px_58px_rgba(16,36,42,0.08)] md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
            Next Step
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-stone-600">{text}</p>
          <p className="mt-4 text-xs font-medium leading-6 text-stone-500">{assuranceCopy}</p>
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
