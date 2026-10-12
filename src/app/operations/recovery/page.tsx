import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verify MMS Owner Recovery", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

export default async function OwnerRecoveryVerificationPage({ searchParams }: { searchParams?: Promise<{ token_hash?: string; type?: string }> }) {
  const query = await searchParams;
  const tokenHash = query?.token_hash || "";
  const valid = query?.type === "recovery" && /^[A-Za-z0-9_-]{20,512}$/.test(tokenHash);
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs uppercase tracking-widest text-slate-500">My Medical Sanctuary · Private</p>
        <h1 className="mt-4 text-2xl font-semibold">Verify password recovery</h1>
        {valid ? <>
          <p className="mt-3 text-sm leading-6 text-slate-600">Continue to verify this one-time recovery link and choose a new password. Opening this page alone does not consume the link.</p>
          <form action="/api/operations/password-recovery/verify" method="post" className="mt-6">
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value="recovery" />
            <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Continue securely</button>
          </form>
        </> : <p role="alert" className="mt-4 text-sm text-red-700">This recovery link is invalid or incomplete. Request a new link from the sign-in page.</p>}
      </section>
    </main>
  );
}
