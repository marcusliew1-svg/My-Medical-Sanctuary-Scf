import { NextResponse } from "next/server";
import { hasPartnerHubPermission } from "@/lib/partnerHubAccess";
import { requirePartnerSession } from "@/lib/partnerHubAuth";
import { createPartnerLeadInZoho, searchPartnerLeadInZoho } from "@/lib/partnerHubZoho";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function splitName(fullName: string) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: undefined, lastName: parts[0] };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

export async function POST(request: Request) {
  const auth = requirePartnerSession(request, ["partner"]);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  if (!hasPartnerHubPermission(auth.session.role, "lead:create")) {
    return NextResponse.json({ ok: false, error: "Partner is not permitted to register leads" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });

  // In demo mode certification is simulated. Production must resolve this from the authenticated partner record.
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

  const duplicateResult = await searchPartnerLeadInZoho({ email: email || undefined, mobile }).catch(() => null);
  if (!duplicateResult) {
    return NextResponse.json({ ok: false, error: "Duplicate check could not be completed" }, { status: 503 });
  }
  if (duplicateResult.matches.length > 0) {
    return NextResponse.json({ ok: false, duplicate: true, error: "A matching CRM lead already exists. Sales Admin review is required before ownership can be granted." }, { status: 409 });
  }

  const { firstName, lastName } = splitName(fullName);
  const partnerLeadId = `PH-${Date.now()}`;
  const packageInterest = clean(body.packageInterest) || "Not sure yet";
  const source = clean(body.source) || process.env.MMS_PARTNER_LEAD_SOURCE || "MMS Partner Hub";
  const result = await createPartnerLeadInZoho({
    First_Name: firstName,
    Last_Name: lastName,
    Email: email || undefined,
    Mobile: mobile,
    Lead_Source: source,
    Description: clean(body.notes) || undefined,
    Partner_Code: clean(body.partnerCode) || undefined,
    Partner_Lead_ID: partnerLeadId,
    Package_Interest: packageInterest,
  }).catch(() => null);

  if (!result) return NextResponse.json({ ok: false, error: "Lead could not be prepared for CRM submission" }, { status: 503 });

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    leadId: partnerLeadId,
    crmCreated: result.created,
    ownershipStatus: result.created ? "pending_event_commit" : "preview_only",
    nextAction: result.created
      ? "Persist the ownership event in the MMS commercial source of truth"
      : "Mock mode: no CRM record was created",
  });
}
