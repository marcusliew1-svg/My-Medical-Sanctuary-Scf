import { NextResponse } from "next/server";
import { publicHealthIntelligenceReadModel } from "@/lib/healthIntelligence/publicReadModel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await publicHealthIntelligenceReadModel();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      {
        status: "unavailable",
        message: "Health Intelligence is not available.",
      },
      { status: 503 },
    );
  }
}
