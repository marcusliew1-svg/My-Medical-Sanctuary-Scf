"use client";

import { useState } from "react";

export function PartnerHubSignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      const logoutRequest = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        redirect: "follow",
      });
      if (!logoutRequest.ok) throw new Error("logout_failed");
      window.location.assign("/partner-login");
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
