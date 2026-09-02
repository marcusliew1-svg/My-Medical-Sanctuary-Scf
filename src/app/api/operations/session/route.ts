import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authenticateOperatorRequest } from "@/lib/operatorSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authenticateOperatorRequest(request);
  if (auth.status === "unavailable") return NextResponse.json({ status: "unavailable", message: auth.reason }, { status: 503 });
  if (auth.status !== "authenticated") return NextResponse.json({ status: "unauthenticated", message: auth.reason }, { status: 401 });

  return NextResponse.json({
    status: "authenticated",
    operator: {
      operatorId: auth.claims.operatorId,
      roles: auth.claims.roles,
      issuedAt: auth.claims.issuedAt,
      expiresAt: auth.claims.expiresAt,
      stepUpAt: auth.claims.stepUpAt || null,
      authenticationMethod: auth.claims.authenticationMethod,
    },
  }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
