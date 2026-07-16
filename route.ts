import { NextResponse } from "next/server";
import { lingDisclaimer } from "@/lib/content";

export async function POST() {
  return NextResponse.json({
    status: "placeholder",
    message:
      "OpenAI API-ready route. Add server-side OpenAI client here after OPENAI_API_KEY is configured.",
    disclaimer: lingDisclaimer,
  });
}
