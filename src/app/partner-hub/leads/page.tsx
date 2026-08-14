import { sampleLeads } from "@/data/partnerHub";

export default function PartnerLeadsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-7 shadow-soft md:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Lead Ownership</p>
        <h1 className="mt-3 font-serif text-4xl text-navy md:text-5xl">Register first. Keep the history.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">Every lead should carry a timestamped ownership trail. Management can transfer ownership when justified, but historical events remain visible for audit and commission disputes.</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <form className="rounded-[2rem] bg-white p-7 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">New lead</p>
          <h2 className="mt-2 font-serif text-3xl text-navy">Register a prospect</h2>
          <div className="mt-6 space-y-4">
            {["Prospect full name", "Mobile / WhatsApp", "Email", "Source / relationship"].map((label) => (
              <label key={label} className="block text-sm font-semibold text-navy">{label}<input className="mt-2 w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 font-normal outline-none focus:border-gold" /></label>
            ))}
            <label className="block text-sm font-semibold text-navy">Package interest<select className="mt-2 w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 font-normal"><option>Not sure yet</option><option>Ascend</option><option>Evolve</option><option>Eterna</option><option>Pinnacle</option></select></label>
            <label className="block text-sm font-semibold text-navy">Non-medical notes<textarea rows={4} className="mt-2 w-full rounded-xl border border-black/10 bg-ivory px-4 py-3 font-normal" placeholder="Relationship context, preferences or requested next step. Do not enter medical records here." /></label>
          </div>
          <button type="button" className="mt-6 w-full rounded-full bg-navy px-5 py-3 text-sm font-bold text-ivory">Check duplicate & register lead</button>
          <p className="mt-4 text-xs leading-5 text-warm-gray">Production version will run duplicate checks before ownership is granted and record every ownership event.</p>
        </form>

        <div className="rounded-[2rem] bg-white p-7 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Current book</p>
          <h2 className="mt-2 font-serif text-3xl text-navy">My leads</h2>
          <div className="mt-6 space-y-4">
            {sampleLeads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-black/5 bg-ivory p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><h3 className="font-serif text-2xl text-navy">{lead.name}</h3><p className="mt-1 text-xs text-warm-gray">{lead.id} · Owner since {lead.ownerSince}</p></div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-deep-green">{lead.stage}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><span className="text-warm-gray">Package interest</span><p className="font-semibold text-navy">{lead.package}</p></div><div><span className="text-warm-gray">Ownership control</span><p className="font-semibold text-navy">Active / timestamped</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
