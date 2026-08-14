import { treatmentEducation, type TreatmentEducation } from "@/data/treatmentEducation";
import { treatmentEducationExtra } from "@/data/treatmentEducationExtra";

export type LingTreatmentMatch = {
  item: TreatmentEducation;
  matchedTerms: string[];
  score: number;
};

const allTreatments = [...treatmentEducation, ...treatmentEducationExtra];

const everydayAliases: Record<string, string[]> = {
  "nad-plus": ["nad", "nad+", "nad drip", "nad iv", "nad infusion"],
  prp: ["prp", "platelet rich plasma"],
  prgf: ["prgf", "plasma rich in growth factors"],
  "hyperbaric-oxygen": ["hyperbaric", "hbot", "oxygen chamber"],
  "red-light-photobiomodulation": ["red light", "red light therapy", "photobiomodulation"],
  "hormone-therapy": ["hormone therapy", "hormone replacement", "testosterone therapy", "hrt"],
  "medical-weight-management": ["weight loss injection", "glp-1", "glp1", "semaglutide", "tirzepatide"],
  peptides: ["peptide", "peptides", "peptide therapy"],
  "msc-stem-cell-pathways": ["stem cell", "stem cells", "msc", "mesenchymal stem cell"],
  "exosome-services": ["exosome", "exosomes", "exosome therapy"],
  "nk-cell-therapy": ["nk cell", "nk cells", "natural killer cell", "natural killer cells"],
  // MCED is deliberately specific. Generic screening language must never map here.
  mced: ["mced", "multi cancer blood test", "multi-cancer blood test", "multi cancer early detection", "multi-cancer early detection", "cancer blood test"],
  "car-t": ["car-t", "car t", "cart therapy"],
  // Generic preventive/check-up language belongs to ordinary screening, not MCED.
  "health-screening-ultrasound": ["health screening", "preventive screening", "preventive health screening", "medical checkup", "medical check up", "health checkup", "health check up", "full body check", "ultrasound screening", "screening ultrasound"],
  "ecg-cardiovascular-risk-review": ["ecg", "ekg", "heart tracing", "cardiovascular risk review", "heart risk review"],
  "iv-wellness-antioxidant-support": ["iv vitamin", "vitamin drip", "antioxidant drip", "iv wellness", "iv drip", "iv therapy", "hydration drip", "iv hydration"],
  "gut-health-microbiome-support": ["microbiome", "gut health", "stool microbiome", "microbiome test", "gut microbiome"],
  "colon-cleansing": ["colon cleanse", "colon cleansing", "colonic", "colonic irrigation", "colon hydrotherapy"],
};

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+\-\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsWholeTerm(question: string, term: string) {
  // Token-aware matching avoids false positives such as "Canada" matching "NAD".
  // Normalisation converts punctuation (except + and -) into spaces, so padded phrase
  // matching works for both single-token abbreviations and ordinary multi-word aliases.
  return ` ${question} `.includes(` ${term} `);
}

function candidateTerms(item: TreatmentEducation) {
  return [item.name, ...item.seoTerms, ...(everydayAliases[item.slug] ?? [])]
    .map(normalise)
    .filter((term) => term.length >= 3);
}

export function matchLingTreatment(input: string): LingTreatmentMatch | null {
  const q = normalise(input);
  if (!q) return null;

  const matches = allTreatments
    .map((item) => {
      const matchedTerms = [...new Set(candidateTerms(item).filter((term) => containsWholeTerm(q, term)))];
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
