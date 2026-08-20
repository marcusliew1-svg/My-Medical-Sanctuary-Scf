import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { partnerHubStore, partnerHubStoreAvailable } from "@/lib/partnerHubStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authorizePartnerHubCapability(request, "ACCESS_PRESENTATION_CENTRE");
  if (auth.status === "unauthenticated") return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  if (auth.status === "forbidden") return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  if (auth.status === "not_found") return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  if (auth.status === "conflict") return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  if (auth.status !== "authorized") return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });

  if (!partnerHubStoreAvailable()) {
    return NextResponse.json({ status: "hub_unavailable", message: "Partner Presentation Centre store is not configured." }, { status: 503 });
  }

  const result = await partnerHubStore().listPresentationAssets(auth.partnerId);
  if (result.status === "unavailable") return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  if (result.status === "conflict") return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });

  const now = Date.now();
  const assets = result.value.filter((asset) => {
    const effective = Date.parse(asset.effectiveFrom);
    const expiry = asset.expiresAt ? Date.parse(asset.expiresAt) : Number.POSITIVE_INFINITY;
    return Number.isFinite(effective) && effective <= now && expiry > now;
  });

  return NextResponse.json(
    { status: "ok", assets },
    { headers: { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" } },
  );
}
