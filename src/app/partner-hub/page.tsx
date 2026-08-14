import Link from "next/link";
import { dashboardMetrics, partnerSummary, sampleLeads } from "@/data/partnerHub";

export default function PartnerHubDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Certified Partner Workspace</p>
            <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Welcome, {partnerSummary.name}.</h1>
            <p className="mt-3 max-w-2xl leading-7 text-warm-gray">Manage leads, training, approved sales materials and commission status from one controlled MMS workspace.</p>
          </div>
          <div className="rounded-2xl bg-ivory px-5 py-4 text-sm">
            <p className="font-bold text-deep-green">{partnerSummary.code}</p>
            <p className="mt-1 text-warm-gray">{partnerSummary.tier} · {partnerSummary.certification}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-warm-gray">{metric.label}</p>
            <p className="mt-3 font-serif text-4xl text-navy">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-warm-gray">{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-[2rem] bg-white p-7 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Pipeline</p><h2 className="mt-2 font-serif text-3xl text-navy">Recent leads</h2></div>
            <Link href="/partner-hub/leads" className="text-sm font-bold text-deep-green">View all →</Link>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-[0.12em] text-warm-gray"><tr><th className="pb-3">Lead</th><th className="pb-3">Package</th><th className="pb-3">Stage</th><th className="pb-3">Ownership since</th></tr></thead>
              <tbody>{sampleLeads.map((lead) => <tr key={lead.id} className="border-b border-black/5"><td className="py-4"><span className="font-bold text-navy">{lead.name}</span><br/><span className="text-xs text-warm-gray">{lead.id}</span></td><td className="py-4">{lead.package}</td><td className="py-4"><span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-deep-green">{lead.stage}</span></td><td className="py-4 text-warm-gray">{lead.ownerSince}</td></tr>)}</tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-deep-green p-7 text-ivory shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-light">Next actions</p>
          <h2 className="mt-2 font-serif text-3xl">Stay commission-ready.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-ivory/80">
            <li>Complete Approved Claims & Compliance training.</li>
            <li>Follow up 6 inactive leads.</li>
            <li>Resolve 2 applications with missing documents.</li>
            <li>Never collect client funds personally.</li>
          </ul>
          <Link href="/partner-hub/academy" className="mt-7 inline-flex rounded-full bg-ivory px-5 py-3 text-sm font-bold text-navy">Open Academy</Link>
        </aside>
      </section>
    </div>
  );
}
