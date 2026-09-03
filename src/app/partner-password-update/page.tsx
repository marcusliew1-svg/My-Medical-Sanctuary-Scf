export default async function PartnerPasswordUpdatePage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Partner security</p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-900">Choose a new password</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Use at least 12 characters and avoid passwords used for other services.</p>
        {query?.error ? <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">The link is invalid or the passwords could not be accepted. Request a new recovery email if needed.</div> : null}
        <form action="/api/partner-auth/password-update" method="post" className="mt-7 space-y-5">
          <label className="block text-sm font-medium text-stone-800">New password
            <input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600" />
          </label>
          <label className="block text-sm font-medium text-stone-800">Confirm new password
            <input name="confirmPassword" type="password" minLength={12} maxLength={128} autoComplete="new-password" required className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-emerald-600" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Update password</button>
        </form>
      </div>
    </main>
  );
}
