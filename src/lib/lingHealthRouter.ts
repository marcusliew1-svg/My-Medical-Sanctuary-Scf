import { healthConcerns, type HealthConcern } from "@/data/healthConcerns";
import { extraHealthConcerns } from "@/data/healthConcernsExtra";
import { expandedHealthConcerns } from "@/data/healthConcernsExpanded";
import { lingHealthTaxonomy } from "@/data/lingHealthTaxonomy";
import { expandedLingHealthTaxonomy } from "@/data/lingHealthTaxonomyExpanded";

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

function scoreConcern(question: string, concern: HealthConcern): LingHealthMatch | null {
  const q = normalise(question);
  const taxonomy = getTaxonomy(concern.slug);
  const aliases = taxonomy?.aliases ?? [];
  const candidates = [...aliases, ...concern.seoTerms];
  const matchedTerms = [...new Set(candidates.filter((term) => q.includes(normalise(term))))];
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

export function buildLingHealthExplanation(result: LingHealthRouteResult | LingHealthMatch) {
  const isRouteResult = "primary" in result;
  const match = isRouteResult ? result.primary : result;
  const concern = match.concern;
  const taxonomy = getTaxonomy(concern.slug);
  const firstChecks = concern.firstChecks.slice(0, 3);
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

  return {
    title: concern.title,
    family: taxonomy?.family ?? "Health concern",
    directAnswer: concern.intro,
    whatItMeans: concern.layman,
    worthChecking: firstChecks,
    possibleTopics: related,
    redFlags,
    overlaps,
    assessmentRoute: isRouteResult ? result.assessmentRoute : taxonomy?.assessmentRoute ?? "general-assessment",
    routeLabel: isRouteResult ? result.routeLabel : taxonomy?.routeLabel ?? "Start with a qualified assessment before deciding whether any treatment is appropriate.",
    concernHref: `/health-concerns/${concern.slug}`,
  };
}

export const lingHealthFamilies = [...new Set(allTaxonomy.map((item) => item.family))];
