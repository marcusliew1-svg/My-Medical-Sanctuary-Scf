import type { HealthConcern } from "@/data/healthConcerns";
import { buildLingAssessmentPlan } from "@/lib/lingAssessmentPlan";

export type LingDoctorBrief = {
  title: string;
  patientWords: string[];
  primaryConcern: string;
  concernFamily: string;
  possibleOverlaps: string[];
  relevantContext: string[];
  assessmentDiscussion: string[];
  questionsForClinician: string[];
  redFlagsToReview: string[];
  boundary: string;
};

function cleanContext(context: string[]) {
  return [...new Set(context.map((item) => item.trim()).filter(Boolean))].slice(-4);
}

export function buildLingDoctorBrief({
  concern,
  family,
  conversationContext,
  overlapTitles = [],
}: {
  concern: HealthConcern;
  family: string;
  conversationContext: string[];
  overlapTitles?: string[];
}): LingDoctorBrief {
  const assessmentPlan = buildLingAssessmentPlan(concern, family);

  return {
    title: "Ling consultation brief",
    patientWords: cleanContext(conversationContext),
    primaryConcern: concern.title,
    concernFamily: family,
    possibleOverlaps: [...new Set(overlapTitles.filter(Boolean))].slice(0, 3),
    relevantContext: [
      "Confirm when the concern started, how it has changed and how it affects daily life.",
      "Review relevant diagnoses, medicines, supplements, allergies and previous results mentioned by the patient.",
    ],
    assessmentDiscussion: assessmentPlan.flatMap((section) => section.items).slice(0, 8),
    questionsForClinician: concern.firstChecks.slice(0, 4).map((item) => `Would it be useful to review: ${item}`),
    redFlagsToReview: concern.redFlags.slice(0, 4),
    boundary:
      "This brief organises patient-reported information and reviewed MMS discussion points. It is not a diagnosis, test order, prescription or treatment-suitability decision.",
  };
}

export function doctorBriefToPlainText(brief: LingDoctorBrief) {
  const section = (title: string, items: string[]) =>
    items.length ? `${title}\n${items.map((item) => `- ${item}`).join("\n")}` : `${title}\n- None recorded`;

  return [
    brief.title,
    section("Patient's own words", brief.patientWords),
    `Primary concern pathway\n- ${brief.primaryConcern} (${brief.concernFamily})`,
    section("Possible overlapping concern areas", brief.possibleOverlaps),
    section("Context to confirm", brief.relevantContext),
    section("Assessment areas to discuss", brief.assessmentDiscussion),
    section("Questions for the clinician", brief.questionsForClinician),
    section("Red flags to review", brief.redFlagsToReview),
    `Boundary\n- ${brief.boundary}`,
  ].join("\n\n");
}
