import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { internalApiConfigured, isValidInternalBearerToken } from "@/lib/internalApiAuth";
import { runMmsCommercialDatabaseSmokeTest } from "@/lib/mmsCommercialDatabaseSmokeTest";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!internalApiConfigured()) {
    return NextResponse.json({ status: "unavailable", message: "Internal MMS controls are not configured." }, { status: 503 });
  }
  if (!isValidInternalBearerToken(request.headers.get("authorization"))) {
    return NextResponse.json({ status: "unauthorized", message: "Unauthorized." }, { status: 401 });
  }

  const result = await runMmsCommercialDatabaseSmokeTest();
  const httpStatus = result.status === "ready" ? 200 : result.status === "unavailable" ? 503 : 409;
  return NextResponse.json(result, {
    status: httpStatus,
    headers: { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" },
  });
}
