import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { authenticateOperatorRequest, MMS_OPERATOR_SESSION_COOKIE } from "@/lib/operatorSecurity";
import { MMS_OPERATOR_ACCESS_TOKEN_COOKIE } from "@/lib/operatorIdentity";

export const metadata: Metadata = {
  title: "MMS Private Owner",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  const jar = await cookies();
  const session = jar.get(MMS_OPERATOR_SESSION_COOKIE)?.value;
  const accessToken = jar.get(MMS_OPERATOR_ACCESS_TOKEN_COOKIE)?.value;
  if (!session || !accessToken) redirect("/operations/login");
  const requestHeaders = new Headers(await headers());
  requestHeaders.set("cookie", [MMS_OPERATOR_SESSION_COOKIE + "=" + session, MMS_OPERATOR_ACCESS_TOKEN_COOKIE + "=" + accessToken].join("; "));
  const request = new NextRequest("https://mms-owner.internal/owner", { headers: requestHeaders });
  const auth = await authenticateOperatorRequest(request);
  if (auth.status !== "authenticated") redirect("/operations/login");
  if (auth.claims.roles.length !== 1 || auth.claims.roles[0] !== "owner") {
    // Do not disclose owner-only content to admin, finance, audit or operations accounts.
    redirect("/operations");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="border-b border-slate-700 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">My Medical Sanctuary · Private</p>
          <h1 className="mt-3 text-3xl font-semibold">Owner Oversight</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Confidential governance workspace. Access is restricted to the verified owner role.
            Financial, commercial and clinical metrics are not displayed until their sources and access controls are validated.
          </p>
        </header>
        <section aria-label="Owner reporting readiness" className="grid gap-4 md:grid-cols-3">
          {[
            ["Business performance", "Data connection pending"],
            ["Executive operations", "Delegated administrator onboarding pending"],
            ["Governance and approvals", "Owner-only workflow pending"],
          ].map(([title, status]) => (
            <div key={title} className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-amber-200">{status}</p>
            </div>
          ))}
        </section>
        <p className="text-xs text-slate-400">No personal email addresses, patient records or synthetic financial results are exposed on this page.</p>
      </div>
    </main>
  );
}
