import { matchHealthConcerns } from "../src/lib/lingHealthRouter";
import { matchLingTreatment } from "../src/lib/lingTreatmentRouter";
import { matchLingUrgency } from "../src/lib/lingUrgency";

type Case = {
  id: string;
  input: string;
  expect: "treatment" | "concern" | "urgent" | "none";
  expectedSlug?: string;
  note: string;
};

const cases: Case[] = [
  { id: "TR01", input: "I want to understand NAD+", expect: "treatment", expectedSlug: "nad-plus", note: "Treatment-only question should enter governed education." },
  { id: "TR02", input: "Can exosomes make me younger", expect: "treatment", expectedSlug: "exosome-services", note: "Exosome interest should be education, not a promise or suitability decision." },
  { id: "TR03", input: "I want stem cells for anti ageing", expect: "treatment", expectedSlug: "msc-stem-cell-pathways", note: "Generic stem-cell interest should route to the reviewed treatment library." },
  { id: "TR04", input: "What is PRP", expect: "treatment", expectedSlug: "prp", note: "Treatment definition question." },
  { id: "TR05", input: "Tell me about hyperbaric oxygen", expect: "treatment", expectedSlug: "hyperbaric-oxygen", note: "Recognise common HBOT wording." },
  { id: "TR06", input: "What is red light therapy", expect: "treatment", expectedSlug: "red-light-photobiomodulation", note: "Recognise common photobiomodulation wording." },
  { id: "TR07", input: "Should I do NAD+ because I am tired all the time", expect: "concern", note: "A symptom should be assessed before treatment shopping." },
  { id: "TR08", input: "Would PRP fix my knee pain", expect: "concern", note: "Knee concern should outrank procedure interest." },
  { id: "TR09", input: "I have lymphoma and want to understand CAR-T", expect: "concern", note: "Known blood-cancer context should stay in specialist concern pathway first." },
  { id: "TR10", input: "I want stem cells but now I have chest pressure and shortness of breath", expect: "urgent", note: "Urgency must suppress treatment education." },

  // ROUTING SAFETY — generic screening must stay separate from MCED.
  { id: "TR11", input: "Tell me about health screening", expect: "treatment", expectedSlug: "health-screening-ultrasound", note: "Generic screening belongs to ordinary health screening." },
  { id: "TR12", input: "I want a preventive health screening", expect: "treatment", expectedSlug: "health-screening-ultrasound", note: "Preventive screening must not map to MCED." },
  { id: "TR13", input: "What is a medical checkup", expect: "treatment", expectedSlug: "health-screening-ultrasound", note: "General check-up wording maps to ordinary screening." },
  { id: "TR14", input: "What is an ultrasound screening", expect: "treatment", expectedSlug: "health-screening-ultrasound", note: "Ultrasound screening maps to the general screening guide." },
  { id: "TR15", input: "What is a multi cancer blood test", expect: "treatment", expectedSlug: "mced", note: "MCED requires cancer-specific wording." },
  { id: "TR16", input: "Tell me about MCED", expect: "treatment", expectedSlug: "mced", note: "Explicit MCED wording should match MCED." },

  // ROUTING SAFETY — common treatment labels go only to their dedicated guide.
  { id: "TR17", input: "I want an ECG", expect: "treatment", expectedSlug: "ecg-cardiovascular-risk-review", note: "ECG maps only to cardiovascular review." },
  { id: "TR18", input: "Tell me about an IV drip", expect: "treatment", expectedSlug: "iv-wellness-antioxidant-support", note: "Generic IV drip maps to the governed IV guide." },
  { id: "TR19", input: "I am interested in gut health", expect: "treatment", expectedSlug: "gut-health-microbiome-support", note: "Gut-health language maps to microbiome support, not colon cleansing." },
  { id: "TR20", input: "Tell me about colon cleansing", expect: "treatment", expectedSlug: "colon-cleansing", note: "Colon cleansing remains a separate procedure guide." },

  // FALSE-POSITIVE CONTROLS — short abbreviations must match whole terms.
  { id: "TR21", input: "I am travelling to Canada next month", expect: "none", note: "Canada must not accidentally match NAD." },
  { id: "TR22", input: "I want general cancer screening", expect: "concern", note: "Cancer-screening concern should take priority; generic cancer screening must not imply MCED." },
];

function decide(input: string) {
  const urgent = matchLingUrgency(input);
  if (urgent) return { route: "urgent" as const };
  const concern = matchHealthConcerns(input);
  if (concern) return { route: "concern" as const, slug: concern.primary.concern.slug };
  const treatment = matchLingTreatment(input);
  if (treatment) return { route: "treatment" as const, slug: treatment.item.slug };
  return { route: "none" as const };
}

let failures = 0;
for (const testCase of cases) {
  const actual = decide(testCase.input);
  const routePass = actual.route === testCase.expect;
  const slugPass = !testCase.expectedSlug || ("slug" in actual && actual.slug === testCase.expectedSlug);
  if (routePass && slugPass) {
    console.log(`PASS ${testCase.id} ${actual.route}${"slug" in actual && actual.slug ? `:${actual.slug}` : ""}`);
    continue;
  }
  failures += 1;
  console.error(`FAIL ${testCase.id} expected=${testCase.expect}${testCase.expectedSlug ? `:${testCase.expectedSlug}` : ""} actual=${actual.route}${"slug" in actual && actual.slug ? `:${actual.slug}` : ""}`);
  console.error(`     input: ${testCase.input}`);
  console.error(`     note: ${testCase.note}`);
}

console.log(`\nLing treatment-routing summary: ${cases.length - failures}/${cases.length} passed`);
if (failures) process.exitCode = 1;
