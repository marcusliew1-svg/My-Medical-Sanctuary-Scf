export const knowledgeContentStates = ["Draft", "Medical Review", "Legal Review", "Approved", "Retired"] as const;
export type KnowledgeContentState = (typeof knowledgeContentStates)[number];

export type ApprovedKnowledgeRecord = {
  contentId: string;
  topic: string;
  locale: string;
  state: KnowledgeContentState;
  body: string;
  approver: string | null;
  approvalDate: string | null;
  version: string;
  reviewExpiry: string | null;
  source: string;
  availability: "informational" | "planned" | "available";
};

export function validateKnowledgeRecord(record: ApprovedKnowledgeRecord): string[] {
  const errors: string[] = [];
  for (const [field, value] of Object.entries({
    contentId: record.contentId,
    topic: record.topic,
    locale: record.locale,
    body: record.body,
    version: record.version,
    source: record.source,
  })) if (!value.trim()) errors.push(`${field} is required.`);
  if (record.state === "Approved" && (!record.approver?.trim() || !record.approvalDate)) {
    errors.push("Approved content requires an approver and approval date.");
  }
  return errors;
}

export function publicApprovedKnowledge(
  records: readonly ApprovedKnowledgeRecord[],
  input: { topic: string; locale: string; now?: string },
): ApprovedKnowledgeRecord[] {
  const now = Date.parse(input.now || new Date().toISOString());
  return records.filter((record) =>
    record.state === "Approved" &&
    record.topic === input.topic &&
    record.locale === input.locale &&
    validateKnowledgeRecord(record).length === 0 &&
    (!record.reviewExpiry || Date.parse(record.reviewExpiry) >= now),
  );
}

export function citeKnowledgeRecord(record: ApprovedKnowledgeRecord): string {
  return `[${record.contentId} v${record.version}; ${record.source}]`;
}
