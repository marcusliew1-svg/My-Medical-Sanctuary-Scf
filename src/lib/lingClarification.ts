export type LingClarification = {
  trigger: string;
  intro: string;
  questions: string[];
  suggestedPrompts: string[];
};

const vaguePatterns: Array<{ terms: string[]; clarification: LingClarification }> = [
  {
    terms: ["don't feel right", "dont feel right", "not feeling right", "feel off", "something feels off", "not myself", "feel unwell"],
    clarification: {
      trigger: "general-unspecified",
      intro: "That can mean many different things, so I would not want to guess. A few details can help narrow the safest starting point.",
      questions: [
        "What feels different — energy, sleep, pain, digestion, mood, breathing, heart symptoms, weight or something else?",
        "How long has this been happening, and is it getting worse?",
        "Has anything changed recently — medicines, illness, stress, sleep, diet or exercise?",
      ],
      suggestedPrompts: ["I feel tired all the time", "My sleep has become poor", "My heart feels like it races", "My digestion has changed"],
    },
  },
  {
    terms: ["ageing too fast", "aging too fast", "feel old", "getting old fast", "ageing badly", "aging badly", "healthy ageing", "healthy aging"],
    clarification: {
      trigger: "healthy-ageing",
      intro: "Ageing is not one medical problem. The useful question is what has actually changed and whether there are measurable health risks we can act on.",
      questions: [
        "What has changed most — energy, strength, weight, sleep, memory, sexual health, skin/hair or recovery?",
        "Are there known issues such as high blood pressure, high glucose, fatty liver or high cholesterol?",
        "When was your last proper health screening?",
      ],
      suggestedPrompts: ["I am losing muscle", "My memory is getting worse", "I am always tired", "I want a full health check"],
    },
  },
  {
    terms: ["inflamed", "inflammation", "body inflamed", "feel inflamed", "chronic inflammation"],
    clarification: {
      trigger: "inflammation-language",
      intro: "People use the word ‘inflammation’ to describe many different things. It is more useful to identify the actual symptoms than to assume there is one hidden inflammatory problem.",
      questions: [
        "What symptoms make you think of inflammation — pain, swelling, gut symptoms, skin changes, fatigue or something else?",
        "Is there visible swelling, fever, unexplained weight loss or persistent pain?",
        "Have you had any recent infection, injury or new medicine?",
      ],
      suggestedPrompts: ["My joints keep hurting", "I am bloated most days", "I am always tired", "I have swelling and pain"],
    },
  },
  {
    terms: ["always sick", "keep getting sick", "weak immune", "low immunity", "immune system weak", "boost immunity"],
    clarification: {
      trigger: "frequent-illness",
      intro: "Getting sick often can have very ordinary explanations, but it is worth understanding the pattern before reaching for an ‘immune booster’.",
      questions: [
        "What kinds of illnesses keep happening — colds, chest infections, stomach problems, skin infections or something else?",
        "How often is it happening and how long does recovery take?",
        "Are sleep, nutrition, stress, diabetes, medicines or smoking possible contributors?",
      ],
      suggestedPrompts: ["I keep getting respiratory infections", "I recover very slowly", "I am always tired", "My blood sugar is high"],
    },
  },
  {
    terms: ["hormones off", "hormone imbalance", "my hormones", "hormonal", "hormones feel off"],
    clarification: {
      trigger: "hormone-unspecified",
      intro: "‘Hormones feel off’ is understandable, but symptoms alone cannot tell us which hormone — if any — is the issue. The pattern matters first.",
      questions: [
        "What are you noticing — periods or menopause symptoms, low libido, erectile problems, weight change, hair loss, heat/cold intolerance or fatigue?",
        "What is your age and, if relevant, menstrual or menopause stage?",
        "Have you had any previous thyroid, testosterone, menopause or other hormone testing?",
      ],
      suggestedPrompts: ["I have menopause symptoms", "My libido is very low", "I think my thyroid is slow", "I am gaining weight and tired"],
    },
  },
  {
    terms: ["full body check", "full health check", "check everything", "whole body check", "complete checkup", "complete check up", "health screening"],
    clarification: {
      trigger: "screening-unspecified",
      intro: "A good health check should be broad enough to find important risks, but not so random that it creates unnecessary tests and false alarms.",
      questions: [
        "How old are you, and are there major family-history risks such as heart disease, diabetes or cancer?",
        "Do you have any current symptoms that need diagnostic assessment rather than routine screening?",
        "What screening have you already had in the last few years?",
      ],
      suggestedPrompts: ["I want a preventive health screening", "Cancer runs in my family", "My blood pressure is high", "I have no symptoms but want a baseline"],
    },
  },
];

function normalise(value: string) {
  return value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9+\-\s']/g, " ").replace(/\s+/g, " ").trim();
}

export function getLingClarification(question: string): LingClarification | null {
  const q = normalise(question);
  if (!q) return null;
  for (const item of vaguePatterns) {
    if (item.terms.some((term) => q.includes(normalise(term)))) return item.clarification;
  }
  return null;
}
