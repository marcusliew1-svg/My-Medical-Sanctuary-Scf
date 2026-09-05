import Link from "next/link";

export default function ForbiddenPage() {
  return <main className="min-h-[70vh] bg-warm-white px-4 pb-20 pt-40"><div className="mx-auto max-w-xl border-l-2 border-gold bg-white p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Access denied</p><h1 className="mt-3 font-serif text-4xl text-navy">This account cannot open My Sanctuary.</h1><p className="mt-4 leading-7 text-warm-gray">Sign in with an approved MMS patient account. Partner, operator and reviewer identities use separate secure areas.</p><Link href="/login" className="mt-6 inline-block font-semibold text-deep-green underline underline-offset-4">Return to patient sign in</Link></div></main>;
}
