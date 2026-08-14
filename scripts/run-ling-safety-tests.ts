import { lingSafetyTestCases, type LingExpectedRoute } from "../src/data/lingSafetyTestCases";
import { lingSafetyAdversarialCases } from "../src/data/lingSafetyAdversarialCases";
import { matchLingUrgency } from "../src/lib/lingUrgency";
import { matchHealthConcerns } from "../src/lib/lingHealthRouter";
import { getLingClarification } from "../src/lib/lingClarification";

type RouteResult = {
  route: LingExpectedRoute;
  key?: string;
};

function routeMessage(message: string, priorContext: string[]): { result: RouteResult; context: string[] } {
  const nextContext = [...priorContext, message].slice(-4);
  const combined = nextContext.join(" ");

  const urgent = matchLingUrgency(combined) ?? matchLingUrgency(message);
  if (urgent) {
    return { result: { route: "urgent", key: urgent.id }, context: nextContext };
  }

  const concern = matchHealthConcerns(combined);
  if (concern) {
    return { result: { route: "concern", key: concern.primary.concern.slug }, context: nextContext };
  }

  const clarification = getLingClarification(combined) ?? getLingClarification(message);
  if (clarification) {
    return { result: { route: "clarify", key: clarification.trigger }, context: nextContext };
  }

  return { result: { route: "discovery" }, context: nextContext };
}

function runCase(input: string): RouteResult {
  const turns = input.split("||").map((part) => part.trim()).filter(Boolean);
  let context: string[] = [];
  let result: RouteResult = { route: "discovery" };

  for (const turn of turns) {
    const routed = routeMessage(turn, context);
    result = routed.result;
    context = routed.context;
  }

  return result;
}

const allCases = [...lingSafetyTestCases, ...lingSafetyAdversarialCases];
const failures: Array<{ id: string; expected: string; actual: string; input: string; note: string }> = [];
let urgentTotal = 0;
let urgentPassed = 0;

for (const testCase of allCases) {
  const actual = runCase(testCase.input);
  const routeMatches = actual.route === testCase.expectedRoute;
  const keyMatches = testCase.expectedKey ? actual.key === testCase.expectedKey : true;
  const passed = routeMatches && keyMatches;

  if (testCase.expectedRoute === "urgent") {
    urgentTotal += 1;
    if (passed) urgentPassed += 1;
  }

  const expectedLabel = `${testCase.expectedRoute}${testCase.expectedKey ? `:${testCase.expectedKey}` : ""}`;
  const actualLabel = `${actual.route}${actual.key ? `:${actual.key}` : ""}`;

  if (passed) {
    console.log(`PASS ${testCase.id} ${actualLabel}`);
  } else {
    console.error(`FAIL ${testCase.id} expected=${expectedLabel} actual=${actualLabel}`);
    console.error(`     input: ${testCase.input}`);
    console.error(`     note: ${testCase.note}`);
    failures.push({ id: testCase.id, expected: expectedLabel, actual: actualLabel, input: testCase.input, note: testCase.note });
  }
}

const total = allCases.length;
const passed = total - failures.length;
console.log("\nLing safety regression summary");
console.log(`Total: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
console.log(`Urgent cases: ${urgentPassed}/${urgentTotal}`);
console.log(`Adversarial controls: ${lingSafetyAdversarialCases.length}`);

if (urgentPassed !== urgentTotal) {
  console.error("RELEASE GATE FAILED: every urgent and urgent-override case must pass.");
}

if (failures.length > 0) {
  process.exitCode = 1;
} else {
  console.log("RELEASE GATE PASSED: all current Ling routing safety cases passed.");
}
