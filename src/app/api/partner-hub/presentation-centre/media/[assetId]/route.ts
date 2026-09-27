import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authorizePartnerHubCapability } from "@/lib/partnerHubAuthorization";
import { partnerHubStore, partnerHubStoreAvailable } from "@/lib/partnerHubStore";
import { createPartnerMediaSignedUrl, parsePartnerMediaReference } from "@/lib/partnerMediaStorage";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { assetId: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await authorizePartnerHubCapability(request, "ACCESS_PRESENTATION_CENTRE");
  if (auth.status === "unauthenticated") {
    return NextResponse.json({ status: "unauthorized", message: "Partner authentication is required." }, { status: 401 });
  }
  if (auth.status === "forbidden") {
    return NextResponse.json({ status: "forbidden", message: auth.reason }, { status: 403 });
  }
  if (auth.status === "not_found") {
    return NextResponse.json({ status: "not_found", message: auth.reason }, { status: 404 });
  }
  if (auth.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: auth.reason }, { status: 409 });
  }
  if (auth.status !== "authorized") {
    return NextResponse.json({ status: "hub_unavailable", message: auth.reason }, { status: 503 });
  }
  if (!partnerHubStoreAvailable()) {
    return NextResponse.json({ status: "hub_unavailable", message: "Partner Presentation Centre store is not configured." }, { status: 503 });
  }

  const { assetId } = context.params;
  if (!/^[0-9a-f-]{36}$/i.test(assetId)) {
    return NextResponse.json({ status: "not_found", message: "Partner material was not found." }, { status: 404 });
  }

  const result = await partnerHubStore().listPresentationAssets(auth.partnerId);
  if (result.status === "unavailable") {
    return NextResponse.json({ status: "hub_unavailable", message: result.reason }, { status: 503 });
  }
  if (result.status === "conflict") {
    return NextResponse.json({ status: "conflict", message: result.reason }, { status: 409 });
  }

  const now = Date.now();
  const asset = result.value.find((candidate) => {
    if (candidate.assetId !== assetId) return false;
    const effective = Date.parse(candidate.effectiveFrom);
    const expiry = candidate.expiresAt ? Date.parse(candidate.expiresAt) : Number.POSITIVE_INFINITY;
    return Number.isFinite(effective) && effective <= now && expiry > now;
  });

  if (!asset) {
    return NextResponse.json({ status: "not_found", message: "Partner material was not found." }, { status: 404 });
  }

  const reference = parsePartnerMediaReference(asset.contentUrl);
  if (!reference) {
    return NextResponse.json({ status: "not_private_media", message: "This material does not use private media delivery." }, { status: 409 });
  }

  try {
    const signedUrl = await createPartnerMediaSignedUrl(reference, 300);
    return NextResponse.redirect(signedUrl, 302);
  } catch {
    console.error("MMS private partner media signing failed");
    return NextResponse.json(
      { status: "media_unavailable", message: "Private partner material is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  }
}
