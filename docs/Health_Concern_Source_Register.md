# Health Concern Source Register

This register records authoritative references used while drafting or checking the MMS Health Concern Library and Ling's conservative urgent-symptom priority layer. It is a governance aid, not proof that any page is clinically or regulatorily approved for publication.

## Current review status

- Website health-education indexing remains disabled by default.
- Every concern still requires MMS clinical review, Malaysia/Thailand applicability review and advertising/compliance review before indexable public use.
- Emergency-routing language should receive a separate clinical safety review before live patient use.
- The initial 70-case Ling safety regression matrix is a software/content safety aid, not clinical validation.
- References should be checked again at each medical-review cycle because recommendations and terminology can change.

## Expanded concern references

### Palpitations / heart-rhythm concerns
- American Heart Association — Symptoms, Diagnosis and Monitoring of Arrhythmia
  https://www.heart.org/en/health-topics/arrhythmia/symptoms-diagnosis--monitoring-of-arrhythmia
- American Heart Association — Heart palpitations: causes, symptoms and when to worry (2026)
  https://www.heart.org/en/news/2026/02/09/how-serious-are-heart-palpitations-causes-symptoms-and-when-to-worry

### Thyroid symptoms
- American Thyroid Association — Adult Hypothyroidism
  https://www.thyroid.org/hypothyroidism/

### Urinary / prostate symptoms
- U.S. National Institute of Diabetes and Digestive and Kidney Diseases — Enlarged Prostate (Benign Prostatic Hyperplasia)
  https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems/enlarged-prostate-benign-prostatic-hyperplasia

### Hair loss
- American Academy of Dermatology — Hair loss overview, causes, diagnosis and treatment
  https://www.aad.org/public/diseases/hair-loss

### Memory / brain-health concerns
- U.S. National Institute on Aging — Memory loss and forgetfulness
  https://www.nia.nih.gov/health/memory-loss-and-forgetfulness
- U.S. National Institute on Aging — Memory Problems, Forgetfulness, and Aging
  https://www.nia.nih.gov/health/alzheimers-symptoms-and-diagnosis/do-memory-problems-always-mean-alzheimers-disease

### Muscle loss / sarcopenia
- NIH News in Health — Slowing Sarcopenia (2025)
  https://newsinhealth.nih.gov/2025/04/slowing-sarcopenia
- U.S. National Institute on Aging — Falls and Fractures in Older Adults
  https://www.nia.nih.gov/health/falls-and-falls-prevention/falls-and-fractures-older-adults-causes-and-prevention

### Bone health / osteoporosis
- National Institute of Arthritis and Musculoskeletal and Skin Diseases — Osteoporosis
  https://www.niams.nih.gov/health-topics/osteoporosis
- NIAMS — Osteoporosis: Diagnosis, Treatment, and Steps to Take
  https://www.niams.nih.gov/health-topics/osteoporosis/diagnosis-treatment-and-steps-to-take
- NIAMS — Bone Mineral Density Tests: What the Numbers Mean (reviewed 2025)
  https://www.niams.nih.gov/health-topics/bone-mineral-density-tests-what-numbers-mean

## Urgent-symptom priority references

These sources support the conservative wording used to suppress routine Ling pathways when a patient describes potentially time-critical symptoms.

### Possible heart attack
- American Heart Association — Warning Signs of a Heart Attack
  https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack
- American Heart Association — Heart Attack, Stroke and Cardiac Arrest Symptoms
  https://www.heart.org/en/about-us/heart-attack-and-stroke-symptoms

### Possible stroke / TIA
- U.S. Centers for Disease Control and Prevention — Signs and Symptoms of Stroke
  https://www.cdc.gov/stroke/signs-symptoms/index.html
- U.S. Centers for Disease Control and Prevention — About Stroke
  https://www.cdc.gov/stroke/about/index.html

### Severe allergic reaction / anaphylaxis
- U.S. National Library of Medicine, MedlinePlus — Anaphylaxis
  https://medlineplus.gov/anaphylaxis.html
- MedlinePlus Medical Encyclopedia — Allergic reactions
  https://medlineplus.gov/ency/article/000005.htm

### Seizure / loss of responsiveness
- NHS — What to do if someone has a seizure (fit)
  https://www.nhs.uk/symptoms/what-to-do-if-someone-has-a-seizure-fit/
- MedlinePlus Medical Encyclopedia — Recognizing medical emergencies
  https://medlineplus.gov/ency/article/001927.htm

## Safety regression use

The emergency references above are also used to review the urgent-priority cases in `src/data/lingSafetyTestCases.ts` and `docs/Ling_Clinical_Safety_Test_Matrix.md`.

The regression set deliberately includes both:

- urgent examples that should suppress normal MMS pathways; and
- nearby non-urgent controls to reduce false alarms.

No urgent software rule should be treated as clinically approved merely because it passes the regression matrix.

## Source-use rule for Ling

Production Ling should retrieve the MMS-reviewed concern record first for routine education, but a clinically reviewed urgent-symptom priority layer must run before ordinary concern, treatment, screening or promotional routing. External references may support or update those reviewed records, but the model should not freely blend external text into patient advice without a governed retrieval and review process.

The patient-facing answer should retain:

1. a plain-English explanation;
2. sensible first checks;
3. red-flag escalation;
4. evidence context for related treatment topics;
5. a clear qualified-professional handoff;
6. source/version identifiers in the internal audit object.

For an urgent-priority match, the patient-facing answer should instead suppress routine treatment, wellness, screening and booking prompts and direct the person toward local emergency medical care.
