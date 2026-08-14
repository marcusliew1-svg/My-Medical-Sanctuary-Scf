import { matchHealthConcerns } from "../src/lib/lingHealthRouter";
import { matchLingTreatment } from "../src/lib/lingTreatmentRouter";
import { matchLingUrgency } from "../src/lib/lingUrgency";

type Case = {
  id: string;
  input: string;
  expect: "treatment" | "concern" | "urgent";
  note: string;
};

const cases: Case[] = [
  { id: "TR01", input: "I want to understand NAD+", expect: "treatment", note: "Treatment-only question should enter governed education." },
  { id: "TR02", input: "Can exosomes make me younger", expect: "treatment", note: "Exosome interest should be education, not a promise or suitability decision." },
  { id: "TR03", input: "I want stem cells for anti ageing", expect: "treatment", note: "Generic stem-cell interest should route to the reviewed treatment library." },
  { id: "TR04", input: "What is PRP", expect: "treatment", note: "Treatment definition question." },
  { id: "TR05", input: "Tell me about hyperbaric oxygen", expect: "treatment", note: "Recognise common HBOT wording." },
  { id: "TR06", input: "What is red light therapy", expect: "treatment", note: "Recognise common photobiomodulation wording." },
  { id: "TR07", input: "Should I do NAD+ because I am tired all the time", expect: "concern", note: "A symptom should be assessed before treatment shopping." },
  { id: "TR08", input: "Would PRP fix my knee pain", expect: "concern", note: "Knee concern should outrank procedure interest." },
  { id: "TR09", input: "I have lymphoma and want to understand CAR-T", expect: "concern", note: "Known blood-cancer context should stay in specialist concern pathway first." },
  { id: "TR10", input: "I want stem cells but now I have chest pressure and shortness of breath", expect: "urgent", note: "Urgency must suppress treatment education." },
];

function decide(input: string) {
  const urgent = matchLingUrgency(input);
  if (urgent) return "urgent" as const;
  const concern = matchHealthConcerns(input);
  if (concern) return "concern" as const;
  const treatment = matchLingTreatment(input);
  if (treatment) return "treatment" as const;
  return "none" as const;
}

let failures = 0;
for (const testCase of cases) {
  const actual = decide(testCase.input);
  if (actual === testCase.expect) {
    console.log(`PASS ${testCase.id} ${actual}`);
    continue;
  }
  failures += 1;
  console.error(`FAIL ${testCase.id} expected=${testCase.expect} actual=${actual}`);
  console.error(`     input: ${testCase.input}`);
  console.error(`     note: ${testCase.note}`);
}

console.log(`\nLing treatment-routing summary: ${cases.length - failures}/${cases.length} passed`);
if (failures) process.exitCode = 1;
