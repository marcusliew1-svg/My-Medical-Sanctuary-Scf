import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import {
  metricEvidenceChecklist,
  metricGovernanceRules,
} from "@/lib/metricGovernancePolicy";
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
    operationalLog("warn", "metric_governance_policy_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  operationalLog("info", "metric_governance_policy_read", { requestId });

  return NextResponse.json({
    status: "ok",
    requestId,
    metricGovernanceRules,
    metricEvidenceChecklist,
    boundaries: {
      metricsActivatedByThisPhase: 0,
      kpiTargetsApprovedByThisPhase: 0,
      metricObservationsCreatedByThisPhase: 0,
      dashboardsReclassifiedGreenByThisPhase: false,
      productionMonitoringConfiguredByThisPhase: false,
    },
  }, { headers });
}
