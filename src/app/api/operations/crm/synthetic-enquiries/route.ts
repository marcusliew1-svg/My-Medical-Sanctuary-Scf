import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSyntheticCrmEnquiry, syntheticSourceRequestId } from "@/lib/crmOperationsStore";
import { requireOperatorMutation } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const operator = await requireOperatorMutation(request, { roles: ["operations"] });
  if (operator.status !== "ok") {
    const status = operator.status === "unavailable" ? 503 : operator.status === "unauthorized" ? 401 : 403;
    return NextResponse.json({ status: operator.status, message: operator.reason }, { status });
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 320) : "";
  const partnerId = typeof body?.partnerId === "string" ? body.partnerId.trim().slice(0, 100) : undefined;
  if (!name.startsWith("Synthetic ") || !email.endsWith("@example.invalid")) {
    return NextResponse.json({ status: "invalid", message: "Preview pilot accepts clearly labelled synthetic identities only." }, { status: 400 });
  }
  try {
    const result = await createSyntheticCrmEnquiry({
      sourceRequestId: typeof body?.sourceRequestId === "string" ? body.sourceRequestId : syntheticSourceRequestId(),
      actorId: operator.actor,
      lead: {
        name, email, source: "Synthetic Preview T6.13", partnerId, referralCode: partnerId ? "SYNTH-PREVIEW" : undefined,
        broadInterestCategory: "Synthetic general programme information", preferredContactChannel: "email",
        leadStatus: "New Enquiry", nextAction: "Acknowledge synthetic enquiry",
        contactConsentTimestamp: new Date().toISOString(), contactConsentVersion: "SYNTH-T6.13-v1",
        marketingConsent: false, sourceConsentEvidence: "Authenticated operator synthetic Preview fixture", doNotContact: false,
      },
    });
    return NextResponse.json({ status: "ok", ...result }, { status: result.replayed ? 200 : 201, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ status: "error", message: "Synthetic Preview enquiry could not be created safely." }, { status: 409 });
  }
}
