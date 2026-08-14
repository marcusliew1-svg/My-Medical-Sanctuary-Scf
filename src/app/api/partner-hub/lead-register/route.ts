import { NextResponse } from "next/server";
import { hasPartnerHubPermission, type PartnerHubRole } from "@/lib/partnerHubAccess";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });

  const role = clean(body.role) as PartnerHubRole;
  if (!role || !hasPartnerHubPermission(role, "lead:create")) {
    return NextResponse.json({ ok: false, error: "Partner is not permitted to register leads" }, { status: 403 });
  }

  const partnerCertified = Boolean(body.partnerCertified);
  const partnerCodeActive = Boolean(body.partnerCodeActive);
  if (!partnerCertified || !partnerCodeActive) {
    return NextResponse.json({ ok: false, error: "Certification and an active Partner Code are required" }, { status: 403 });
  }

  const fullName = clean(body.fullName);
  const mobile = clean(body.mobile);
  const email = clean(body.email);
  if (fullName.length < 2 || mobile.length < 7) {
    return NextResponse.json({ ok: false, error: "Full name and valid mobile number are required" }, { status: 422 });
  }
  if (email && !emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Email format is invalid" }, { status: 422 });
  }

  // Persistence and duplicate checking are intentionally behind a repository adapter.
  // Until the MMS CRM/database adapter is connected, this endpoint returns a safe preview result only.
  return NextResponse.json({
    ok: true,
    mode: "preview",
    duplicateCheckRequired: true,
    proposedLead: {
      fullName,
      mobile,
      email: email || undefined,
      packageInterest: clean(body.packageInterest) || "Not sure yet",
      source: clean(body.source) || "MMS Partner Hub",
    },
    nextAction: "Run repository duplicate check before granting ownership",
  });
}
