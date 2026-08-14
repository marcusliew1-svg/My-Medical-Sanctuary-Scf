import { treatmentEducation, type TreatmentEducation } from "@/data/treatmentEducation";
import { treatmentEducationExtra } from "@/data/treatmentEducationExtra";

export type LingTreatmentMatch = {
  item: TreatmentEducation;
  matchedTerms: string[];
  score: number;
};

const allTreatments = [...treatmentEducation, ...treatmentEducationExtra];

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+\-\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function candidateTerms(item: TreatmentEducation) {
  return [item.name, ...item.seoTerms]
    .map(normalise)
    .filter((term) => term.length >= 3);
}

export function matchLingTreatment(input: string): LingTreatmentMatch | null {
  const q = normalise(input);
  if (!q) return null;

  const matches = allTreatments
    .map((item) => {
      const matchedTerms = [...new Set(candidateTerms(item).filter((term) => q.includes(term)))];
      if (!matchedTerms.length) return null;
      const score = matchedTerms.reduce((total, term) => {
        const words = term.split(" ").length;
        return total + Math.max(2, words * 2) + (term === normalise(item.name) ? 3 : 0);
      }, 0);
      return { item, matchedTerms, score };
    })
    .filter((match): match is LingTreatmentMatch => Boolean(match))
    .sort((a, b) => b.score - a.score);

  return matches[0] ?? null;
}

export function buildLingTreatmentExplanation(match: LingTreatmentMatch) {
  const item = match.item;
  return {
    slug: item.slug,
    name: item.name,
    eyebrow: item.eyebrow,
    summary: item.summary,
    plainEnglish: item.plainEnglish,
    evidence: item.evidence,
    evidenceNote: item.evidenceNote,
    whyPeopleAsk: item.whyPeopleAsk.slice(0, 3),
    caution: item.caution.slice(0, 3),
    doctorQuestions: item.questions.slice(0, 3),
    relatedConcerns: item.relatedConcerns.slice(0, 3),
    href: `/treatments/${item.slug}`,
  };
}
