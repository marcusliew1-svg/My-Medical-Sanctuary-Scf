import type { Step } from "@/data/steps";

type StepCardProps = {
  step: Step;
  index: number;
};

export function StepCard({ step, index }: StepCardProps) {
  return (
    <article className="rounded-lg border border-warm-white bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-5 font-serif text-2xl text-navy">{step.title}</h3>
      <p className="mt-3 leading-7 text-warm-gray">{step.description}</p>
    </article>
  );
}
