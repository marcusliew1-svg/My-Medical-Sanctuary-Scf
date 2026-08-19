"use client";

import { useState } from "react";

export function PartnerHubSignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      const csrfRequest = await fetch("/api/partner-hub/csrf", { cache: "no-store", credentials: "include" });
      if (!csrfRequest.ok) throw new Error("csrf_unavailable");
      const csrf = (await csrfRequest.json()) as { csrfToken?: string; headerName?: string };
      if (!csrf.csrfToken) throw new Error("csrf_missing");

      const logoutRequest = await fetch("/api/partner-hub/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          [csrf.headerName || "x-mms-csrf-token"]: csrf.csrfToken,
        },
      });
      if (!logoutRequest.ok) throw new Error("logout_failed");
      window.location.assign("/partner-hub");
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={busy}
      className="ml-auto whitespace-nowrap rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
