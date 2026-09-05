import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MMS Operations",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/operations", label: "Dashboard" },
  { href: "/operations/applications", label: "Applications" },
  { href: "/operations/finance", label: "Finance" },
  { href: "/operations/memberships", label: "Memberships" },
  { href: "/operations/commissions", label: "Commissions" },
];

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">My Medical Sanctuary</div>
            <div className="mt-1 text-lg font-semibold">Operations Console</div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950">{item.label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
