import Link from "next/link";
import { PartnerHubSignOutButton } from "@/components/PartnerHubSignOutButton";

const links = [
  ["Dashboard", "/partner-hub"],
  ["Leads", "/partner-hub/leads"],
  ["Academy", "/partner-hub/academy"],
  ["Presentation Centre", "/partner-hub/presentation-centre"],
  ["Commission Wallet", "/partner-hub/commission-wallet"],
  ["Referral Tools", "/partner-hub/referral"],
] as const;

export default function PartnerHubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <nav aria-label="Partner Hub" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {label}
            </Link>
          ))}
          <PartnerHubSignOutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
