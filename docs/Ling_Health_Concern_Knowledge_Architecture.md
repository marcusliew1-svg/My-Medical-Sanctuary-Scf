# Ling Health-Concern Knowledge Architecture

## Purpose

Ling's patient-facing health guidance should be grounded first in MMS's reviewed Health Concern Library, then connected to treatment education, screening pathways and qualified human review.

The Health Concern Library is not a diagnostic engine. It is a structured educational and routing layer that helps a person move from an everyday question such as “Why am I always tired?” to a safer and more useful discussion.

## Core flow

1. **Understand the patient's words**
   - Accept everyday language, symptoms, goals and concerns.
   - Do not require the patient to know medical terminology.

2. **Run urgent priority before ordinary health routing**
   - A conservative, clinically reviewed urgent layer must run before concern matching, clarification, screening, treatment education or promotional pathways.
   - If an urgent pattern is matched, Ling suppresses routine wellness/treatment content and directs the person toward local emergency medical care.
   - Ling should say the symptoms *could need urgent assessment* rather than claiming a diagnosis.

3. **Match to one or more relevant health-concern pathways when the question is specific enough**
   - Examples now include fatigue, metabolic health, menopause, blood pressure, prediabetes, sleep apnoea, gut symptoms, joint pain, cancer-screening questions, headaches/dizziness, palpitations, urinary/prostate symptoms, thyroid questions, hair loss, memory changes, muscle loss and bone health.
   - Matching is a navigation aid, not a diagnosis.
   - Do not force every question into one condition. Symptoms often overlap.

4. **Ask targeted follow-up questions when the input is too vague**
   - Examples include “I don't feel right,” “I feel inflamed,” “my hormones feel off,” “I am ageing too fast,” “I keep getting sick,” or “I want a full body check.”
   - Ling should explain why more context is needed, then ask a small number of useful questions rather than returning a generic disclaimer.
   - Follow-up questions should focus on what changed, how long it has been happening, major health risks, medicines/lifestyle changes and whether the situation sounds urgent.
   - Ling may offer patient-friendly prompt choices to help the person describe the problem more clearly.
   - This clarification step is not a medical interview and must not create a diagnosis from the answers.

5. **Use the Ling concern taxonomy**
   - Each reviewed concern can carry everyday aliases, a body/health family, related concern slugs and a preferred assessment route.
   - Example: “always tired” can lead primarily to fatigue while also surfacing sleep apnoea, poor sleep/recovery, metabolic health or hormone-related pathways as possible overlaps.
   - Example: “my heart keeps racing” can lead to a palpitations pathway while also surfacing blood-pressure, thyroid and dizziness/faintness pathways where relevant.
   - Example: “I keep waking to pee” can lead to urinary/prostate education while also keeping diabetes and other urinary causes in view.
   - The taxonomy is designed for retrieval and navigation, not probability-of-disease scoring.

6. **Explain in the MMS patient-language standard**
   - The short answer.
   - What that actually means in plain English.
   - What may be worth checking first.
   - A sensible starting assessment route.
   - Where treatment or screening topics may fit.
   - Where Ling stops and a qualified professional takes over.

7. **Show red flags early**
   - If the concern library contains urgent warning signs that do not already trigger emergency priority, Ling should surface them clearly.
   - Ling must not bury urgent-care advice below promotional content.

8. **Connect to treatment education only after context**
   - Treatments are topics for discussion, not automatically recommended solutions.
   - Evidence labels and regulatory boundaries from the treatment library should remain visible.

9. **Escalate to human care**
   - Personal diagnosis, prescribing, treatment selection, contraindication assessment and interpretation of patient-specific investigations belong to qualified professionals.

## Current taxonomy fields

The website prototype separates the reviewed concern content from a routing taxonomy. The taxonomy contains:

- `slug` — canonical concern identifier;
- `family` — patient-friendly concern family such as Metabolic health, Heart & circulation or Sleep & recovery;
- `aliases[]` — everyday phrases patients may actually type;
- `relatedSlugs[]` — clinically adjacent concern guides that can be shown as possible overlaps;
- `assessmentRoute` — broad routing category rather than a diagnosis;
- `routeLabel` — plain-English explanation of the safest starting route.

This allows the concern content to remain medically reviewed while the language-understanding layer can expand with more patient phrasing over time.

## Clarification layer

The prototype also contains a separate clarification library for common vague inputs. This layer is a conversation aid, not a medical knowledge source.

A clarification object can contain:

- `trigger` — the broad vague-intent family;
- `intro` — why Ling needs more context, in plain English;
- `questions[]` — a small number of useful follow-up questions;
- `suggestedPrompts[]` — patient-friendly descriptions that can route into reviewed concern pathways.

This reduces two common failure modes: giving a shallow “see a doctor” response, or confidently forcing an unclear question into the wrong health concern.

## Current knowledge families

The prototype now covers patient entry points across:

- energy and recovery;
- metabolic and blood-sugar health;
- heart, blood pressure and rhythm concerns;
- sleep and sleep breathing;
- gut and digestion;
- men's hormonal, sexual and prostate/urinary health;
- women's hormonal health;
- liver health;
- joints and recovery;
- neurological/general symptoms such as headache and dizziness;
- thyroid and metabolism;
- skin/hair concerns;
- memory and cognitive health;
- muscle strength / sarcopenia;
- bone health / osteoporosis risk;
- cancer screening and specialist oncology.

This is still not a complete medical symptom checker. The library should expand only where MMS can maintain credible clinical review and safe escalation language.

## Overlap handling

Production Ling should return a ranked set rather than one forced label:

- **Primary concern:** the strongest knowledge match used to structure the first explanation.
- **Possible overlaps:** one to three adjacent concern guides that may also be relevant based on the question and reviewed taxonomy.
- **Assessment route:** the broad first-step pathway that reduces the risk of jumping directly from symptom to treatment.

Ling should say that areas “may overlap” or “may also be worth discussing.” It should not display invented disease probabilities to patients.

## Recommended production architecture

The current website prototype uses deterministic urgent matching, concern matching and clarification logic for demonstration. A production Ling should use retrieval rather than rely on a large model's memory alone.

Suggested routing / retrieval order:

1. Clinically reviewed urgent-priority rules
2. MMS Health Concern Library
3. Ling Health Concern Taxonomy / aliases / overlap graph
4. Ling clarification rules for vague inputs
5. MMS Treatment Education Library
6. MMS approved screening and membership rules
7. MMS clinical SOP / approved medical knowledge base
8. Authoritative external evidence sources when enabled and reviewed
9. Patient-specific records only after authentication, consent and role checks

The AI model should generate the explanation **from retrieved reviewed material**, not invent a treatment plan from general model knowledge.

## Required answer object for a health concern

A production answer should ideally be structured before it is rendered to the patient:

- `patient_question`
- `urgent_priority`
- `urgent_rule_id`
- `needs_clarification`
- `clarifying_questions[]`
- `primary_concern`
- `matched_concerns[]`
- `matched_aliases[]`
- `assessment_route`
- `plain_english_summary`
- `possible_explanations[]`
- `first_checks[]`
- `red_flags[]`
- `related_treatment_topics[]`
- `evidence_context[]`
- `doctor_handoff`
- `source_ids[]`
- `medical_review_version`

This structure allows the website, app, clinician view and audit log to use the same governed answer.

## Safety regression matrix

The repository contains `src/data/lingSafetyTestCases.ts` and `docs/Ling_Clinical_Safety_Test_Matrix.md`.

The initial matrix contains 70 patient-style inputs covering urgent warning patterns, non-urgent controls, specific concern routing, vague-input clarification, multi-turn context, treatment-shopping questions and general discovery.

Recommended release gate:

- 100% pass on urgent-priority cases;
- 100% pass where a later urgent turn must override earlier routine context;
- no urgent response may show treatment, wellness, screening, membership or routine booking CTAs;
- false-positive emergency routing must be reviewed using non-urgent controls;
- every change to urgent rules, taxonomy or clarification logic should re-run the safety matrix;
- clinician sign-off is required before patient use.

This matrix is a regression/safety tool, not clinical validation of Ling as a diagnostic system.

## Source governance

The repository includes `docs/Health_Concern_Source_Register.md` to record authoritative references used while drafting and reviewing concern content and urgent-routing language.

Production rules:

- every patient-facing concern has a named clinical reviewer;
- urgent rules have a named clinical safety reviewer;
- external source updates do not automatically change the patient answer;
- the MMS-reviewed concern/urgent record remains the governed retrieval layer;
- source and review-version identifiers should travel with the internal answer object;
- outdated or unreviewed content should be withdrawable without changing model code.

## Guardrails

Ling must not:

- say a patient definitely has a condition based only on their question;
- display a disease probability unless a validated clinical tool specifically supports it;
- use follow-up questions to create the appearance of a diagnosis;
- continue wellness or treatment promotion after an urgent-priority match;
- say a treatment is suitable without qualified professional review;
- imply an advanced or regulated therapy is automatically available;
- convert experimental evidence into an established-treatment claim;
- treat MCED as a cancer diagnosis;
- treat CAR-T, NK cells, MSCs or exosomes as general wellness options;
- use medical jargon without an immediate plain-English explanation;
- give such a vague answer that the patient learns nothing useful.

## Content governance

Every concern should have:

- a clinical owner/reviewer;
- last-reviewed date;
- evidence/source references;
- country/market applicability where relevant;
- approved related-treatment links;
- red-flag escalation language;
- version history.

Every taxonomy entry should additionally have:

- alias review to avoid ambiguous or misleading triggers;
- approved overlap links;
- approved assessment route;
- a record of changes to routing logic.

Every clarification pattern should be reviewed for:

- whether it is too broad or can accidentally intercept a more specific medical question;
- whether the follow-up questions are understandable and genuinely useful;
- whether any answer combination should trigger urgent escalation rather than routine routing.

Every urgent-priority rule should be reviewed for:

- sensitivity to clinically important wording;
- false-positive risk;
- negation handling;
- colloquial and multilingual phrasing;
- local emergency-service wording in Malaysia and Thailand;
- whether an urgent match fully suppresses ordinary commercial pathways.

Before live clinical use, the library should move from static website content into a governed content store with review status and auditability.

## Positioning

Ling should feel like a knowledgeable health navigator that can explain complex health topics in normal language, recognise when concerns overlap, ask useful follow-up questions when a person is vague, prioritise possible emergencies conservatively and prepare patients for better decisions. She is not positioned as an autonomous doctor.
