import { sampleApplications } from "@/data/partnerHub";

export default function PartnerApplicationsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Applications</p>
        <h1 className="mt-3 font-serif text-4xl text-navy">Track membership applications without exposing clinical records.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-warm-gray">
          Partners see commercial progress only: application status, payment status and activation. Clinical suitability, medical records and doctor communications remain outside the Partner Hub.
        </p>
      </header>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="grid grid-cols-[1.1fr_1.2fr_1fr_1.2fr] gap-3 border-b border-warm-white px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-warm-gray">
          <span>Reference</span><span>Member</span><span>Package</span><span>Status</span>
        </div>
        {sampleApplications.map((application) => (
          <div key={application.id} className="grid grid-cols-[1.1fr_1.2fr_1fr_1.2fr] gap-3 border-b border-warm-white px-6 py-5 text-sm last:border-0">
            <span className="font-semibold text-navy">{application.id}</span>
            <span>{application.member}</span>
            <span>{application.package}</span>
            <span className="font-semibold text-deep-green">{application.status}</span>
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-gold-light/30 bg-ivory p-7">
        <h2 className="font-serif text-2xl text-navy">Application controls</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Commercial only", "Partners cannot view diagnosis, screening results, prescriptions or private doctor notes."],
            ["Payment verified", "An application does not qualify for commission until payment is verified by MMS."],
            ["Cancellation stops commission", "A cancelled membership earns zero commission. Any commission already paid for that sale is reversed."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl bg-white p-5">
              <h3 className="font-serif text-xl text-navy">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-warm-gray">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
