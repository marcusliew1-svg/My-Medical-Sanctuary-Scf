import type { Step } from "@/data/steps";

type StepCardProps = {
  step: Step;
  index: number;
};

export function StepCard({ step, index }: StepCardProps) {
  return (
    <article className="group rounded-lg border border-gold-light/40 bg-white/[0.92] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
      <p className="grid size-10 place-items-center rounded-full border border-gold-light bg-ivory text-xs font-bold text-gold transition group-hover:border-gold">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-5 font-serif text-2xl text-navy">{step.title}</h3>
      <p className="mt-3 leading-7 text-warm-gray">{step.description}</p>
    </article>
  );
}
