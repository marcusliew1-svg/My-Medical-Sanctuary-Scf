import { NextResponse } from "next/server";
import { hasPartnerHubPermission } from "@/lib/partnerHubAccess";
import { requirePartnerSession } from "@/lib/partnerHubAuth";

const allowedPackages = new Set(["Ascend", "Evolve", "Eterna", "Pinnacle"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const auth = requirePartnerSession(request, ["partner"]);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  if (!hasPartnerHubPermission(auth.session.role, "application:create")) {
    return NextResponse.json({ ok: false, error: "Partner is not permitted to submit applications" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });

  // Demo-only simulation. Production must resolve these values from the authenticated Partner record.
  if (!body.partnerCertified || !body.partnerCodeActive) {
    return NextResponse.json({ ok: false, error: "Certified status and active Partner Code are required" }, { status: 403 });
  }

  const leadId = clean(body.leadId);
  const packageName = clean(body.packageName);
  if (!leadId || !allowedPackages.has(packageName)) {
    return NextResponse.json({ ok: false, error: "Valid lead and package are required" }, { status: 422 });
  }

  if (body.containsClinicalData) {
    return NextResponse.json({ ok: false, error: "Clinical or medical records must not be submitted through the Partner Hub" }, { status: 422 });
  }

  return NextResponse.json({
    ok: true,
    mode: "preview",
    application: {
      id: `APP-${Date.now()}`,
      leadId,
      partnerId: auth.session.partnerId,
      packageName,
      status: "Submitted",
      commissionStatus: "Pending",
    },
    controls: [
      "MMS verifies payment directly",
      "Cooling-off must complete",
      "Compliance clearance is required",
      "Cancellation or refund results in zero commission",
    ],
  });
}
