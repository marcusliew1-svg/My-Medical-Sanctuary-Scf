import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { mmsCommercialDatabaseReadiness } from "@/lib/mmsCommercialDatabaseConfig";
import { partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";
import { partnerCommissionRuleStoreAvailable } from "@/lib/partnerCommissionRuleStore";
import { partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";
import { partnerHubStoreAvailable } from "@/lib/partnerHubStore";
import { partnerLeadRegistryStoreAvailable } from "@/lib/partnerLeadRegistryStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal MMS controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const database = mmsCommercialDatabaseReadiness();
  const stores = {
    leadRegistry: partnerLeadRegistryStoreAvailable(),
    commerce: partnerCommerceStoreAvailable(),
    commissionRules: partnerCommissionRuleStoreAvailable(),
    commissions: partnerCommissionStoreAvailable(),
    partnerHub: partnerHubStoreAvailable(),
  };
  const allStoresAvailable = Object.values(stores).every(Boolean);

  return NextResponse.json(
    {
      status: database.readyForAdapters && allStoresAvailable ? "ready" : "not_ready",
      database: {
        enabled: database.enabled,
        configured: database.configured,
        schema: database.schema,
        readyForAdapters: database.readyForAdapters,
        blockers: database.blockers,
      },
      stores,
      allStoresAvailable,
      migration: "database/migrations/0001_mms_commercial_foundation.sql",
      note:
        "Database credentials are never returned. Existing stores remain fail-closed until the migration is applied and transactional adapters are implemented and tested.",
    },
    { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } },
  );
}
