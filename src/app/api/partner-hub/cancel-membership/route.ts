import { NextResponse } from "next/server";
import { hasPartnerHubPermission } from "@/lib/partnerHubAccess";
import { requirePartnerSession } from "@/lib/partnerHubAuth";
import { buildCancellationReversal } from "@/lib/commissionLedger";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const auth = requirePartnerSession(request, ["finance", "compliance", "management"]);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  if (!hasPartnerHubPermission(auth.session.role, "commission:reverse")) {
    return NextResponse.json({ ok: false, error: "Commission reversal permission is required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });

  const applicationId = clean(body.applicationId);
  const commissionReference = clean(body.commissionReference);
  const commissionAmount = Number(body.commissionAmount);
  const reason = clean(body.reason) || "Membership cancelled or refunded";
  const commissionPaid = Boolean(body.commissionPaid);

  if (!applicationId || !commissionReference || !Number.isFinite(commissionAmount) || commissionAmount < 0) {
    return NextResponse.json({ ok: false, error: "Valid application, commission reference and commission amount are required" }, { status: 422 });
  }

  const cancelledAt = new Date().toISOString();
  const ledgerEntries = buildCancellationReversal({
    commissionReference,
    commissionPaid,
    commissionAmount,
    cancelledAt,
  });

  return NextResponse.json({
    ok: true,
    mode: "preview",
    application: {
      applicationId,
      status: "Cancelled",
      reason,
      cancelledAt,
      approvedBy: auth.session.userId,
    },
    commission: {
      status: "Reversed",
      entitlement: 0,
      recoveryRequired: commissionPaid,
      ledgerEntries,
    },
    rule: "Cancelled or refunded membership earns zero commission. If already paid, the full commission attributable to that sale is recoverable.",
  });
}
