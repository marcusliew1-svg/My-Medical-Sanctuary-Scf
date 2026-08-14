export type EvidenceLevel = "Established clinical pathway" | "Evidence varies / discuss" | "Research or tightly regulated" | "Assessment first";

export type RelatedTopic = {
  label: string;
  href?: string;
  evidence: EvidenceLevel;
  note: string;
};

export type HealthConcern = {
  slug: string;
  title: string;
  searchTitle: string;
  intro: string;
  layman: string;
  firstChecks: string[];
  redFlags: string[];
  relatedTopics: RelatedTopic[];
  seoTerms: string[];
};

export const healthConcerns: HealthConcern[] = [
  {
    slug: "unexplained-fatigue-low-energy",
    title: "Unexplained fatigue & low energy",
    searchTitle: "Why am I always tired? Fatigue, low energy and what to check first",
    intro: "Tiredness is common, but persistent fatigue can have many causes. The safest starting point is to look for an explanation before reaching for an infusion, hormone or supplement.",
    layman: "Think of fatigue as a warning light rather than a diagnosis. Sleep, anaemia, thyroid problems, diabetes, medication effects, mood, infection and other conditions can all feel like 'low energy'.",
    firstChecks: ["Sleep quality and possible sleep apnoea", "Blood count and iron-related causes where appropriate", "Thyroid and glucose/metabolic review when clinically indicated", "Medication, alcohol and lifestyle review", "Symptoms that point to heart, lung, infection or mood-related causes"],
    redFlags: ["Chest pain, fainting or severe breathlessness", "New neurological symptoms", "Unexplained weight loss, persistent fever or night sweats", "Fatigue that is rapidly worsening or seriously limiting daily function"],
    relatedTopics: [
      { label: "Health screening", href: "/treatments#screening-assessment", evidence: "Assessment first", note: "Useful to investigate possible causes; the test panel should follow history and examination." },
      { label: "Hormone review", href: "/treatments", evidence: "Assessment first", note: "Symptoms alone do not diagnose hormone deficiency. Treatment requires appropriate testing and a clinician diagnosis." },
      { label: "IV wellness / NAD+", href: "/treatments", evidence: "Evidence varies / discuss", note: "These should not be presented as a treatment for unexplained fatigue until medical causes have been assessed." },
    ],
    seoTerms: ["persistent fatigue", "always tired", "low energy", "fatigue checkup", "fatigue health screening"],
  },
  {
    slug: "weight-gain-metabolic-health",
    title: "Weight gain & metabolic health",
    searchTitle: "Weight gain, insulin resistance and metabolic health: what to discuss with a doctor",
    intro: "Weight is only one part of metabolic health. Blood pressure, glucose, liver health, cholesterol, sleep, diet, activity and medications often matter together.",
    layman: "The goal is not just to make the scale move. It is to understand why weight is changing and reduce health risks in a way that can be maintained.",
    firstChecks: ["BMI and waist measurement in context", "Blood pressure", "Glucose/HbA1c and lipid profile where appropriate", "Fatty-liver and sleep-apnoea risk", "Diet, activity, medications and weight history"],
    redFlags: ["Rapid unexplained weight change", "Symptoms of very high blood glucose", "Severe abdominal pain or jaundice", "Breathlessness, chest pain or swelling suggesting another medical cause"],
    relatedTopics: [
      { label: "Structured metabolic programme", href: "/treatments", evidence: "Established clinical pathway", note: "Lifestyle treatment is foundational; prescription weight-management medicines can be appropriate for selected patients under clinician review." },
      { label: "GLP-1 / incretin medicines", href: "/treatments", evidence: "Established clinical pathway", note: "Prescription-only, indication-specific and used with diet/activity support and ongoing monitoring." },
      { label: "Hormone review", href: "/treatments", evidence: "Assessment first", note: "Hormone testing may be relevant when symptoms or history suggest a specific endocrine problem; it is not a universal explanation for weight gain." },
    ],
    seoTerms: ["weight gain clinic", "metabolic health", "insulin resistance", "fatty liver risk", "medical weight management"],
  },
  {
    slug: "low-libido-low-testosterone-symptoms",
    title: "Low libido, low energy & possible testosterone deficiency",
    searchTitle: "Low testosterone symptoms: when hormone testing and treatment may be appropriate",
    intro: "Low libido, reduced energy and mood changes can occur with testosterone deficiency, but they are not specific enough to diagnose it on their own.",
    layman: "A symptom is a clue, not proof. Proper diagnosis generally requires compatible symptoms plus consistently low, accurately measured testosterone levels and an assessment of the cause.",
    firstChecks: ["Symptoms and sexual-health history", "Morning testosterone testing when clinically appropriate", "Repeat confirmation of a low result", "Medication, obesity, sleep and fertility plans", "Other pituitary/testicular or systemic causes if indicated"],
    redFlags: ["Severe headache or visual changes with hormone symptoms", "Testicular mass or acute testicular pain", "Symptoms suggesting significant anaemia or severe sleep apnoea", "Fertility concerns before starting any testosterone treatment"],
    relatedTopics: [
      { label: "Hormone review", href: "/treatments", evidence: "Established clinical pathway", note: "Testosterone therapy is for appropriately diagnosed hypogonadism, not simply for normal ageing or nonspecific tiredness." },
      { label: "Metabolic health", href: "/treatments", evidence: "Established clinical pathway", note: "Obesity and some medications can contribute to low testosterone; treating reversible causes may be the first step." },
    ],
    seoTerms: ["low testosterone symptoms", "low libido men", "testosterone test", "hypogonadism", "hormone optimisation men"],
  },
  {
    slug: "knee-osteoarthritis-joint-pain",
    title: "Knee osteoarthritis & persistent joint pain",
    searchTitle: "Knee osteoarthritis, PRP and joint pain: what the evidence means in plain English",
    intro: "Knee osteoarthritis can cause pain, stiffness, swelling and difficulty walking. Most care starts with exercise, weight management when relevant and standard pain-management options.",
    layman: "PRP uses a concentrated portion of your own blood and is sometimes injected into an arthritic knee. It is not the same as regrowing a new joint, and evidence on how much it helps remains variable.",
    firstChecks: ["Confirm that symptoms fit osteoarthritis and rule out other causes", "Assess severity, function and mobility", "Exercise/physiotherapy plan", "Weight management where relevant", "Review standard pain-relief and injection options"],
    redFlags: ["Hot, very swollen joint with fever", "Inability to bear weight after injury", "Sudden severe calf swelling or breathlessness", "Rapidly worsening pain or suspected fracture"],
    relatedTopics: [
      { label: "PRP", href: "/treatments", evidence: "Evidence varies / discuss", note: "NICE reports no major safety concern but limited-quality evidence for efficacy in knee osteoarthritis; governance and informed consent are important." },
      { label: "PRGF", href: "/treatments", evidence: "Evidence varies / discuss", note: "A platelet-derived approach; protocols differ, so evidence should be tied to the exact preparation and indication." },
      { label: "Red-light / photobiomodulation", href: "/treatments", evidence: "Evidence varies / discuss", note: "Evidence depends on the condition, device and dose; it should not replace assessment or established osteoarthritis care." },
      { label: "MSC / stem-cell products", href: "/treatments", evidence: "Research or tightly regulated", note: "Do not describe this as proven cartilage regeneration. Product-specific regulatory status and evidence must be verified." },
    ],
    seoTerms: ["knee osteoarthritis PRP", "PRP knee pain", "joint pain regenerative medicine", "PRGF knee", "osteoarthritis treatment options"],
  },
  {
    slug: "poor-sleep-stress-recovery",
    title: "Poor sleep, stress & slow recovery",
    searchTitle: "Poor sleep, stress and recovery: what to check before choosing a wellness treatment",
    intro: "Sleep and recovery problems are often connected to stress, schedule, alcohol, medications, pain, mood, snoring or sleep apnoea. The cause matters more than the buzzword used to treat it.",
    layman: "If your body feels constantly 'under-recovered', the answer may be better sleep diagnosis and routine changes rather than a single drip or device.",
    firstChecks: ["Sleep duration, timing and consistency", "Snoring, witnessed apnoea and daytime sleepiness", "Alcohol, caffeine and medication review", "Stress, anxiety, mood and pain", "Training load and recovery habits"],
    redFlags: ["Falling asleep while driving or operating machinery", "Witnessed prolonged breathing pauses during sleep", "Severe depression, mania or suicidal thoughts", "New severe headaches or neurological symptoms"],
    relatedTopics: [
      { label: "Health discovery & sleep review", href: "/health-discovery", evidence: "Assessment first", note: "The safest first step is identifying sleep and recovery drivers and deciding whether formal sleep or medical assessment is needed." },
      { label: "Red-light / photobiomodulation", href: "/treatments", evidence: "Evidence varies / discuss", note: "Evidence for broad recovery claims varies by protocol; do not treat it as a substitute for sleep evaluation." },
      { label: "IV wellness / NAD+", href: "/treatments", evidence: "Evidence varies / discuss", note: "These may be discussed as wellness services, but should not be represented as established treatment for insomnia or chronic stress." },
    ],
    seoTerms: ["poor sleep recovery", "stress fatigue", "sleep wellness", "recovery clinic", "sleep apnoea screening"],
  },
  {
    slug: "digestive-gut-symptoms",
    title: "Digestive & gut symptoms",
    searchTitle: "Bloating, bowel changes and gut health: when testing may help and when to see a doctor",
    intro: "Bloating, abdominal discomfort and bowel changes are common, but persistent symptoms can have many causes. A 'microbiome imbalance' should not be assumed without proper assessment.",
    layman: "Gut symptoms can come from diet, intolerance, infection, medicines, IBS and other digestive conditions. The useful question is what pattern fits your symptoms—not what detox product to buy.",
    firstChecks: ["Duration and pattern of symptoms", "Diet, medications and recent infection/travel", "Bowel habit and alarm features", "Basic testing or specialist referral where indicated", "Nutrition review before expensive microbiome testing"],
    redFlags: ["Blood in stool or black stool", "Unexplained weight loss", "Persistent vomiting, fever or severe abdominal pain", "New persistent bowel change, especially with anaemia or family history"],
    relatedTopics: [
      { label: "Gut-health review", href: "/treatments", evidence: "Assessment first", note: "Nutrition, symptoms and appropriate medical testing should lead the pathway." },
      { label: "Microbiome testing", href: "/treatments", evidence: "Evidence varies / discuss", note: "Commercial microbiome results do not automatically translate into a validated treatment plan." },
      { label: "Colon cleansing", href: "/treatments", evidence: "Evidence varies / discuss", note: "Not required for routine detoxification and can carry dehydration, electrolyte and bowel-injury risks." },
    ],
    seoTerms: ["bloating gut health", "microbiome test", "digestive symptoms", "IBS wellness", "colon cleansing safety"],
  },
  {
    slug: "cancer-risk-early-detection",
    title: "Cancer risk & early-detection questions",
    searchTitle: "Cancer screening and MCED blood tests: what they can and cannot tell you",
    intro: "Cancer screening works best when established screening is matched to age and risk. New multi-cancer blood tests are promising research tools, but they do not replace proven screening programmes.",
    layman: "A blood test that looks for cancer signals is not the same as diagnosing cancer. A positive result needs proper follow-up, and a negative result cannot guarantee that cancer is absent.",
    firstChecks: ["Age- and sex-appropriate established screening", "Family history and inherited-risk assessment", "Smoking and other major risk factors", "Symptoms that need diagnostic—not screening—evaluation", "Understanding false positives, false negatives and follow-up testing"],
    redFlags: ["A new lump, unexplained bleeding or persistent concerning symptom", "Unexplained weight loss", "Persistent change in bowel habit, swallowing or cough", "Any abnormal screening result requiring timely diagnostic follow-up"],
    relatedTopics: [
      { label: "Established screening", href: "/treatments", evidence: "Established clinical pathway", note: "Use recognised screening programmes according to age, sex, history and local guidance." },
      { label: "MCED", href: "/treatments", evidence: "Research or tightly regulated", note: "MCED is an emerging screening approach, not a diagnosis and not a replacement for standard screening." },
    ],
    seoTerms: ["multi cancer blood test", "MCED Malaysia", "cancer early detection", "cancer screening", "family history cancer screening"],
  },
  {
    slug: "blood-cancer-car-t-specialist-care",
    title: "Certain blood cancers & CAR-T specialist care",
    searchTitle: "CAR-T for lymphoma, multiple myeloma and B-cell leukaemia: a plain-English guide",
    intro: "CAR-T is a highly specialised cancer treatment used for certain blood cancers. It is not a general immune booster, wellness infusion or anti-ageing therapy.",
    layman: "Doctors collect a patient's T cells, genetically equip them to recognise a specific cancer target, grow them in a laboratory and infuse them back. This is intensive hospital oncology care.",
    firstChecks: ["Exact cancer diagnosis and subtype", "Previous treatment history and disease status", "Whether an approved/appropriate CAR-T product matches the indication", "Fitness for treatment and specialist-centre assessment", "Manufacturing, admission and monitoring pathway"],
    redFlags: ["Fever or infection during cancer treatment", "New confusion, seizures or severe neurological symptoms", "Breathing difficulty or low blood pressure", "Any acute deterioration in an oncology patient"],
    relatedTopics: [
      { label: "CAR-T", href: "/treatments", evidence: "Established clinical pathway", note: "Internationally established for selected B-cell leukaemias, lymphomas and multiple myeloma using specific approved products; local availability and regulatory pathway must be verified." },
      { label: "NK-cell therapy", href: "/treatments", evidence: "Research or tightly regulated", note: "An active research and specialist-treatment area; it should not be marketed as equivalent to approved CAR-T indications." },
    ],
    seoTerms: ["CAR-T lymphoma", "CAR-T multiple myeloma", "CAR-T B-cell ALL", "cell therapy cancer", "CAR-T Malaysia"],
  },
];

export function getHealthConcern(slug: string) {
  return healthConcerns.find((item) => item.slug === slug);
}
