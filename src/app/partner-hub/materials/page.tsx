import { salesMaterials } from "@/data/partnerHub";

const statusClass = {
  Approved: "bg-deep-green/10 text-deep-green",
  "Pending Review": "bg-gold-light/25 text-charcoal",
  Expired: "bg-warm-white text-warm-gray",
  Withdrawn: "bg-red-50 text-red-700",
} as const;

export default function PartnerMaterialsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Presentation Centre</p>
        <h1 className="mt-3 font-serif text-4xl text-navy">One source for approved MMS sales materials.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">
          Partners should use only the current approved version. Superseded, pending or withdrawn material stays visible to administrators but is not distributed for live selling.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {salesMaterials.map((material) => (
          <article key={`${material.title}-${material.version}`} className="rounded-[1.75rem] border border-gold-light/30 bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">{material.language} · {material.version}</p>
                <h2 className="mt-3 font-serif text-2xl text-navy">{material.title}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[material.status]}`}>{material.status}</span>
            </div>
            <p className="mt-5 text-sm text-warm-gray">Last reviewed: {material.reviewed}</p>
            <button
              type="button"
              disabled={material.status !== "Approved"}
              className="mt-5 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              {material.status === "Approved" ? "Open approved material" : "Not available for selling"}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-navy p-7 text-ivory">
        <h2 className="font-serif text-2xl">Compliance by design</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ivory/75">
          Every production asset should ultimately carry version, country, approval date, reviewer, permitted channel and review/expiry date. This prevents outdated presentations and unapproved medical claims from circulating through the agent network.
        </p>
      </section>
    </div>
  );
}
