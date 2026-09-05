import Link from "next/link";
import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { PatientSignOutButton } from "@/components/PatientSignOutButton";
import { MMS_PATIENT_ACCESS_TOKEN_COOKIE } from "@/lib/patientIdentity";
import { authenticatePatientToken } from "@/lib/patientRequestAuth";

const links = [["Overview", "/my-sanctuary"], ["Bookings", "/my-sanctuary/bookings"], ["Programme", "/my-sanctuary/programme"], ["Profile", "/my-sanctuary/profile"], ["Security", "/my-sanctuary/security"]] as const;
export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  const auth = await authenticatePatientToken(store.get(MMS_PATIENT_ACCESS_TOKEN_COOKIE)?.value || "");
  if (auth.status === "forbidden") forbidden();
  if (auth.status !== "authenticated") redirect(`/login?next=/my-sanctuary${auth.status === "unavailable" ? "&error=auth_unavailable" : ""}`);
  return <div className="min-h-screen bg-warm-white pt-28"><div className="border-y border-stone-200 bg-white"><nav aria-label="My Sanctuary" className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">{links.map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-navy hover:bg-ivory">{label}</Link>)}<PatientSignOutButton /></nav></div>{children}</div>;
}
