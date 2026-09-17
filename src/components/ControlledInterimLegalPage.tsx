import Link from "next/link";

export function ControlledInterimLegalPage({
  eyebrow,
  title,
  summary,
  unresolved,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  unresolved: ReadonlyArray<string>;
}) {
  return (
    <main className="bg-ivory px-4 pb-24 pt-40 text-charcoal md:pb-32 md:pt-48">
      <div className="mx-auto max-w-5xl">
        <p className="editorial-kicker text-deep-green">{eyebrow} — interim draft</p>
        <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-tight text-navy md:text-7xl">{title}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-warm-gray">{summary}</p>
        <div className="mt-12 border-y border-gold/35 py-8">
          <h2 className="font-serif text-3xl text-navy">Not a final legal notice</h2>
          <p className="mt-4 leading-7 text-warm-gray">
            No final MMS legal entity, registration number, controller identity, registered address, jurisdiction, effective date or counsel approval is represented by this page.
          </p>
          <ul className="mt-7 grid gap-4 text-sm leading-7 text-charcoal md:grid-cols-2">
            {unresolved.map((item) => <li key={item} className="border-t border-gold-light/60 pt-4">{item}</li>)}
          </ul>
        </div>
        <div className="mt-9 flex flex-wrap gap-5 text-sm font-semibold text-deep-green">
          <Link href="/privacy-pdpa" className="underline underline-offset-4">Interim privacy status</Link>
          <Link href="/terms" className="underline underline-offset-4">Interim terms status</Link>
          <Link href="/cookie-notice" className="underline underline-offset-4">Interim cookie status</Link>
          <Link href="/contact" className="underline underline-offset-4">Website availability</Link>
        </div>
      </div>
    </main>
  );
}
