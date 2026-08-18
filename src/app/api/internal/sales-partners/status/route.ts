import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { parsePartnerCrmState } from "@/lib/partnerCrmState";
import { getZohoRecord, zohoCrmConfigured } from "@/lib/zohoCrm";

function cleanString(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal Sales Partner controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }
  if (!zohoCrmConfigured() || process.env.MMS_CRM_DEBUG === "true") {
    return NextResponse.json({ status: "unavailable", message: "CRM partner controls are still in integration test mode." }, { status: 503 });
  }

  const recordId = cleanString(request.nextUrl.searchParams.get("recordId"), 40);
  if (!/^\d+$/.test(recordId)) {
    return NextResponse.json({ status: "invalid", message: "A valid CRM recordId is required." }, { status: 400 });
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

    return NextResponse.json({
      status: "ok",
      recordId,
      partner: state,
    });
  } catch (error) {
    console.error("MMS internal Sales Partner status read failed", {
      recordId,
      error: error instanceof Error ? error.message : "Unknown status read error",
    });
    return NextResponse.json({ status: "error", message: "Unable to read Sales Partner status." }, { status: 502 });
  }
}
