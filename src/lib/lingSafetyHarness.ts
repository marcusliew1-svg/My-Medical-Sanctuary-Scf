import { getLingClarification } from "@/lib/lingClarification";
import { matchHealthConcerns } from "@/lib/lingHealthRouter";
import { matchLingUrgency } from "@/lib/lingUrgency";
import { lingSafetyTestCases, type LingExpectedRoute, type LingSafetyTestCase } from "@/data/lingSafetyTestCases";

export type LingRoutingDecision = {
  route: LingExpectedRoute;
  key?: string;
  context: string[];
};

export type LingSafetyTestResult = {
  id: string;
  input: string;
  expectedRoute: LingExpectedRoute;
  expectedKey?: string;
  actualRoute: LingExpectedRoute;
  actualKey?: string;
  passed: boolean;
  note: string;
};

function decideOneTurn(input: string, priorContext: string[] = []): LingRoutingDecision {
  const nextContext = [...priorContext, input.trim()].filter(Boolean).slice(-4);
  const combined = nextContext.join(" ");

  // Safety-critical rule: urgency always runs before ordinary health navigation.
  const urgent = matchLingUrgency(combined) ?? matchLingUrgency(input);
  if (urgent) return { route: "urgent", key: urgent.id, context: nextContext };

  const concern = matchHealthConcerns(combined);
  if (concern) return { route: "concern", key: concern.primary.concern.slug, context: nextContext };

  const clarification = getLingClarification(combined) ?? getLingClarification(input);
  if (clarification) return { route: "clarify", key: clarification.trigger, context: nextContext };

  return { route: "discovery", context: nextContext };
}

export function evaluateLingInput(input: string): LingRoutingDecision {
  const turns = input.split("||").map((part) => part.trim()).filter(Boolean);
  let decision: LingRoutingDecision = { route: "discovery", context: [] };

  for (const turn of turns) {
    decision = decideOneTurn(turn, decision.context);
    // An urgent later turn must terminate ordinary routing for this evaluation.
    if (decision.route === "urgent") break;
  }

  return decision;
}

export function runLingSafetyCase(testCase: LingSafetyTestCase): LingSafetyTestResult {
  const actual = evaluateLingInput(testCase.input);
  const routeMatches = actual.route === testCase.expectedRoute;
  const keyMatches = testCase.expectedKey ? actual.key === testCase.expectedKey : true;

  return {
    id: testCase.id,
    input: testCase.input,
    expectedRoute: testCase.expectedRoute,
    expectedKey: testCase.expectedKey,
    actualRoute: actual.route,
    actualKey: actual.key,
    passed: routeMatches && keyMatches,
    note: testCase.note,
  };
}

export function runLingSafetyMatrix() {
  const results = lingSafetyTestCases.map(runLingSafetyCase);
  const passed = results.filter((item) => item.passed).length;
  const failed = results.length - passed;
  const urgentCases = results.filter((item) => item.expectedRoute === "urgent");
  const urgentPassed = urgentCases.filter((item) => item.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    urgentTotal: urgentCases.length,
    urgentPassed,
    urgentPassRate: urgentCases.length ? urgentPassed / urgentCases.length : 1,
    results,
  };
}
