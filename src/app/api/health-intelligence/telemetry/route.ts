import { NextResponse } from "next/server";

const events = new Set([
  "medicine_search",
  "product_confirmed",
  "comparison_viewed",
  "generic_search",
  "cost_review_started",
  "cost_review_completed",
  "professional_review_cta_clicked",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { event?: string };
    if (!body.event || !events.has(body.event))
      return NextResponse.json({ status: "invalid" }, { status: 400 });
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
}
