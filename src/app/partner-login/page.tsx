import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Login",
  description: "Secure access to the My Medical Sanctuary Partner Hub.",
  robots: { index: false, follow: false },
};

function safeNext(value?: string): string {
  if (value === "/partner-hub" || value?.startsWith("/partner-hub/")) return value;
  return "/partner-hub";
}

export default function PartnerLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const next = safeNext(searchParams?.next);
  const error = searchParams?.error;

  const message =
    error === "invalid_credentials"
      ? "The email or password was not accepted."
      : error === "not_authorized"
        ? "This identity is not linked to an MMS Partner account permitted to use the Hub."
        : error === "auth_unavailable"
          ? "Partner sign-in is not enabled in this environment yet."
          : "";

  return (
    <main className="min-h-screen bg-[#f3eee5] px-4 py-24">
      <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-gold/20 bg-white shadow-[0_32px_100px_rgba(11,26,46,0.14)]">
        <div className="bg-[#07151d] px-7 py-8 text-ivory">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-light">My Medical Sanctuary</p>
          <h1 className="mt-3 font-serif text-4xl">Partner Hub</h1>
          <p className="mt-3 text-sm leading-6 text-ivory/62">
            Secure access for authorised MMS Partners.
          </p>
        </div>

        <div className="p-7">
          {message ? (
            <div role="alert" className="mb-5 rounded-xl border border-gold/25 bg-[#fbf8f2] px-4 py-3 text-sm leading-6 text-charcoal">
              {message}
            </div>
          ) : null}

          <form action="/api/partner-auth/login" method="post" className="grid gap-5">
            <input type="hidden" name="next" value={next} />
            <div className="absolute left-[-10000px] size-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-navy">
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="min-h-12 rounded-xl border border-stone-200 px-4 font-normal outline-none transition focus:border-gold focus:ring-2 focus:ring-gold-light/25"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-navy">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={512}
                autoComplete="current-password"
                className="min-h-12 rounded-xl border border-stone-200 px-4 font-normal outline-none transition focus:border-gold focus:ring-2 focus:ring-gold-light/25"
              />
            </label>

            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#07151d] px-6 text-sm font-semibold text-white transition hover:bg-deep-green"
            >
              Sign in securely
            </button>
          </form>

          <p className="mt-6 text-xs leading-5 text-warm-gray">
            Access is limited to authorised MMS Partners. Need help?{" "}
            <Link href="/contact" className="font-semibold text-deep-green underline underline-offset-4">
              Contact MMS
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
