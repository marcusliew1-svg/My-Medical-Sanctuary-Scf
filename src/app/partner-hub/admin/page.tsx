import Link from "next/link";

const queues = [
  { title: "Lead ownership review", count: 3, note: "Duplicate or transfer cases requiring sales-admin decision" },
  { title: "Payment verification", count: 5, note: "Applications waiting for finance confirmation" },
  { title: "Compliance clearance", count: 2, note: "Sales or wording review before activation" },
  { title: "Commission approval", count: 4, note: "Qualified commissions awaiting authorised release" },
  { title: "Cancellation / reversal", count: 1, note: "Cancelled membership with commission recovery required" },
];

const controls = [
  ["Sales Admin", "Lead ownership, transfer reasons, partner status"],
  ["Finance", "Payment verification, payout approval, recovery and statements"],
  ["Compliance", "Partner conduct, claim review, exceptions and suspension"],
  ["Management", "Rule approval, campaign controls and exception authority"],
];

export default function PartnerHubAdminPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Commercial Control</p>
        <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Management queue</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">Commercial approvals are separated by role. Partners cannot verify their own payments, alter ownership history, approve refunds or release commission.</p>
        <Link href="/partner-hub/admin/finance" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-ivory">Open finance control</Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {queues.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4"><h2 className="font-serif text-2xl text-navy">{item.title}</h2><span className="rounded-full bg-ivory px-3 py-1 text-sm font-bold text-deep-green">{item.count}</span></div>
            <p className="mt-3 text-sm leading-6 text-warm-gray">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-navy p-7 text-ivory shadow-premium md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">Segregation of duties</p>
        <h2 className="mt-3 font-serif text-3xl">Who controls what</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {controls.map(([role, scope]) => <div key={role} className="rounded-2xl bg-white/8 p-5"><h3 className="font-bold">{role}</h3><p className="mt-2 text-sm leading-6 text-ivory/70">{scope}</p></div>)}
        </div>
      </section>
    </div>
  );
}
