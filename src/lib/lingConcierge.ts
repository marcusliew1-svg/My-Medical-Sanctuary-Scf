import { aiOperationsSafetyCategory } from "@/lib/aiOperations";
import {
  citeKnowledgeRecord,
  publicApprovedKnowledge,
  type ApprovedKnowledgeRecord,
} from "@/lib/approvedKnowledgeBase";

export type LingConciergeResponse = {
  status: "answered" | "handoff" | "refused" | "unavailable";
  answer: string;
  contentReferences: string[];
  requiresHumanHandoff: boolean;
};

export function answerLingConcierge(input: {
  question: string;
  topic: string;
  locale: string;
  records: readonly ApprovedKnowledgeRecord[];
  now?: string;
}): LingConciergeResponse {
  const safety = aiOperationsSafetyCategory(input.question);
  if (safety === "emergency_refusal") {
    return {
      status: "refused",
      answer: "I cannot assess urgent clinical issues. Please use the approved emergency or clinical pathway now; do not wait for website support.",
      contentReferences: [],
      requiresHumanHandoff: true,
    };
  }
  if (safety === "clinical_refusal") {
    return {
      status: "refused",
      answer: "I can explain approved MMS information, but I cannot diagnose, recommend treatment, interpret results or decide suitability. A qualified clinician must help with that question.",
      contentReferences: [],
      requiresHumanHandoff: true,
    };
  }

  const approved = publicApprovedKnowledge(input.records, input);
  if (!approved.length) {
    return {
      status: "handoff",
      answer: "I do not have approved information for that question. A human team member can help with administrative information.",
      contentReferences: [],
      requiresHumanHandoff: true,
    };
  }

  const record = approved[0];
  if (record.availability === "planned") {
    return {
      status: "unavailable",
      answer: `${record.body} This service is planned and is not currently available through MMS.`,
      contentReferences: [citeKnowledgeRecord(record)],
      requiresHumanHandoff: false,
    };
  }
  return {
    status: "answered",
    answer: record.body,
    contentReferences: [citeKnowledgeRecord(record)],
    requiresHumanHandoff: false,
  };
}
