import { academyModules } from "@/data/partnerHub";

const approvedMaterials = [
  { title: "Founding Partner Opportunity", language: "English", status: "Approved", version: "V9" },
  { title: "创始合作伙伴机会", language: "Chinese", status: "Approved", version: "V2" },
  { title: "Membership Comparison", language: "English", status: "Review", version: "Draft" },
];

export default function PartnerAcademyPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Sales Academy</p>
        <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Train once. Sell with approved language.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">No certification, no referral code. No referral code, no commission. The Academy keeps training, compliance and current sales materials in one controlled place.</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] bg-white p-7 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Certification path</p>
          <h2 className="mt-2 font-serif text-3xl text-navy">Required learning</h2>
          <div className="mt-6 space-y-3">
            {academyModules.map((module, index) => (
              <article key={module.title} className="flex items-center justify-between gap-4 rounded-2xl bg-ivory p-5">
                <div className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-ivory">{index + 1}</span><div><h3 className="font-semibold text-navy">{module.title}</h3><p className="mt-1 text-xs text-warm-gray">{module.duration}</p></div></div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-deep-green">{module.status}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Presentation Centre</p>
          <h2 className="mt-2 font-serif text-3xl text-navy">Current approved assets</h2>
          <p className="mt-3 text-sm leading-6 text-warm-gray">Only approved versions should be downloadable by agents. Withdrawn or superseded materials remain archived for audit but disappear from the sales library.</p>
          <div className="mt-6 space-y-3">
            {approvedMaterials.map((material) => (
              <article key={`${material.title}-${material.language}`} className="rounded-2xl border border-black/5 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold text-navy">{material.title}</h3><p className="mt-1 text-xs text-warm-gray">{material.language} · {material.version}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${material.status === "Approved" ? "bg-deep-green/10 text-deep-green" : "bg-gold-light/30 text-charcoal"}`}>{material.status}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-navy p-7 text-ivory shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Compliance reminder</p>
        <h2 className="mt-2 font-serif text-3xl">Partners introduce. Qualified professionals decide.</h2>
        <div className="mt-6 grid gap-4 text-sm leading-6 text-ivory/78 md:grid-cols-3">
          <p>Do not diagnose, prescribe or compare treatments as a doctor.</p>
          <p>Do not promise cures, reversals or guaranteed outcomes.</p>
          <p>All client payments go directly to the official MMS / clinic account.</p>
        </div>
      </section>
    </div>
  );
}
