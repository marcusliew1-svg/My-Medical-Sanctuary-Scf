import { commissionRules, sampleCommissions } from "@/data/partnerHub";

export default function PartnerCommissionsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Commission Wallet</p>
        <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Transparent status. No commission on cancelled sales.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">Commission progresses only when the underlying membership remains valid. Cancellation or refund removes the related commission entitlement; paid commission is reversed and recoverable.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {[{ title: "Cancellation", text: commissionRules.cancellationRule }, { title: "When it becomes payable", text: commissionRules.payoutRule }, { title: "Rule versioning", text: commissionRules.versioningRule }].map((rule) => (
          <article key={rule.title} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">{rule.title}</p>
            <p className="mt-3 text-sm leading-7 text-warm-gray">{rule.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-white p-7 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Transactions</p><h2 className="mt-2 font-serif text-3xl text-navy">Commission status</h2></div><p className="text-sm text-warm-gray">Estimated → Pending → Qualified → Approved → Payable → Paid / Reversed</p></div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.12em] text-warm-gray"><tr><th className="pb-3">Reference</th><th className="pb-3">Member</th><th className="pb-3">Package</th><th className="pb-3">Commission</th><th className="pb-3">Status</th></tr></thead>
            <tbody>{sampleCommissions.map((item) => <tr key={item.reference} className="border-b border-black/5"><td className="py-4 text-xs text-warm-gray">{item.reference}</td><td className="py-4 font-semibold text-navy">{item.member}</td><td className="py-4">{item.package}</td><td className="py-4 font-semibold">{item.amount}</td><td className="py-4"><span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-deep-green">{item.status}</span></td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold-light/40 bg-ivory p-7">
        <h2 className="font-serif text-2xl text-navy">Production control</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-warm-gray">The final engine will calculate commission from a versioned rule table rather than fixed percentages in the UI. Refunds, cancellations, chargebacks and invalid sales will create explicit reversal events instead of silently editing historical records.</p>
      </section>
    </div>
  );
}
