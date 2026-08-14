import type { HealthConcern } from "@/data/healthConcerns";

export function HealthConcernExplainer({ concern }: { concern: HealthConcern }) {
  const firstChecks = concern.firstChecks.slice(0, 3);
  const related = concern.relatedTopics.slice(0, 2);

  return (
    <section className="bg-ivory px-4 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-deep-green">MMS plain-English explanation</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-5xl">Understand the concern without losing the medical meaning.</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-soft lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">01 · The short answer</span>
            <p className="mt-3 text-sm leading-7 text-navy">{concern.intro}</p>
          </article>

          <article className="rounded-[1.5rem] bg-[#edf2ef] p-5 lg:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">02 · What that actually means</span>
            <p className="mt-3 text-sm leading-7 text-navy">{concern.layman}</p>
          </article>

          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-5 lg:col-span-3">
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-deep-green">03 · What may be worth checking</span>
            <div className="mt-4 grid gap-2">{firstChecks.map(item => <div key={item} className="flex gap-3 rounded-xl bg-ivory p-3 text-sm leading-6 text-navy"><span className="font-bold text-deep-green">✓</span><span>{item}</span></div>)}</div>
          </article>

          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-5 lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">04 · Where treatment topics may fit</span>
            <div className="mt-4 grid gap-3">{related.map(topic => <div key={topic.label} className="rounded-xl bg-ivory p-3"><p className="text-sm font-semibold text-navy">{topic.label}</p><p className="mt-1 text-xs leading-5 text-warm-gray">{topic.note}</p></div>)}</div>
          </article>

          <article className="rounded-[1.5rem] bg-deep-green p-5 text-white lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#d7c9a7]">05 · Where Ling stops</span>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/80">This information can help you understand possibilities and prepare better questions. It does not confirm a diagnosis or make a treatment suitable for you. A qualified healthcare professional needs to review your personal symptoms, history, examination, tests, medicines and contraindications before making a medical decision.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
