import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PatientProfileForm } from "@/components/PatientProfileForm";
import { MMS_PATIENT_ACCESS_TOKEN_COOKIE } from "@/lib/patientIdentity";
import { authenticatePatientToken } from "@/lib/patientRequestAuth";
export default async function Page() { const store = await cookies(); const auth = await authenticatePatientToken(store.get(MMS_PATIENT_ACCESS_TOKEN_COOKIE)?.value || ""); if (auth.status !== "authenticated") redirect("/login?next=/my-sanctuary/profile"); return <main className="mx-auto max-w-5xl px-4 py-12"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">My Sanctuary</p><h1 className="mt-3 font-serif text-4xl text-navy">Profile and contact preferences</h1><p className="mt-4 max-w-2xl leading-7 text-warm-gray">Keep administrative contact details current. Do not enter medical information.</p><div className="mt-8 bg-white p-6 md:p-8"><PatientProfileForm initial={auth.profile} /></div></main>; }
