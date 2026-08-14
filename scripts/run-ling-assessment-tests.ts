import { buildLingHealthExplanation, lingHealthKnowledge } from "../src/lib/lingHealthRouter";

const bannedPhrases = [
  "you need these tests",
  "ling recommends this panel",
  "this will diagnose",
  "complete these tests before seeing",
  "this treatment is the next step",
];

let failures = 0;

for (const concern of lingHealthKnowledge) {
  const answer = buildLingHealthExplanation({
    concern,
    confidence: "strong",
    matchedTerms: [],
    score: 3,
  });

  const plan = answer.assessmentPlan;
  const label = `${concern.slug}`;

  if (plan.length !== 4) {
    console.error(`FAIL ${label}: expected 4 assessment sections, found ${plan.length}`);
    failures += 1;
    continue;
  }

  if (plan.some((section) => !section.title || !section.purpose || section.items.length === 0)) {
    console.error(`FAIL ${label}: assessment section is incomplete`);
    failures += 1;
    continue;
  }

  const targeted = plan[2].items;
  const reviewedChecksPresent = concern.firstChecks.length === 0
    || concern.firstChecks.slice(0, 4).some((item) => targeted.includes(item));

  if (!reviewedChecksPresent) {
    console.error(`FAIL ${label}: targeted checks are not grounded in concern.firstChecks`);
    failures += 1;
    continue;
  }

  const combined = plan.flatMap((section) => [section.title, section.purpose, ...section.items]).join(" ").toLowerCase();
  const banned = bannedPhrases.find((phrase) => combined.includes(phrase));
  if (banned) {
    console.error(`FAIL ${label}: contains banned prescriptive wording: ${banned}`);
    failures += 1;
    continue;
  }

  console.log(`PASS ${label} assessment-plan`);
}

console.log(`\nLing assessment-plan summary: ${lingHealthKnowledge.length - failures}/${lingHealthKnowledge.length} passed`);

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log("ASSESSMENT GATE PASSED: all current concern pathways produce grounded non-prescriptive assessment plans.");
}
