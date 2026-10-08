import type { Metadata } from "next";
import { memberships } from "@/data/memberships";

export const metadata: Metadata = {
  title: "Package Comparison",
  robots: { index: false, follow: false },
};

export default function PartnerPackageComparisonPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Partner Hub</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Membership package comparison</h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Use this page as a commercial conversation guide. It reflects the same membership pathway source used by
          the public membership experience. It does not determine clinical suitability, replace professional review,
          or authorise claims beyond approved MMS materials.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="w-44 border-b border-stone-200 px-5 py-4 font-semibold text-stone-700">Comparison point</th>
              {memberships.map((membership) => (
                <th key={membership.name} className="border-b border-stone-200 px-5 py-4 align-top">
                  <div className="text-base font-semibold text-stone-900">{membership.name}</div>
                  <div className="mt-1 text-xs font-medium text-emerald-700">{membership.tagline}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border-b border-stone-100 px-5 py-4 align-top font-semibold text-stone-700">Access</th>
              {memberships.map((membership) => (
                <td key={membership.name} className="border-b border-stone-100 px-5 py-4 align-top text-stone-600">
                  {membership.accessNote}
                </td>
              ))}
            </tr>
            <tr>
              <th className="border-b border-stone-100 px-5 py-4 align-top font-semibold text-stone-700">Who it may suit</th>
              {memberships.map((membership) => (
                <td key={membership.name} className="border-b border-stone-100 px-5 py-4 align-top text-stone-600">
                  {membership.whoItSuits}
                </td>
              ))}
            </tr>
            <tr>
              <th className="border-b border-stone-100 px-5 py-4 align-top font-semibold text-stone-700">Coordination model</th>
              {memberships.map((membership) => (
                <td key={membership.name} className="border-b border-stone-100 px-5 py-4 align-top text-stone-600">
                  {membership.coordination}
                </td>
              ))}
            </tr>
            <tr>
              <th className="px-5 py-4 align-top font-semibold text-stone-700">Typical first 30 days</th>
              {memberships.map((membership) => (
                <td key={membership.name} className="px-5 py-4 align-top text-stone-600">
                  <ul className="space-y-2">
                    {membership.firstThirtyDays.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden className="mt-1 text-emerald-700">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Commercial guidance only</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Partners may explain approved membership pathways and commercial status. Do not diagnose, prescribe,
            guarantee outcomes, or decide medical suitability.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-900">Use current materials</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            If package wording, inclusions or commercial terms change, rely on the current approved Presentation Centre
            material and MMS system record rather than saved screenshots or old decks.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-900">Escalate uncertainty</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Questions involving suitability, clinical scope or patient-specific advice must move to the appropriate MMS
            coordinator or clinical team.
          </p>
        </div>
      </section>
    </main>
  );
}
