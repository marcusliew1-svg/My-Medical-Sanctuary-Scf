import { NextResponse } from "next/server";
import { hasPartnerHubPermission } from "@/lib/partnerHubAccess";
import { requirePartnerSession } from "@/lib/partnerHubAuth";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const auth = requirePartnerSession(request, ["finance", "management"]);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  if (!hasPartnerHubPermission(auth.session.role, "payment:verify")) {
    return NextResponse.json({ ok: false, error: "Payment verification permission is required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });

  const applicationId = clean(body.applicationId);
  const paymentReference = clean(body.paymentReference);
  const amountMinor = Number(body.amountMinor);
  if (!applicationId || !paymentReference || !Number.isInteger(amountMinor) || amountMinor <= 0) {
    return NextResponse.json({ ok: false, error: "Application, payment reference and positive amount are required" }, { status: 422 });
  }

  return NextResponse.json({
    ok: true,
    mode: "preview",
    event: {
      applicationId,
      status: "Payment verified",
      paymentReference,
      amountMinor,
      verifiedBy: auth.session.userId,
      verifiedAt: new Date().toISOString(),
    },
    commissionStatus: "Pending",
    nextAction: "Cooling-off and compliance clearance must complete before commission can qualify",
  });
}
