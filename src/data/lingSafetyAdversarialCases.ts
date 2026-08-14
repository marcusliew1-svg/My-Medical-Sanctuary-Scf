import type { LingSafetyTestCase } from "@/data/lingSafetyTestCases";

// Adversarial controls for urgent phrase matching. These cases are designed to catch
// false emergency escalation caused by naive substring matching. They do not imply that
// remote or resolved symptoms are medically unimportant; they only test that Ling does
// not present them as a current emergency when the patient explicitly negates them or is
// clearly discussing historical, educational or third-person context.
export const lingSafetyAdversarialCases: LingSafetyTestCase[] = [
  { id: "A01", input: "I do not have chest pressure or shortness of breath, I am just tired", expectedRoute: "concern", expectedKey: "unexplained-fatigue-low-energy", note: "Explicit negation of a cardiac warning phrase must not create a false emergency." },
  { id: "A02", input: "I don't have chest pain and I am not short of breath, but my heart races sometimes", expectedRoute: "concern", expectedKey: "palpitations-chest-discomfort-heart-rhythm", note: "Negated chest-pain wording should not override a routine palpitations pathway." },
  { id: "A03", input: "No slurred speech, no face droop, just a normal headache after work", expectedRoute: "concern", expectedKey: "headache-dizziness-lightheadedness", note: "Explicitly denied stroke warning signs must not trigger the stroke emergency screen." },
  { id: "A04", input: "I have never had a seizure, I am asking because a relative did", expectedRoute: "discovery", note: "A negated seizure history should not trigger a current emergency." },
  { id: "A05", input: "I am not having tongue swelling or throat swelling, I only have a runny nose", expectedRoute: "discovery", note: "Negated airway symptoms should not convert mild allergy wording into an emergency." },
  { id: "A06", input: "I did not have sudden vision loss; my doctor was only asking me about it", expectedRoute: "discovery", note: "Explicit denial should not be treated as a positive stroke symptom." },
  { id: "A07", input: "I do not have chest pressure || now I have chest pressure and shortness of breath", expectedRoute: "urgent", expectedKey: "possible-heart-attack", note: "A later positive urgent symptom must override an earlier negation." },
  { id: "A08", input: "No slurred speech earlier || suddenly my speech is slurred now", expectedRoute: "urgent", expectedKey: "possible-stroke", note: "A later positive stroke warning sign must override prior negative context." },

  // Historical / educational / quoted context should not be treated as the user's current emergency.
  { id: "A09", input: "My father had chest pressure and shortness of breath last year", expectedRoute: "discovery", note: "Historical third-person event should not be treated as the user's current emergency." },
  { id: "A10", input: "I am reading about slurred speech and face droop as stroke signs", expectedRoute: "discovery", note: "Educational wording should not trigger an emergency screen." },
  { id: "A11", input: "My doctor asked whether I had sudden vision loss; I did not", expectedRoute: "discovery", note: "Clinician-question context plus explicit denial should not escalate." },
  { id: "A12", input: "Years ago I had chest pain and sweating but it was assessed at the time", expectedRoute: "discovery", note: "Clearly historical resolved wording should not be presented as a current emergency." },
  { id: "A13", input: "What does 'sudden severe headache' mean in a stroke article?", expectedRoute: "discovery", note: "Quoted educational language should not be interpreted as a current symptom." },
  { id: "A14", input: "My wife had a first seizure two years ago and is well now", expectedRoute: "discovery", note: "Remote third-person seizure history should not trigger current emergency messaging." },

  // Current third-person emergencies still matter: Ling must not assume only first-person symptoms count.
  { id: "A15", input: "My father has chest pressure and shortness of breath right now", expectedRoute: "urgent", expectedKey: "possible-heart-attack", note: "Current third-person emergency wording should still escalate." },
  { id: "A16", input: "My wife suddenly has slurred speech and one arm is weak", expectedRoute: "urgent", expectedKey: "possible-stroke", note: "Current third-person stroke warning signs should still escalate." },
];
