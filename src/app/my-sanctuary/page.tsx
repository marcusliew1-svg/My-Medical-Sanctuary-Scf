import Link from "next/link";

const cards = [
  ["Doctor review", "1 Ling-prepared summary is awaiting human clinical review."],
  ["Next appointment", "No appointment scheduled in this demonstration account."],
  ["My tasks", "Complete consent preferences and confirm your health priorities."],
  ["Documents", "No records uploaded. Document upload is not active in this preview."],
];

export default function SanctuaryPage() {
  return (
    <main className="min-h-screen bg-warm-white px-4 pb-20 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] bg-deep-green p-8 text-ivory shadow-premium md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">My Sanctuary · Fictional preview</p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl">Good morning, Alex.</h1>
          <p className="mt-4 max-w-2xl text-ivory/75">Ling has organised your next actions. No medical recommendation is released until a qualified doctor approves it.</p>
          <Link href="/ling" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-ivory px-6 font-semibold text-deep-green">Continue with Ling</Link>
        </div>
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {cards.map(([title, text], index) => <article key={title} className="rounded-2xl border border-gold-light/35 bg-white p-6 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{index === 0 ? "Human approval required" : "Patient overview"}</p><h2 className="mt-3 font-serif text-2xl text-navy">{title}</h2><p className="mt-3 leading-7 text-warm-gray">{text}</p></article>)}
        </section>
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-7"><h2 className="font-serif text-3xl text-navy">Consent controls</h2><div className="mt-5 grid gap-4 text-sm text-warm-gray md:grid-cols-3">{["Ling conversation memory", "Care-team document access", "Malaysia–Thailand record sharing"].map((item) => <label key={item} className="flex items-start gap-3 rounded-xl bg-ivory p-4"><input type="checkbox" className="mt-1 accent-[#315B4C]" />{item}</label>)}</div></section>
        <p className="mt-6 text-xs text-warm-gray">All identities and health information shown here are synthetic. No patient data is stored by this internal preview.</p>
      </div>
    </main>
  );
}
