import Link from "next/link";

const navItems = [
  ["Dashboard", "/partner-hub"],
  ["My Leads", "/partner-hub/leads"],
  ["Academy", "/partner-hub/academy"],
  ["Commissions", "/partner-hub/commissions"],
];

export function PartnerHubShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-warm-white pt-28 text-charcoal">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-[1.75rem] bg-navy p-5 text-ivory shadow-premium lg:sticky lg:top-28">
          <div className="border-b border-white/10 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">MMS Partner Hub</p>
            <h2 className="mt-2 font-serif text-2xl">Sales Operating System</h2>
          </div>
          <nav className="mt-5 space-y-2" aria-label="Partner Hub">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-white/8 p-4 text-xs leading-6 text-ivory/75">
            <strong className="block text-ivory">Partner controls</strong>
            Certification, lead ownership and compliance status determine whether a sale can generate commission.
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
