import type { HealthConcern } from "@/data/healthConcerns";

export type LingAssessmentSection = {
  title: string;
  purpose: string;
  items: string[];
};

const familyFocus: Record<string, string[]> = {
  "Energy & recovery": [
    "Sleep quality, snoring, stress, mood and recent changes in exercise tolerance",
    "Weight change, appetite, recovery and day-to-day energy pattern",
  ],
  "Metabolic health": [
    "Weight trend, waist or body-composition context, blood pressure and lifestyle pattern",
    "Previous glucose, lipid, liver or metabolic results if available",
  ],
  "Heart & circulation": [
    "Blood pressure, pulse/rhythm pattern and whether symptoms occur at rest or with activity",
    "Smoking, diabetes, cholesterol, family history and relevant previous heart tests",
  ],
  "Sleep & recovery": [
    "Sleep timing, awakenings, snoring, witnessed breathing pauses and daytime sleepiness",
    "Alcohol, caffeine, medicines, stress and other factors that may affect sleep",
  ],
  "Gut & digestion": [
    "Pain, bloating, bowel pattern, reflux, food relationship and duration",
    "Weight change, bleeding, medicines, supplements, travel and previous gastrointestinal tests",
  ],
  "Men's health": [
    "Urinary, sexual, energy and sleep changes, plus medicines and cardiovascular risk",
    "Relevant previous hormone, metabolic or prostate-related results if available",
  ],
  "Women’s hormonal health": [
    "Cycle pattern, bleeding changes, hot flushes, sleep, mood and sexual-health symptoms",
    "Relevant medicines, pregnancy/fertility context and previous hormone or screening results",
  ],
  "Women's hormonal health": [
    "Cycle pattern, bleeding changes, hot flushes, sleep, mood and sexual-health symptoms",
    "Relevant medicines, pregnancy/fertility context and previous hormone or screening results",
  ],
  "Cancer screening": [
    "Age, family history, smoking or other risk factors and any symptoms that need assessment",
    "Which established screening programmes and previous imaging or tests are already up to date",
  ],
};

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export function buildLingAssessmentPlan(concern: HealthConcern, family: string): LingAssessmentSection[] {
  const familyItems = familyFocus[family] ?? [
    "What changed, when it started, what makes it better or worse and how it affects daily life",
    "Relevant diagnoses, medicines, supplements and previous results",
  ];

  const reviewedChecks = concern.firstChecks.slice(0, 4);

  return [
    {
      title: "1. Put the story in order",
      purpose: "Give the clinician enough context before deciding what needs testing.",
      items: unique([
        "When the problem started, whether it is changing and what other symptoms occur with it",
        "Relevant medical history, medicines, supplements, allergies and recent lifestyle changes",
      ]),
    },
    {
      title: "2. Bring the useful baseline",
      purpose: "Use measurements and previous information that are relevant to this concern rather than ordering everything.",
      items: unique(familyItems),
    },
    {
      title: "3. Discuss targeted checks",
      purpose: "These come from the reviewed MMS concern guide. A qualified professional decides which are actually appropriate.",
      items: reviewedChecks.length
        ? reviewedChecks
        : ["Targeted examination or testing chosen after the history and baseline are reviewed"],
    },
    {
      title: "4. Decide the next level only after review",
      purpose: "Specialist referral, imaging, additional testing or treatment should follow the findings rather than come first.",
      items: [
        "Review what the results actually change",
        "Identify whether follow-up can stay in preventive care or needs a specialist pathway",
      ],
    },
  ];
}

export function flattenLingAssessmentPlan(plan: LingAssessmentSection[]) {
  return plan.map((section) => `${section.title} — ${section.items.join("; ")}`);
}
