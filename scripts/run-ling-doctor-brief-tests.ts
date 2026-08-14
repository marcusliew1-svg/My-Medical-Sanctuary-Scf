import { lingHealthKnowledge } from "../src/lib/lingHealthRouter";
import { buildLingDoctorBrief, doctorBriefToPlainText } from "../src/lib/lingDoctorBrief";

const prohibited = [/you need these tests/i, /ling recommends/i, /you should undergo/i, /you definitely have/i];
const failures: string[] = [];

for (const concern of lingHealthKnowledge) {
  const brief = buildLingDoctorBrief({
    concern,
    family: "Health concern",
    conversationContext: ["I have been feeling different lately", concern.title],
    overlapTitles: [],
  });

  if (!brief.patientWords.length) failures.push(`${concern.slug}: missing patient words`);
  if (!brief.primaryConcern) failures.push(`${concern.slug}: missing primary concern`);
  if (!brief.assessmentDiscussion.length) failures.push(`${concern.slug}: missing assessment discussion`);
  if (!brief.questionsForClinician.length) failures.push(`${concern.slug}: missing clinician questions`);
  if (!brief.redFlagsToReview.length) failures.push(`${concern.slug}: missing red flags to review`);

  const text = doctorBriefToPlainText(brief);
  for (const pattern of prohibited) {
    if (pattern.test(text)) failures.push(`${concern.slug}: prohibited prescriptive wording ${pattern}`);
  }
}

const sample = buildLingDoctorBrief({
  concern: lingHealthKnowledge[0],
  family: "Energy & recovery",
  conversationContext: ["I feel tired", "It has been a few months", "I snore sometimes", "I feel tired"],
  overlapTitles: ["Sleep & recovery", "Metabolic health"],
});

if (sample.patientWords.filter((item) => item === "I feel tired").length !== 1) {
  failures.push("sample: duplicate patient wording was not removed");
}
if (sample.patientWords.length > 4) failures.push("sample: patient context exceeds four turns");
if (sample.possibleOverlaps.length > 3) failures.push("sample: overlap list exceeds three items");

console.log(`Ling doctor-brief regression: ${lingHealthKnowledge.length} concern records checked`);
if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  process.exitCode = 1;
} else {
  console.log("RELEASE GATE PASSED: doctor briefs remain grounded, bounded and non-prescriptive.");
}
