# Ling Health-Concern Knowledge Architecture

## Purpose

Ling's patient-facing health guidance should be grounded first in MMS's reviewed Health Concern Library, then connected to treatment education, screening pathways and qualified human review.

The Health Concern Library is not a diagnostic engine. It is a structured educational and routing layer that helps a person move from an everyday question such as “Why am I always tired?” to a safer and more useful discussion.

## Core flow

1. **Understand the patient's words**
   - Accept everyday language, symptoms, goals and concerns.
   - Do not require the patient to know medical terminology.

2. **Match to one or more relevant health-concern pathways**
   - Examples: persistent fatigue, metabolic health, menopause, high blood pressure, prediabetes, sleep apnoea, gut symptoms, joint pain or cancer-screening questions.
   - Matching is a navigation aid, not a diagnosis.

3. **Explain in the MMS patient-language standard**
   - The short answer.
   - What that actually means in plain English.
   - What may be worth checking first.
   - Where treatment or screening topics may fit.
   - Where Ling stops and a qualified professional takes over.

4. **Show red flags early**
   - If the concern library contains urgent warning signs, Ling should surface them clearly.
   - Ling must not bury urgent-care advice below promotional content.

5. **Connect to treatment education only after context**
   - Treatments are topics for discussion, not automatically recommended solutions.
   - Evidence labels and regulatory boundaries from the treatment library should remain visible.

6. **Escalate to human care**
   - Personal diagnosis, prescribing, treatment selection, contraindication assessment and interpretation of patient-specific investigations belong to qualified professionals.

## Recommended production architecture

The current website prototype uses deterministic concern matching for demonstration. A production Ling should use retrieval rather than rely on a large model's memory alone.

Suggested retrieval order:

1. MMS Health Concern Library
2. MMS Treatment Education Library
3. MMS approved screening and membership rules
4. MMS clinical SOP / approved medical knowledge base
5. Authoritative external evidence sources when enabled and reviewed
6. Patient-specific records only after authentication, consent and role checks

The AI model should generate the explanation **from retrieved reviewed material**, not invent a treatment plan from general model knowledge.

## Required answer object for a health concern

A production answer should ideally be structured before it is rendered to the patient:

- `patient_question`
- `matched_concerns[]`
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

## Guardrails

Ling must not:

- say a patient definitely has a condition based only on their question;
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

Before live clinical use, the library should move from static website content into a governed content store with review status and auditability.

## Positioning

Ling should feel like a knowledgeable health navigator that can explain complex health topics in normal language and prepare patients for better decisions. She is not positioned as an autonomous doctor.
