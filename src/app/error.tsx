"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-ivory px-4 py-24 text-center">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Something went wrong</p>
        <h1 className="mt-4 font-serif text-4xl text-navy md:text-5xl">This page could not be loaded.</h1>
        <p className="mt-5 leading-7 text-warm-gray">
          No booking, enquiry or clinical action should be assumed successful unless you see a clear confirmation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">Try again</button>
          <Link href="/" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Home</Link>
          <Link href="/contact" className="rounded-full border border-gold px-5 py-3 text-sm font-semibold text-navy">Contact</Link>
        </div>
      </div>
    </main>
  );
}
