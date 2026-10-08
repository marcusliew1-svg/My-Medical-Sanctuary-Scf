import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { mmsCommercialDatabaseReadiness } from "@/lib/mmsCommercialDatabaseConfig";
import { probeMmsCommercialDatabase } from "@/lib/mmsCommercialDatabaseProbe";
import { getDeploymentEnvironment, mmsFeatureRules, featureFlagValue } from "@/lib/featureGates";
import { operationalLog, operationalRequestId } from "@/lib/operationalObservability";
import { zohoDayOneCommercialReadiness } from "@/lib/zohoCommercialConfiguration";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = operationalRequestId(request);
  const headers = {
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    "X-Request-Id": requestId,
  };

  if (!internalApiConfigured()) {
    operationalLog("warn", "readiness_unavailable", { requestId, reason: "internal_api_not_configured" });
    return NextResponse.json({ status: "unavailable", requestId }, { status: 503, headers });
  }

  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    operationalLog("warn", "readiness_unauthorized", { requestId });
    return NextResponse.json({ status: "unauthorized", requestId }, { status: 401, headers });
  }

  const databaseConfig = mmsCommercialDatabaseReadiness();
  const databaseProbe = await probeMmsCommercialDatabase();
  const zoho = zohoDayOneCommercialReadiness();
  const deploymentEnvironment = getDeploymentEnvironment();
  const features = Object.fromEntries(
    Object.entries(mmsFeatureRules).map(([name, rule]) => [
      name,
      {
        configuredOn: featureFlagValue(name as keyof typeof mmsFeatureRules),
        envVar: rule.envVar,
      },
    ]),
  );

  const databaseReady = databaseConfig.readyForAdapters && databaseProbe.status === "ready";
  // Database health alone does not authorize Day-1 MMS commercial operations.
  const ready = databaseReady && zoho.ready;

  const response = {
    status: ready ? "ready" : "degraded",
    requestId,
    environment: deploymentEnvironment,
    checks: {
      application: { status: "ready" },
      commercialDatabase: {
        status: databaseReady ? "ready" : "degraded",
        configured: databaseConfig.configured,
        enabled: databaseConfig.enabled,
        structuralStatus: databaseProbe.status,
      },
      zohoCommercial: {
        status: zoho.ready ? "configured" : "blocked",
        blockerCount: zoho.blockers.length,
      },
    },
    features,
    note: "Ready requires both a healthy commercial database and approved MMS Zoho configuration. This does not certify operator access or external clinical/regulatory approvals. No credentials, tokens, database URLs, SQL text or Zoho secret values are returned.",
  };

  operationalLog(ready ? "info" : "warn", "readiness_checked", {
    requestId,
    environment: deploymentEnvironment,
    status: response.status,
    databaseStatus: response.checks.commercialDatabase.status,
    zohoStatus: response.checks.zohoCommercial.status,
  });

  return NextResponse.json(response, { status: ready ? 200 : 503, headers });
}
