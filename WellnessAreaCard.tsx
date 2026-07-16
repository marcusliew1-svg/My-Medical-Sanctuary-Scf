import type { WellnessArea } from "@/data/wellnessAreas";

type WellnessAreaCardProps = {
  area: WellnessArea;
};

export function WellnessAreaCard({ area }: WellnessAreaCardProps) {
  return (
    <article className="rounded-lg border border-warm-white bg-white p-6 transition hover:-translate-y-1 hover:shadow-premium">
      <h3 className="font-serif text-2xl text-navy">{area.title}</h3>
      <p className="mt-4 leading-7 text-warm-gray">{area.description}</p>
    </article>
  );
}
