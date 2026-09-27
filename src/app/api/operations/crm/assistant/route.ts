import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  draftAdministrativeFollowUp,
  overdueAdministrativeWarning,
  refuseUnsafeAiOperationsRequest,
  suggestAdministrativeNextAction,
  summarizeAdministrativeEnquiry,
} from "@/lib/aiOperations";
import { getCrmLeadForAssistant } from "@/lib/crmOperationsStore";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";
import { previewPilotFeatureReady } from "@/lib/crmPreviewRuntime";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations"] });
  if (operator.status !== "ok") {
    const status = operator.status === "unavailable" ? 503 : operator.status === "unauthorized" ? 401 : 403;
    return NextResponse.json({ status: operator.status, message: operator.reason }, { status });
  }
  if (!previewPilotFeatureReady("aiOperationsAssistant")) return NextResponse.json({ status: "unavailable", message: "Preview AI operations assistance is disabled." }, { status: 404 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim().slice(0, 500) : "";
  const enquiryId = typeof body?.enquiryId === "string" ? body.enquiryId.trim() : "";
  const mode = typeof body?.mode === "string" ? body.mode : "next_action";
  if (!prompt || !/^MMSE-[a-f0-9]{32}$/.test(enquiryId) || !["summary", "follow_up_draft", "next_action", "overdue_warning"].includes(mode)) {
    return NextResponse.json({ status: "invalid", message: "A selected synthetic enquiry and valid administrative request are required." }, { status: 400 });
  }
  const refusal = refuseUnsafeAiOperationsRequest(prompt);
  if (refusal) return NextResponse.json({ status: "ok", output: refusal });
  try {
    const lead = await getCrmLeadForAssistant(enquiryId);
    if (!lead) return NextResponse.json({ status: "not_found", message: "Synthetic enquiry was not found." }, { status: 404 });
    const output = mode === "summary" ? summarizeAdministrativeEnquiry(lead)
      : mode === "follow_up_draft" ? draftAdministrativeFollowUp(lead)
      : mode === "overdue_warning" ? overdueAdministrativeWarning(lead) || suggestAdministrativeNextAction(lead)
      : suggestAdministrativeNextAction(lead);
    return NextResponse.json({ status: "ok", output }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ status: "unavailable", message: "Preview AI operations advisory is unavailable." }, { status: 503 });
  }
}
