import type { TreatmentEducation } from "@/data/treatmentEducation";

export function TreatmentLaymanExplainer({ item }: { item: TreatmentEducation }) {
  const firstReason = item.whyPeopleAsk[0] ?? "People may ask about this option for a specific health goal or concern.";
  const firstCaution = item.caution[0] ?? "Suitability depends on the individual patient and the exact treatment context.";

  const layers = [
    {
      number: "01",
      title: "The short answer",
      text: item.summary,
      tone: "bg-white",
    },
    {
      number: "02",
      title: "What that actually means",
      text: item.plainEnglish,
      tone: "bg-[#edf2ef]",
    },
    {
      number: "03",
      title: "Why someone might ask about it",
      text: `${firstReason}. That is a reason to learn more, not proof that this treatment is the right answer for you.`,
      tone: "bg-white",
    },
    {
      number: "04",
      title: "Where it may fit",
      text: item.evidenceNote,
      tone: "bg-[#f3eee7]",
    },
    {
      number: "05",
      title: "When a professional needs to take over",
      text: `${firstCaution} A qualified healthcare professional should review the diagnosis or goal, your medical history, medicines, risks, alternatives and the exact product, device or procedure before any personalised decision is made.`,
      tone: "bg-[#07372f] text-ivory",
    },
  ];

  return (
    <section className="bg-ivory px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Plain-English explanation</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-5xl">Clear enough to understand. Detailed enough to be useful.</h2>
            <p className="mt-4 text-sm leading-7 text-warm-gray">MMS explains medical ideas in everyday language first, then adds the detail that helps you ask better questions. We avoid jargon for its own sake, but we also avoid vague answers that tell you nothing.</p>
          </div>

          <div className="grid gap-3">
            {layers.map((layer, index) => (
              <article key={layer.number} className={`rounded-[1.6rem] border border-stone-200 p-6 shadow-soft ${layer.tone}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold ${index === 4 ? "bg-ivory text-deep-green" : "bg-deep-green text-white"}`}>{layer.number}</span>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[.14em] ${index === 4 ? "text-[#d7c9a7]" : "text-deep-green"}`}>{layer.title}</p>
                    <p className={`mt-3 text-sm leading-7 ${index === 4 ? "text-ivory/78" : "text-navy"}`}>{layer.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
