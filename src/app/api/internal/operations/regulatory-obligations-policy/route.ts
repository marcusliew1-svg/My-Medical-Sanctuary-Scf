import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  complianceCalendarRules,
  obligationEvidenceChecklist,
  obligationLifecycle,
} from "@/lib/regulatoryObligationsPolicy";
import { operationalLog, operationalRequestId } from "@/lib/operationalObservability";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = operationalRequestId(request);
  const headers = {
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    "X-Request-Id": requestId,
  };

  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", requestId }, { status: 503, headers });
  }

  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    operationalLog("warn", "regulatory_obligations_policy_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  operationalLog("info", "regulatory_obligations_policy_read", { requestId });

  return NextResponse.json({
    status: "ok",
    requestId,
    obligationLifecycle,
    obligationEvidenceChecklist,
    complianceCalendarRules,
    boundaries: {
      statutoryObligationsSeededByThisPhase: 0,
      licencesVerifiedByThisPhase: 0,
      regulatoryDeadlinesClaimedByThisPhase: 0,
      regulatorFilingsCompletedByThisPhase: 0,
      productionReminderAutomationConfiguredByThisPhase: false,
    },
  }, { headers });
}
