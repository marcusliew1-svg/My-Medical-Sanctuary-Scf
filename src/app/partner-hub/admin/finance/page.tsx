const payoutRows = [
  { ref: "CM-260812-002", partner: "MMS-P-0001", member: "Adrian Tan", amount: "RM 12,888.80", status: "Qualified", action: "Awaiting approval" },
  { ref: "CM-260811-006", partner: "MMS-P-0012", member: "Demo Member", amount: "RM 888.80", status: "Approved", action: "Next payout cycle" },
  { ref: "CM-260805-004", partner: "MMS-P-0020", member: "Cancelled Member", amount: "RM 2,888.80", status: "Reversed", action: "Recovery required" },
];

export default function PartnerFinancePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Finance Control</p>
        <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Commission release & recovery</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">Finance verifies money received, releases approved commissions and records recoveries. A partner cannot approve their own commission or override a cancellation.</p>
      </header>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="border-b border-black/5 p-6"><h2 className="font-serif text-3xl text-navy">Current commission queue</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-[0.12em] text-warm-gray"><tr><th className="px-5 py-4">Reference</th><th className="px-5 py-4">Partner</th><th className="px-5 py-4">Member</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Next action</th></tr></thead>
            <tbody>{payoutRows.map((row) => <tr key={row.ref} className="border-t border-black/5"><td className="px-5 py-4 font-semibold text-navy">{row.ref}</td><td className="px-5 py-4">{row.partner}</td><td className="px-5 py-4">{row.member}</td><td className="px-5 py-4 font-semibold">{row.amount}</td><td className="px-5 py-4"><span className="rounded-full bg-ivory px-3 py-1 text-xs font-bold text-deep-green">{row.status}</span></td><td className="px-5 py-4 text-warm-gray">{row.action}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold-light/40 bg-ivory p-7">
        <h2 className="font-serif text-2xl text-navy">Cancellation control</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-warm-gray">A cancelled or refunded membership has zero commission entitlement. If payout already occurred, the ledger posts a full reversal and creates a recovery balance for set-off or repayment. This rule cannot be bypassed by the partner.</p>
      </section>
    </div>
  );
}
