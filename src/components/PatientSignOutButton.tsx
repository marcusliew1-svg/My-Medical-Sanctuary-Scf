"use client";
export function PatientSignOutButton() { return <form action="/api/patient-auth/logout" method="post"><button className="whitespace-nowrap rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:border-gold">Sign out</button></form>; }
