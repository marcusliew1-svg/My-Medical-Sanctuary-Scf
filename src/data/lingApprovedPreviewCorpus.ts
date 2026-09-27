import type { ApprovedKnowledgeRecord } from "@/lib/approvedKnowledgeBase";

const common = {
  locale: "en",
  state: "Approved" as const,
  approver: "Synthetic Preview Content Review",
  approvalDate: "2026-09-01",
  version: "1.0",
  reviewExpiry: "2026-12-31",
  source: "T6.13 synthetic approved-content pilot",
} as const;

export const lingApprovedPreviewCorpus: readonly ApprovedKnowledgeRecord[] = Object.freeze([
  { ...common, contentId: "LING-PREVIEW-ABOUT-001", topic: "about-mms", body: "My Medical Sanctuary provides administrative information about its membership and programme pathways. Clinical decisions remain with qualified clinicians.", availability: "informational" },
  { ...common, contentId: "LING-PREVIEW-CONTACT-001", topic: "contact", body: "A Clinic Manager can help with administrative questions and arrange the appropriate next step using your preferred contact channel.", availability: "available" },
  { ...common, contentId: "LING-PREVIEW-MEMBERSHIP-001", topic: "membership", body: "Membership information describes administrative access and benefits only; it does not guarantee clinical suitability or treatment availability.", availability: "informational" },
  { ...common, contentId: "LING-PREVIEW-JOURNEY-001", topic: "membership-journey", body: "The Preview membership journey starts with approved administrative information, followed by a human Clinic Manager handoff for questions and next steps. It does not assess clinical suitability.", availability: "informational" },
  { ...common, contentId: "LING-PREVIEW-BOOKING-001", topic: "booking", body: "Preview booking captures synthetic administrative enquiries only. It is not a clinical assessment or emergency service.", availability: "available" },
  { ...common, contentId: "LING-PREVIEW-ONLINE-001", topic: "online-doctor", body: "The online-doctor service is planned for a future approved phase.", availability: "planned" },
  { ...common, contentId: "LING-PREVIEW-PRIVACY-001", topic: "privacy", body: "Only the minimum administrative details needed for enquiry follow-up should be submitted. Do not submit diagnoses, results, prescriptions or clinical notes.", availability: "informational" },
]);
