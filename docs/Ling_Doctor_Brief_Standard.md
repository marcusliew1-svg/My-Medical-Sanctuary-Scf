# Ling Doctor Brief Standard

## Purpose

The Ling Doctor Brief is a consultation-preparation tool. It organises what the patient has already told Ling together with reviewed MMS health-concern discussion points so the patient does not need to start from zero when speaking with a qualified professional.

It is not a diagnosis, referral decision, test order, prescription, treatment plan or suitability decision.

## What the brief may contain

- the patient's own recent words from the active Ling conversation;
- the primary MMS health-concern pathway used for navigation;
- one to three possible overlapping concern areas from the reviewed taxonomy;
- relevant context the clinician may want to confirm;
- assessment areas grounded in the reviewed concern's first-check list;
- questions the patient may take to the clinician;
- red flags from the reviewed concern record that should be actively reviewed;
- a clear human-review boundary.

## What the brief must not claim

The brief must not say:

- that the patient has a confirmed diagnosis;
- that a red flag is absent unless the patient explicitly denied it and the production system can reliably record that denial;
- that a red flag is present unless the patient explicitly reported it and urgency rules have already been applied;
- that a test is required;
- that a treatment is recommended or suitable;
- that a clinician has approved the contents.

## Patient-reported information

The prototype preserves only the latest few conversation turns in the browser interaction. The Doctor Brief should distinguish patient-reported wording from MMS-reviewed educational content.

Future production storage requires:

- authenticated patient identity;
- explicit consent to save or share the brief;
- role-based access;
- audit logging;
- retention/deletion rules;
- versioned links to the source concern records used to generate the brief.

Until those controls exist, the public prototype must not present the brief as part of a permanent medical record.

## Red-flag handling

Urgent-priority routing always runs before Doctor Brief generation. If an urgent rule matches, routine brief generation should be suppressed and the patient should be directed toward urgent medical assessment.

For non-urgent concern pathways, the brief may list reviewed red flags as **items to review**, not as automatically present or absent findings.

## Handoff design

A future My Sanctuary handoff should require the patient to review the brief before sharing it. The patient should be able to edit or remove any patient-reported line before submission.

The receiving clinician view should clearly distinguish:

1. patient-reported words;
2. Ling-organised concern routing;
3. reviewed MMS discussion prompts;
4. clinician-entered assessment and decisions.

Ling-generated material must never be visually confused with a clinician-authored note.
