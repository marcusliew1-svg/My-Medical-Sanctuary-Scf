import { NextResponse } from "next/server";
import { getPartnerHubReadiness, isPartnerHubProductionReady } from "@/lib/partnerHubReadiness";

export async function GET() {
  return NextResponse.json({
    ok: true,
    productionReady: isPartnerHubProductionReady(),
    checks: getPartnerHubReadiness(),
    note: "This endpoint exposes configuration state only. It never returns credentials or secret values.",
  });
}
