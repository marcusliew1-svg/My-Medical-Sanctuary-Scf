import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { parsePartnerCrmState } from "@/lib/partnerCrmState";
import { partnerIdAllocator, validateIssuedPartnerId } from "@/lib/partnerIdAllocator";
import { buildPartnerIdIssuanceDescription } from "@/lib/partnerIdIssuance";
import { canIssuePermanentPartnerId } from "@/lib/salesPartnerPolicy";
import { getZohoRecord, updateZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

const MAX_BODY_BYTES = 4_000;

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

  const recordId = cleanString(body.recordId, 40);
  const actor = cleanString(body.actor, 160);
  if (!/^\d+$/.test(recordId) || !actor) {
    return NextResponse.json({ status: "invalid", message: "A valid recordId and actor are required." }, { status: 400 });
  }

  const leadsModule = process.env.ZOHO_LEADS_MODULE_API_NAME || "Leads";

  try {
    const crmRecord = await getZohoRecord(leadsModule, recordId);
    if (cleanString(crmRecord.MMS_Inquiry_Type, 120) !== "Sales Partner Applicant") {
      return NextResponse.json({ status: "invalid_record", message: "The CRM record is not an MMS Sales Partner applicant." }, { status: 409 });
    }

    const description = cleanString(crmRecord.Description, 32_000);
    const state = parsePartnerCrmState(description);
    if (!state.stage) {
      return NextResponse.json({ status: "manual_review", message: "The CRM record has no reliable Sales Partner stage." }, { status: 409 });
    }

    if (state.partnerId) {
      return NextResponse.json({
        status: "already_issued",
        recordId,
        partnerId: state.partnerId,
      });
    }

    if (!canIssuePermanentPartnerId(state.stage, state.checklist)) {
      return NextResponse.json(
        { status: "not_eligible", message: "Approval and KYC / due diligence must be complete before a permanent Partner ID can be issued." },
        { status: 409 },
      );
    }

    const allocationStage = state.stage as "Approved" | "Agreement Pending" | "Training";
    const allocation = await partnerIdAllocator().issue(recordId, allocationStage);
    if (allocation.status !== "issued") {
      return NextResponse.json(
        { status: "allocator_unavailable", message: allocation.reason },
        { status: 503 },
      );
    }

    const partnerId = validateIssuedPartnerId(allocation.partnerId);
    const issuedAt = new Date().toISOString();
    const nextDescription = buildPartnerIdIssuanceDescription(description, {
      partnerId,
      applicantRecordId: recordId,
      allocationReference: allocation.allocationReference,
      allocatorBackend: allocation.backend,
      actor,
      issuedAt,
    });

    await updateZohoRecord(leadsModule, recordId, { Description: nextDescription });

    return NextResponse.json({
      status: "issued",
      recordId,
      partnerId,
      allocationReference: allocation.allocationReference,
      issuedAt,
    });
  } catch (error) {
    console.error("MMS permanent Partner ID issuance failed", {
      recordId,
      error: error instanceof Error ? error.message : "Unknown Partner ID issuance error",
    });
    return NextResponse.json({ status: "error", message: "Unable to issue permanent Partner ID." }, { status: 502 });
  }
}
