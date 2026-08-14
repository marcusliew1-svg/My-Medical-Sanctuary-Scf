import { healthConcerns, type HealthConcern } from "@/data/healthConcerns";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";

export type LingHealthMatch = {
  concern: HealthConcern;
  confidence: "strong" | "possible";
  matchedTerms: string[];
};

const concernKeywords: Record<string, string[]> = {
  "unexplained-fatigue-low-energy": ["tired", "fatigue", "low energy", "exhausted", "no energy", "always tired"],
  "weight-gain-metabolic-health": ["weight", "overweight", "obesity", "lose weight", "weight gain", "metabolic"],
  "low-libido-low-testosterone-symptoms": ["low testosterone", "testosterone", "low libido", "sex drive", "male hormone"],
  "knee-osteoarthritis-joint-pain": ["knee", "joint pain", "arthritis", "osteoarthritis", "prp", "prgf"],
  "poor-sleep-stress-recovery": ["poor sleep", "sleep badly", "stress", "recovery", "insomnia", "not sleeping"],
  "digestive-gut-symptoms": ["gut", "bloating", "digestive", "stomach", "bowel", "constipation", "diarrhea", "diarrhoea", "microbiome"],
  "cancer-risk-early-detection": ["cancer screening", "cancer blood test", "mced", "cancer risk", "early detection", "family history cancer"],
  "blood-cancer-car-t-specialist-care": ["car-t", "cart", "lymphoma", "myeloma", "leukaemia", "leukemia", "blood cancer"],
  "menopause-hot-flushes-hormone-changes": ["menopause", "perimenopause", "hot flush", "hot flash", "night sweats", "hrt"],
  "fatty-liver-metabolic-liver-health": ["fatty liver", "liver fat", "masld", "nafld", "liver health"],
  "high-blood-pressure-cardiovascular-risk": ["high blood pressure", "blood pressure", "hypertension", "heart risk", "cardiovascular"],
  "prediabetes-insulin-resistance": ["prediabetes", "pre-diabetes", "insulin resistance", "hba1c", "high sugar", "blood sugar"],
  "snoring-daytime-sleepiness-sleep-apnoea": ["snore", "snoring", "sleep apnea", "sleep apnoea", "daytime sleepiness", "stop breathing sleep"],
  "erectile-dysfunction-mens-health": ["erectile", "erection", "ed", "men's health", "mens health", "sexual performance"],
};

export const lingHealthKnowledge = [...healthConcerns, ...extraHealthConcerns];

function normalise(value: string) {
  return value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9+\-\s']/g, " ").replace(/\s+/g, " ").trim();
}

export function matchHealthConcern(question: string): LingHealthMatch | null {
  const q = normalise(question);
  if (!q) return null;

  let best: { concern: HealthConcern; score: number; matchedTerms: string[] } | null = null;

  for (const concern of lingHealthKnowledge) {
    const keywords = concernKeywords[concern.slug] ?? [];
    const matchedTerms = keywords.filter((term) => q.includes(normalise(term)));
    const seoMatches = concern.seoTerms.filter((term) => q.includes(normalise(term)));
    const allMatches = [...new Set([...matchedTerms, ...seoMatches])];
    const score = allMatches.reduce((total, term) => total + Math.max(1, normalise(term).split(" ").length), 0);

    if (!best || score > best.score) best = { concern, score, matchedTerms: allMatches };
  }

  if (!best || best.score === 0) return null;
  return {
    concern: best.concern,
    confidence: best.score >= 2 ? "strong" : "possible",
    matchedTerms: best.matchedTerms,
  };
}

export function buildLingHealthExplanation(match: LingHealthMatch) {
  const { concern } = match;
  const firstChecks = concern.firstChecks.slice(0, 3);
  const related = concern.relatedTopics.slice(0, 2);
  const redFlags = concern.redFlags.slice(0, 2);

  return {
    title: concern.title,
    directAnswer: concern.intro,
    whatItMeans: concern.layman,
    worthChecking: firstChecks,
    possibleTopics: related,
    redFlags,
    concernHref: `/health-concerns/${concern.slug}`,
  };
}
