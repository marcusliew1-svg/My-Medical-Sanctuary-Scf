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
// The phrase list is intentionally broader than one exact sentence pattern, but still
// narrower than a full symptom checker. Clinical safety review is required before live use.
const urgencyRules: UrgencyRule[] = [
  {
    id: "possible-heart-attack",
    terms: [
      "chest pressure",
      "pressure in my chest",
      "chest squeezing",
      "chest is squeezing",
      "squeezing in my chest",
      "heavy chest pain",
      "chest pain with shortness of breath",
      "chest pain and shortness of breath",
      "chest pressure and shortness of breath",
      "chest pressure and i am short of breath",
      "chest pain and sweating",
      "chest pain and cold sweat",
      "chest pain and a cold sweat",
      "chest pressure and sweating",
      "chest pain and nausea",
      "chest pressure and nausea",
      "chest pain and lightheaded",
      "chest pressure and lightheaded",
      "pain spreading to arm",
      "pain spreading to my arm",
      "pain spreading to left arm",
      "pain spreading to my left arm",
      "pain in my chest is spreading to my arm",
      "pain in my chest is spreading to my left arm",
      "pain going to my arm",
      "pain going to my left arm",
      "pain spreading to jaw",
      "pain spreading to my jaw",
      "pain going to my jaw",
      "pain spreading to back",
      "pain spreading to my back",
      "pain going to my back",
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
      "face is drooping on one side",
      "one side of my face is drooping",
      "one sided weakness",
      "one-sided weakness",
      "one sided numbness",
      "one-sided numbness",
      "right arm is weak suddenly",
      "left arm is weak suddenly",
      "suddenly my right arm is weak",
      "suddenly my left arm is weak",
      "arm weakness suddenly",
      "sudden arm weakness",
      "arm numb suddenly",
      "sudden arm numbness",
      "slurred speech",
      "speech suddenly became slurred",
      "suddenly my speech is slurred",
      "can't speak suddenly",
      "cannot speak suddenly",
      "sudden trouble speaking",
      "sudden vision loss",
      "sudden loss of vision",
      "sudden trouble seeing",
      "sudden severe headache",
      "sudden loss of balance",
      "suddenly cannot balance",
      "suddenly i cannot balance",
      "suddenly can't balance",
      "suddenly i can't balance",
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
      "wheezing badly",
      "throat swelling",
      "throat is swelling",
      "tongue swelling",
      "tongue is swelling",
      "lips and tongue are swelling",
      "face swelling and can't breathe",
      "face swelling and cannot breathe",
      "allergic reaction can't breathe",
      "allergic reaction cannot breathe",
      "allergic reaction and tongue swelling",
      "allergic reaction and my lips and tongue are swelling",
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
      "my first seizure",
      "this is my first seizure",
      "seizure more than 5 minutes",
      "seizure over 5 minutes",
      "seizure has lasted more than 5 minutes",
      "seizure lasted more than 5 minutes",
      "multiple seizures not waking up",
      "several seizures and is not waking up",
      "several seizures and not waking up",
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
