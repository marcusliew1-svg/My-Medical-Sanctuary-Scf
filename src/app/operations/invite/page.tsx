import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept MMS invitation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const dynamic = "force-dynamic";

export default async function OperatorInvitePage({
  searchParams,
}: {
  searchParams?: Promise<{ token_hash?: string; type?: string }>;
}) {
  const query = await searchParams;
  const tokenHash = query?.token_hash || "";
  const valid = query?.type === "invite" && /^[A-Za-z0-9_-]{20,512}$/.test(tokenHash);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs uppercase tracking-widest text-slate-500">My Medical Sanctuary</p>
        <h1 className="mt-4 text-2xl font-semibold">Accept your staff invitation</h1>
        {valid ? (
          <>
            <p className="mt-3 text-sm text-slate-600">Continue to verify this one-time invitation and create your MMS password.</p>
            <form method="post" action="/api/operations/invite" className="mt-6">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value="invite" />
              <button className="rounded-lg bg-slate-900 px-5 py-3 text-white" type="submit">Accept invitation</button>
            </form>
          </>
        ) : (
          <p role="alert" className="mt-4 text-sm text-red-700">This invitation link is invalid or incomplete. Request a fresh MMS invitation.</p>
        )}
        <p className="mt-5 text-xs text-slate-500">Invitation acceptance does not grant permissions. Staff roles are assigned separately by an authorised administrator.</p>
      </section>
    </main>
  );
}
