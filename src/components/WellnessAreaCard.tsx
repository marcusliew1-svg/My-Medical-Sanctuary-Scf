import type { WellnessArea } from "@/data/wellnessAreas";

type WellnessAreaCardProps = {
  area: WellnessArea;
};

export function WellnessAreaCard({ area }: WellnessAreaCardProps) {
  return (
    <article className="rounded-lg border border-gold-light/40 bg-white/[0.92] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-premium">
      <div className="mb-5 h-px w-12 bg-gold" />
      <h3 className="font-serif text-2xl text-navy">{area.title}</h3>
      <p className="mt-4 leading-7 text-warm-gray">{area.description}</p>
    </article>
  );
}
