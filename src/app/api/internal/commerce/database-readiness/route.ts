import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { mmsCommercialDatabaseReadiness } from "@/lib/mmsCommercialDatabaseConfig";
import {
  MMS_COMMERCIAL_REQUIRED_MIGRATIONS,
  probeMmsCommercialDatabase,
} from "@/lib/mmsCommercialDatabaseProbe";
import { partnerCommerceStoreAvailable } from "@/lib/partnerCommerceStore";
import { partnerCommissionRuleStoreAvailable } from "@/lib/partnerCommissionRuleStore";
import { partnerCommissionStoreAvailable } from "@/lib/partnerCommissionStore";
import { partnerHubCsrfProviderAvailable } from "@/lib/partnerHubMutationSecurity";
import { partnerHubSessionProviderAvailable } from "@/lib/partnerHubSession";
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
  const structuralProbe = await probeMmsCommercialDatabase();
  const stores = {
    leadRegistry: partnerLeadRegistryStoreAvailable(),
    commerce: partnerCommerceStoreAvailable(),
    commissionRules: partnerCommissionRuleStoreAvailable(),
    commissions: partnerCommissionStoreAvailable(),
    partnerHub: partnerHubStoreAvailable(),
    partnerSessions: partnerHubSessionProviderAvailable(),
    partnerCsrf: partnerHubCsrfProviderAvailable(),
  };
  const allStoresAvailable = Object.values(stores).every(Boolean);
  const structurallyReady = structuralProbe.status === "ready";
  const ready = database.readyForAdapters && structurallyReady && allStoresAvailable;

  return NextResponse.json(
    {
      status: ready ? "ready" : "not_ready",
      database: {
        enabled: database.enabled,
        configured: database.configured,
        schema: database.schema,
        readyForAdapters: database.readyForAdapters,
        blockers: database.blockers,
      },
      structuralProbe,
      stores,
      allStoresAvailable,
      migrations: MMS_COMMERCIAL_REQUIRED_MIGRATIONS.map((file) => `database/migrations/${file}`),
      qaVerification: [
        "database/qa/001_partner_hub_fixture.sql",
        "database/qa/002_partner_hub_verify.sql",
      ],
      note:
        "Database credentials are never returned. Ready requires valid configuration, an operational MMS-only PostgreSQL client, all required schema objects and all commercial/Partner Hub stores to be available.",
    },
    { headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" } },
  );
}
