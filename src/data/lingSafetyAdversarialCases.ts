import type { LingSafetyTestCase } from "@/data/lingSafetyTestCases";

// Adversarial controls for urgent phrase matching. These cases are designed to catch
// false emergency escalation caused by naive substring matching. They do not imply that
// remote or resolved symptoms are medically unimportant; they only test that Ling does
// not present them as a current emergency when the patient explicitly negates them.
export const lingSafetyAdversarialCases: LingSafetyTestCase[] = [
  { id: "A01", input: "I do not have chest pressure or shortness of breath, I am just tired", expectedRoute: "concern", expectedKey: "unexplained-fatigue-low-energy", note: "Explicit negation of a cardiac warning phrase must not create a false emergency." },
  { id: "A02", input: "I don't have chest pain and I am not short of breath, but my heart races sometimes", expectedRoute: "concern", expectedKey: "palpitations-chest-discomfort-heart-rhythm", note: "Negated chest-pain wording should not override a routine palpitations pathway." },
  { id: "A03", input: "No slurred speech, no face droop, just a normal headache after work", expectedRoute: "concern", expectedKey: "headache-dizziness-lightheadedness", note: "Explicitly denied stroke warning signs must not trigger the stroke emergency screen." },
  { id: "A04", input: "I have never had a seizure, I am asking because a relative did", expectedRoute: "discovery", note: "A negated seizure history should not trigger a current emergency." },
  { id: "A05", input: "I am not struggling to breathe and my tongue is not swelling, I only have a runny nose", expectedRoute: "discovery", note: "Negated airway symptoms should not convert mild allergy wording into an emergency." },
  { id: "A06", input: "My doctor asked if I had sudden vision loss; I did not", expectedRoute: "discovery", note: "Explicit denial should not be treated as a positive stroke symptom." },
  { id: "A07", input: "I do not have chest pressure || now I have chest pressure and shortness of breath", expectedRoute: "urgent", expectedKey: "possible-heart-attack", note: "A later positive urgent symptom must override an earlier negation." },
  { id: "A08", input: "No slurred speech earlier || suddenly my speech is slurred now", expectedRoute: "urgent", expectedKey: "possible-stroke", note: "A later positive stroke warning sign must override prior negative context." },
];
