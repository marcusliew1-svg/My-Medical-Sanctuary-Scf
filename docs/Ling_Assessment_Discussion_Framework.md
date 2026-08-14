# Ling Assessment Discussion Framework

## Purpose

Ling may help a patient organise what a sensible assessment discussion could look like after a relevant MMS health concern has been identified.

This is not a test-ordering engine, diagnostic pathway or personalised medical plan. It is a preparation layer that helps the patient bring useful information to a qualified professional and understand why targeted assessment should come before treatment shopping.

## Patient-facing sequence

For a matched health concern, Ling should organise the next step into four layers:

1. **Put the story in order**
   - when the problem started;
   - whether it is changing;
   - what happens with it;
   - relevant medical history, medicines, supplements, allergies and recent changes.

2. **Bring the useful baseline**
   - use measurements, previous results and background information that are relevant to the concern;
   - prefer concern-family context such as sleep/recovery, metabolic risk, cardiovascular risk, gut pattern or screening history over an indiscriminate test list.

3. **Discuss targeted checks**
   - only surface checks already present in the clinically reviewed MMS Health Concern Library;
   - say that a qualified professional decides which checks are actually appropriate;
   - do not convert the library into an automatic order set.

4. **Decide the next level only after review**
   - specialist referral, imaging, additional testing or treatment should follow the history, examination and relevant results;
   - Ling may explain why a specialist pathway could be discussed but may not decide that the patient needs one.

## Retrieval rule

The assessment discussion must be generated from:

1. the matched reviewed health concern;
2. its approved concern family/taxonomy;
3. the concern's reviewed `firstChecks[]`;
4. approved overlap information;
5. patient-provided context from the current conversation.

The model must not invent a broad laboratory panel, imaging package or screening package from general model knowledge.

## Treatment boundary

If a patient mentions a treatment alongside a symptom, the symptom/concern pathway remains primary. Example:

- “I am tired and wondering about NAD+” → fatigue assessment context first;
- “What is NAD+?” → treatment education may be shown directly.

A treatment topic can be linked after assessment context, but Ling must not imply that the treatment is the logical or recommended result of the assessment.

## Safety boundary

Urgent-priority routing always runs before this framework. If an urgent rule matches, the assessment-plan layer is suppressed together with routine treatment, wellness, screening and booking content.

## Production answer fields

A future structured answer can include:

- `assessment_plan[]`
  - `title`
  - `purpose`
  - `items[]`
- `assessment_route`
- `first_checks_source_ids[]`
- `patient_context_used[]`
- `doctor_handoff`
- `medical_review_version`

This makes it possible to show the same governed assessment-preparation logic in the website, patient app and clinician handoff while preserving source and review history.

## Language standard

Use phrases such as:

- “may be worth discussing”;
- “a clinician may decide whether this is relevant”;
- “bring any previous results if you have them”;
- “the useful next step is to organise the assessment, not to order everything.”

Avoid phrases such as:

- “you need these tests”;
- “Ling recommends this panel”;
- “this will diagnose the problem”;
- “complete these tests before seeing the doctor”;
- “this treatment is the next step.”

## Goal

Ling should help a patient arrive at a consultation better organised, better informed and less likely to jump from a symptom directly to a marketed treatment. The qualified professional remains responsible for diagnosis, examination, investigation selection, interpretation and treatment decisions.
