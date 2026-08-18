import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { parsePartnerCrmState } from "@/lib/partnerCrmState";
import {
  PARTNER_LEAD_CONSENT_VERSION,
  assertCommercialLeadPayloadOnly,
  registerPartnerLead,
} from "@/lib/partnerLeadRegistry";
import { partnerLeadRegistryStore } from "@/lib/partnerLeadRegistryStore";
import { getZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

const MAX_BODY_BYTES = 12_000;

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!zohoCrmConfigured() || process.env.MMS_CRM_DEBUG === "true") {
    return NextResponse.json({ status: "unavailable", message: "CRM partner controls are still in integration test mode." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid", message: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ status: "invalid", message: "A JSON request body is required." }, { status: 400 });
  }

  try {
    assertCommercialLeadPayloadOnly(body);
  } catch {
    return NextResponse.json({ status: "invalid", message: "Clinical information is not permitted in the Partner Lead Registry." }, { status: 400 });
  }

  const partnerRecordId = cleanString(body.partnerRecordId, 40);
  const leadId = cleanString(body.leadId, 80);
  const partnerId = cleanString(body.partnerId, 40);
  const fullName = cleanString(body.fullName, 160);
  const email = cleanString(body.email, 254);
  const phone = cleanString(body.phone, 50);
  const source = cleanString(body.source, 120);
  const campaign = cleanString(body.campaign, 120);
  const consentAccepted = body.consentAccepted === true;
  const consentVersion = cleanString(body.consentVersion, 120);
  const consentCapturedAt = cleanString(body.consentCapturedAt, 80);

  if (!/^\d+$/.test(partnerRecordId) || !leadId || !partnerId || !fullName) {
    return NextResponse.json({ status: "invalid", message: "Required Partner Lead registration fields are missing or invalid." }, { status: 400 });
  }

  const leadsModule = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";

  try {
    const partnerRecord = await getZohoRecord(leadsModule, partnerRecordId);
    if (cleanString(partnerRecord.MMS_Inquiry_Type, 120) !== "Sales Partner Applicant") {
      return NextResponse.json({ status: "invalid_partner", message: "The CRM record is not an MMS Sales Partner record." }, { status: 409 });
    }

    const state = parsePartnerCrmState(cleanString(partnerRecord.Description, 32_000));
    if (state.stage !== "Active" || !state.sellingEnabled || !state.partnerId || state.partnerId !== partnerId.toUpperCase()) {
      return NextResponse.json({ status: "partner_not_active", message: "Only an Active MMS Sales Partner may register a lead." }, { status: 409 });
    }

    const registeredAt = new Date().toISOString();
    const registration = registerPartnerLead({
      leadId,
      partnerId: state.partnerId,
      contact: { fullName, email: email || undefined, phone: phone || undefined },
      source: source || undefined,
      campaign: campaign || undefined,
      consentAccepted,
      consentVersion,
      consentCapturedAt,
      registeredAt,
    });

    const store = partnerLeadRegistryStore();
    const duplicates = await store.findPotentialDuplicates(registration.contact);
    if (duplicates.status === "unavailable") {
      return NextResponse.json(
        {
          status: "registry_unavailable",
          message: duplicates.reason,
          requiredConsentVersion: PARTNER_LEAD_CONSENT_VERSION,
        },
        { status: 503 },
      );
    }
    if (duplicates.status === "conflict") {
      return NextResponse.json({ status: "duplicate_check_conflict", message: duplicates.reason }, { status: 409 });
    }
    if (duplicates.value.length > 0) {
      return NextResponse.json(
        { status: "possible_duplicate", message: "Potential matching lead records require duplicate review.", matchedLeadIds: duplicates.value },
        { status: 409 },
      );
    }

    const created = await store.create(registration);
    if (created.status === "unavailable") {
      return NextResponse.json({ status: "registry_unavailable", message: created.reason }, { status: 503 });
    }
    if (created.status === "conflict") {
      return NextResponse.json({ status: "registration_conflict", message: created.reason }, { status: 409 });
    }

    return NextResponse.json({
      status: "registered",
      leadId: created.value.lead.leadId,
      partnerId: created.value.lead.currentPartnerId,
      duplicateStatus: created.value.lead.duplicateStatus,
      registeredAt: created.value.lead.registeredAt,
    });
  } catch (error) {
    console.error("MMS Partner Lead registration failed", {
      partnerRecordId,
      leadId,
      error: error instanceof Error ? error.message : "Unknown Partner Lead registration error",
    });
    return NextResponse.json({ status: "error", message: "Unable to register Partner Lead." }, { status: 502 });
  }
}
