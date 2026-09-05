import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PartnerHubSignOutButton } from "@/components/PartnerHubSignOutButton";
import { MMS_PARTNER_ACCESS_TOKEN_COOKIE } from "@/lib/partnerIdentity";
import { authenticatePartnerHubTokens } from "@/lib/partnerHubRequestAuth";
import { MMS_PARTNER_SESSION_COOKIE } from "@/lib/partnerHubSession";

const links = [
  ["Dashboard", "/partner-hub"],
  ["Leads", "/partner-hub/leads"],
  ["Applications", "/partner-hub/commercial-status"],
  ["Academy", "/partner-hub/academy"],
  ["Presentation Centre", "/partner-hub/presentation-centre"],
  ["Commission Wallet", "/partner-hub/commission-wallet"],
  ["Referral Tools", "/partner-hub/referral"],
] as const;

export default async function PartnerHubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const auth = await authenticatePartnerHubTokens(
    cookieStore.get(MMS_PARTNER_SESSION_COOKIE)?.value || "",
    cookieStore.get(MMS_PARTNER_ACCESS_TOKEN_COOKIE)?.value || "",
  );
  if (auth.status !== "authenticated") {
    redirect(`/partner-login?next=/partner-hub${auth.status === "unavailable" ? "&error=auth_unavailable" : ""}`);
  }
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
