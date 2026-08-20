import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { syncPartnerRegistryFromCrm } from "@/lib/partnerRegistryPostgresSync";
import { getZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

export const dynamic = "force-dynamic";
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
    const result = await syncPartnerRegistryFromCrm({ crmRecordId: recordId, description, reconciliationActor: actor });
    if (result.status === "unavailable") {
      return NextResponse.json({ status: "registry_unavailable", message: result.reason }, { status: 503 });
    }
    if (result.status === "conflict") {
      return NextResponse.json({ status: "registry_conflict", message: result.reason }, { status: 409 });
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" },
    });
  } catch (error) {
    console.error("MMS Sales Partner registry reconciliation failed", {
      recordId,
      error: error instanceof Error ? error.message : "Unknown reconciliation error",
    });
    return NextResponse.json({ status: "error", message: "Unable to reconcile Sales Partner registry." }, { status: 502 });
  }
}
