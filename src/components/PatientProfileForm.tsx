"use client";
import { useState } from "react";

type Profile = { fullName: string; mobile: string; country: string; preferredLocation: string; communicationPreference: string };
export function PatientProfileForm({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial);
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving...");
    const response = await fetch("/api/my-sanctuary/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    setStatus(response.ok ? "Preferences saved." : "Preferences could not be saved.");
  }
  const update = (key: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setProfile({ ...profile, [key]: event.target.value });
  return <form onSubmit={submit} className="grid max-w-2xl gap-5 sm:grid-cols-2">
    <label className="grid gap-2 text-sm font-semibold">Full name<input value={profile.fullName} onChange={update("fullName")} required maxLength={120} className="rounded-xl border border-stone-300 px-4 py-3 font-normal" /></label>
    <label className="grid gap-2 text-sm font-semibold">Mobile<input value={profile.mobile} onChange={update("mobile")} required maxLength={40} className="rounded-xl border border-stone-300 px-4 py-3 font-normal" /></label>
    <label className="grid gap-2 text-sm font-semibold">Country<input value={profile.country} onChange={update("country")} required maxLength={80} className="rounded-xl border border-stone-300 px-4 py-3 font-normal" /></label>
    <label className="grid gap-2 text-sm font-semibold">Preferred location<select value={profile.preferredLocation} onChange={update("preferredLocation")} className="rounded-xl border border-stone-300 px-4 py-3 font-normal"><option>No preference</option><option>Bangsar</option><option>SS2</option></select></label>
    <label className="grid gap-2 text-sm font-semibold">Contact preference<select value={profile.communicationPreference} onChange={update("communicationPreference")} className="rounded-xl border border-stone-300 px-4 py-3 font-normal"><option>Email</option><option>WhatsApp</option><option>Phone</option></select></label>
    <div className="flex items-end"><button className="min-h-12 rounded-full bg-deep-green px-6 font-semibold text-white">Save preferences</button></div><p role="status" className="text-sm text-warm-gray sm:col-span-2">{status}</p>
  </form>;
}
