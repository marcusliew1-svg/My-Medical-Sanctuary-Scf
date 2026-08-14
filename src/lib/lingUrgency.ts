export type LingUrgencyMatch = {
  id: string;
  title: string;
  message: string;
  action: string;
  matchedTerms: string[];
};

type UrgencyRule = {
  id: string;
  terms: string[];
  title: string;
  message: string;
  action: string;
};

// Conservative priority rules for the patient-facing Ling prototype.
// These rules deliberately suppress treatment, screening and promotional routing when
// wording suggests a potentially time-critical problem. They are not a diagnosis engine.
const urgencyRules: UrgencyRule[] = [
  {
    id: "possible-heart-attack",
    terms: [
      "chest pressure",
      "chest squeezing",
      "heavy chest pain",
      "chest pain with shortness of breath",
      "chest pain and sweating",
      "chest pain and nausea",
      "chest pain and lightheaded",
      "pain spreading to arm",
      "pain spreading to jaw",
      "pain spreading to back",
    ],
    title: "This could need emergency assessment now",
    message: "Chest pressure, squeezing or pain — especially with shortness of breath, sweating, nausea, lightheadedness or discomfort spreading to the arm, jaw, back or stomach — can be a warning sign of a heart attack.",
    action: "Do not wait for an online wellness or treatment discussion. Contact your local emergency medical service or go to the nearest emergency department now.",
  },
  {
    id: "possible-stroke",
    terms: [
      "face drooping",
      "face droop",
      "one sided weakness",
      "one-sided weakness",
      "arm weakness suddenly",
      "sudden arm weakness",
      "slurred speech",
      "can't speak suddenly",
      "cannot speak suddenly",
      "sudden trouble speaking",
      "sudden vision loss",
      "sudden severe headache",
      "sudden loss of balance",
    ],
    title: "Possible stroke warning signs need emergency care",
    message: "Sudden face drooping, one-sided weakness or numbness, trouble speaking, sudden vision change, loss of balance or a sudden severe headache can be stroke warning signs. Even if the symptoms improve, urgent assessment still matters.",
    action: "Contact your local emergency medical service immediately. Do not use Ling to delay emergency assessment.",
  },
  {
    id: "severe-breathing-or-allergy",
    terms: [
      "can't breathe",
      "cannot breathe",
      "severe difficulty breathing",
      "struggling to breathe",
      "throat swelling",
      "tongue swelling",
      "face swelling and can't breathe",
      "face swelling and cannot breathe",
      "allergic reaction can't breathe",
      "allergic reaction cannot breathe",
      "wheezing and throat swelling",
    ],
    title: "Severe breathing or allergic symptoms can be an emergency",
    message: "Severe difficulty breathing, throat or tongue swelling, faintness or a rapidly worsening allergic reaction can become life-threatening very quickly.",
    action: "Use prescribed emergency allergy medicine if you have been told to do so, and contact your local emergency medical service immediately.",
  },
  {
    id: "seizure-or-unresponsiveness",
    terms: [
      "first seizure",
      "seizure more than 5 minutes",
      "seizure over 5 minutes",
      "multiple seizures not waking up",
      "not waking up after seizure",
      "unconscious and not breathing normally",
      "not responding and not breathing normally",
    ],
    title: "This needs emergency medical help",
    message: "A first seizure, a seizure lasting more than about five minutes, repeated seizures without recovery, or loss of responsiveness with abnormal breathing needs emergency assessment.",
    action: "Contact your local emergency medical service now. Do not continue a routine Ling conversation while waiting for help.",
  },
];

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+\-\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchLingUrgency(input: string): LingUrgencyMatch | null {
  const q = normalise(input);
  if (!q) return null;

  for (const rule of urgencyRules) {
    const matchedTerms = rule.terms.filter((term) => q.includes(normalise(term)));
    if (!matchedTerms.length) continue;
    return {
      id: rule.id,
      title: rule.title,
      message: rule.message,
      action: rule.action,
      matchedTerms,
    };
  }

  return null;
}
