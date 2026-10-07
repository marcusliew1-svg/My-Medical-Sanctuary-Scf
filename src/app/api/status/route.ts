import { NextResponse } from "next/server";
import { operationalRequestId } from "@/lib/operationalObservability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = operationalRequestId(request);
  return NextResponse.json(
    {
      status: "ok",
      service: "mms-web",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Request-Id": requestId,
      },
    },
  );
}
