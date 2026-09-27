import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { lingApprovedPreviewCorpus } from "@/data/lingApprovedPreviewCorpus";
import { answerLingConcierge } from "@/lib/lingConcierge";
import { requireOperatorRead } from "@/lib/operatorReadSecurity";
import { previewPilotFeatureReady } from "@/lib/crmPreviewRuntime";

export const dynamic = "force-dynamic";
const TOPICS = new Set(lingApprovedPreviewCorpus.map((record) => record.topic));

export async function POST(request: NextRequest) {
  const operator = await requireOperatorRead(request, { roles: ["operations", "auditor"] });
  if (operator.status !== "ok") {
    const status = operator.status === "unavailable" ? 503 : operator.status === "unauthorized" ? 401 : 403;
    return NextResponse.json({ status: operator.status, message: operator.reason }, { status });
  }
  if (!previewPilotFeatureReady("lingPublicConcierge")) return NextResponse.json({ status: "unavailable", message: "Preview Ling approved-content pilot is disabled." }, { status: 404 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 500) : "";
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  if (!question || !TOPICS.has(topic)) return NextResponse.json({ status: "invalid", message: "A valid approved-content topic and question are required." }, { status: 400 });
  return NextResponse.json({ status: "ok", response: answerLingConcierge({ question, topic, locale: "en", records: lingApprovedPreviewCorpus }) });
}
