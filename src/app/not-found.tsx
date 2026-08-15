import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-ivory px-4 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Page not found</p>
        <h1 className="mt-4 font-serif text-4xl text-navy md:text-5xl">This page is not available.</h1>
        <p className="mt-5 leading-7 text-warm-gray">
          The link may have moved or the page may no longer be public. You can return home, start with Ling, or visit Contact.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">Home</Link>
          <Link href="/ling" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Start with Ling</Link>
          <Link href="/contact" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Contact</Link>
        </div>
      </div>
    </main>
  );
}
