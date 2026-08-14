import { healthConcerns, type HealthConcern } from "@/data/healthConcerns";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";
import { lingHealthTaxonomy } from "@/data/lingHealthTaxonomy";
import { expandedLingHealthTaxonomy } from "@/data/lingHealthTaxonomyExpanded";
import { buildLingAssessmentPlan, flattenLingAssessmentPlan } from "@/lib/lingAssessmentPlan";

export type LingHealthMatch = {
  concern: HealthConcern;
  confidence: "strong" | "possible";
  matchedTerms: string[];
  score: number;
};

export type LingHealthRouteResult = {
  primary: LingHealthMatch;
  overlaps: LingHealthMatch[];
  assessmentRoute: string;
  routeLabel: string;
};

export const lingHealthKnowledge = [...healthConcerns, ...extraHealthConcerns, ...expandedHealthConcerns];
const allTaxonomy = [...lingHealthTaxonomy, ...expandedLingHealthTaxonomy];

function getTaxonomy(slug: string) {
  return allTaxonomy.find((item) => item.slug === slug);
}

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+\-\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const localNegation = /(?:\bno|\bwithout|\bdenies|\bdeny|\bnever had|\bhave not had|\bhaven't had|\bdo not have|\bdon't have|\bdoes not have|\bdoesn't have|\bdid not have|\bdidn't have|\bnot currently having|\bnot having)(?:\s+\w+){0,4}\s*$/;
const historicalThirdPerson = /(?:\bmy\s+(?:father|mother|dad|mum|mom|wife|husband|partner|brother|sister|son|daughter|friend|relative)\b|\bsomeone\s+i\s+know\b).*(?:\blast\s+year\b|\byears?\s+ago\b|\bmonths?\s+ago\b|\bpreviously\b|\bin\s+the\s+past\b)/;
const educationalContext = /(?:\bwhat\s+does\b|\bwhat\s+do\b|\bwhat\s+are\b|\bwhat\s+is\b|\breading\s+about\b|\barticle\b|\bwebsite\b|\bguide\b|\bdefinition\b|\bmeaning\b|\bsymptoms?\s+of\b)/;
const currentPersonalContext = /(?:\bi\s+(?:have|am|feel|felt|notice|noticed|experience|experienced|keep|kept|started|suddenly)|\bmy\s+(?:chest|head|heart|arm|face|speech|breathing|stomach|knee|back|urine|memory|hair|weight|sleep)\b|\bright\s+now\b|\bcurrently\b|\btoday\b|\bnow\b)/;

function shouldSuppressContext(text: string) {
  if (currentPersonalContext.test(text)) return false;
  return historicalThirdPerson.test(text) || educationalContext.test(text);
}

function hasPositiveOccurrence(text: string, term: string) {
  if (shouldSuppressContext(text)) return false;

  let from = 0;
  while (from < text.length) {
    const index = text.indexOf(term, from);
    if (index === -1) return false;
    const before = text.slice(Math.max(0, index - 65), index);
    if (!localNegation.test(before)) return true;
    from = index + term.length;
  }
  return false;
}

function scoreConcern(question: string, concern: HealthConcern): LingHealthMatch | null {
  const q = normalise(question);
  const taxonomy = getTaxonomy(concern.slug);
  const aliases = taxonomy?.aliases ?? [];
  const candidates = [...aliases, ...concern.seoTerms];
  const matchedTerms = [...new Set(candidates.filter((term) => hasPositiveOccurrence(q, normalise(term))))];
  if (!matchedTerms.length) return null;

  const score = matchedTerms.reduce((total, term) => {
    const words = normalise(term).split(" ").length;
    return total + Math.max(1, words) + (words >= 2 ? 1 : 0);
  }, 0);

  return {
    concern,
    confidence: score >= 3 ? "strong" : "possible",
    matchedTerms,
    score,
  };
}

export function matchHealthConcerns(question: string): LingHealthRouteResult | null {
  const q = normalise(question);
  if (!q) return null;

  const matches = lingHealthKnowledge
    .map((concern) => scoreConcern(q, concern))
    .filter((match): match is LingHealthMatch => Boolean(match))
    .sort((a, b) => b.score - a.score);

  if (!matches.length) return null;

  const primary = matches[0];
  const taxonomy = getTaxonomy(primary.concern.slug);
  const explicitRelated = new Set(taxonomy?.relatedSlugs ?? []);

  const overlaps = matches
    .slice(1)
    .filter((match) => match.score >= Math.max(2, primary.score - 3) || explicitRelated.has(match.concern.slug))
    .slice(0, 3);

  if (overlaps.length < 2 && taxonomy) {
    for (const slug of taxonomy.relatedSlugs) {
      if (overlaps.some((item) => item.concern.slug === slug)) continue;
      const concern = lingHealthKnowledge.find((item) => item.slug === slug);
      if (!concern) continue;
      overlaps.push({ concern, confidence: "possible", matchedTerms: [], score: 0 });
      if (overlaps.length >= 2) break;
    }
  }

  return {
    primary,
    overlaps,
    assessmentRoute: taxonomy?.assessmentRoute ?? "general-assessment",
    routeLabel: taxonomy?.routeLabel ?? "Start with a qualified assessment before deciding whether any treatment is appropriate.",
  };
}

export function matchHealthConcern(question: string): LingHealthMatch | null {
  return matchHealthConcerns(question)?.primary ?? null;
}

function buildFollowUpQuestions(concern: HealthConcern, family: string) {
  const common = [
    "How long has this been happening, and has it changed recently?",
    "What other symptoms tend to happen at the same time?",
  ];

  const familyQuestion: Record<string, string> = {
    "Energy & recovery": "How are your sleep, stress, exercise tolerance and day-to-day energy changing together?",
    "Metabolic health": "Have your weight, waist size, blood pressure, glucose or liver results changed recently?",
    "Heart & circulation": "Does this happen at rest or with activity, and is there dizziness, fainting, breathlessness or chest discomfort with it?",
    "Sleep & recovery": "Do you snore, wake often, feel unrefreshed, or become sleepy during the day?",
    "Gut & digestion": "Is the main problem pain, bloating, bowel changes, reflux, food-related symptoms or unintended weight loss?",
    "Men's health": "Have urinary, sexual, energy, sleep or medication changes happened around the same time?",
    "Women’s hormonal health": "Have your cycle pattern, hot flushes, sleep, mood, sexual health or bleeding pattern changed?",
    "Women's hormonal health": "Have your cycle pattern, hot flushes, sleep, mood, sexual health or bleeding pattern changed?",
    "Cancer screening": "What is your age, family history, smoking history and which standard screening tests have you already completed?",
  };

  const specific: Record<string, string> = {
    "unexplained-fatigue-low-energy": "Have you also noticed poor sleep, snoring, weight change, low mood, breathlessness or reduced exercise tolerance?",
    "weight-gain-metabolic-health": "Has the weight change been gradual or sudden, and have sleep, appetite, medicines or activity changed too?",
    "palpitations-chest-discomfort-heart-rhythm": "When the racing or irregular heartbeat happens, how long does it last and what are you doing at the time?",
    "headache-dizziness-lightheadedness": "Is the main problem headache, spinning, faintness or imbalance, and is it new or different from your usual pattern?",
    "thyroid-related-symptoms": "Have you noticed changes in weight, temperature tolerance, bowel habits, heart rate, skin, hair or menstrual pattern?",
    "memory-brain-health-concerns": "Is this occasional forgetfulness, or is it starting to affect work, finances, driving, medication use or daily routines?",
  };

  return [common[0], specific[concern.slug] ?? familyQuestion[family] ?? common[1], "What medicines, supplements, diagnoses or recent test results might be relevant?"].slice(0, 3);
}

export function buildLingHealthExplanation(result: LingHealthRouteResult | LingHealthMatch) {
  const isRouteResult = "primary" in result;
  const match = isRouteResult ? result.primary : result;
  const concern = match.concern;
  const taxonomy = getTaxonomy(concern.slug);
  const family = taxonomy?.family ?? "Health concern";
  const assessmentPlan = buildLingAssessmentPlan(concern, family);
  const firstChecks = flattenLingAssessmentPlan(assessmentPlan);
  const related = concern.relatedTopics.slice(0, 2);
  const redFlags = concern.redFlags.slice(0, 2);

  const overlaps = isRouteResult
    ? result.overlaps.map((item) => ({
        title: item.concern.title,
        href: `/health-concerns/${item.concern.slug}`,
      }))
    : (taxonomy?.relatedSlugs ?? [])
        .slice(0, 2)
        .map((slug) => lingHealthKnowledge.find((item) => item.slug === slug))
        .filter((item): item is HealthConcern => Boolean(item))
        .map((item) => ({ title: item.title, href: `/health-concerns/${item.slug}` }));

  const confidenceNote = match.confidence === "strong"
    ? "What you described fits one of the health-concern pathways in the MMS library. That does not mean this is your diagnosis."
    : "There is a possible match in the MMS health-concern library, but I would want a little more context before leaning too heavily on it.";

  return {
    title: concern.title,
    family,
    conversationLead: confidenceNote,
    directAnswer: concern.intro,
    whatItMeans: concern.layman,
    worthChecking: firstChecks,
    assessmentPlan,
    possibleTopics: related,
    redFlags,
    overlaps,
    followUpQuestions: buildFollowUpQuestions(concern, family),
    assessmentRoute: isRouteResult ? result.assessmentRoute : taxonomy?.assessmentRoute ?? "general-assessment",
    routeLabel: isRouteResult ? result.routeLabel : taxonomy?.routeLabel ?? "Start with a qualified assessment before deciding whether any treatment is appropriate.",
    concernHref: `/health-concerns/${concern.slug}`,
  };
}

export const lingHealthFamilies = [...new Set(allTaxonomy.map((item) => item.family))];
