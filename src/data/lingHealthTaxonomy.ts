export type LingAssessmentRoute = "general-assessment" | "metabolic" | "cardiovascular" | "hormone" | "sleep" | "gut" | "musculoskeletal" | "cancer-screening" | "specialist-oncology";

export type LingConcernTaxonomy = {
  slug: string;
  family: string;
  aliases: string[];
  relatedSlugs: string[];
  assessmentRoute: LingAssessmentRoute;
  routeLabel: string;
};

// This taxonomy is a navigation layer over the reviewed MMS health-concern library.
// It does not diagnose. It helps Ling recognise everyday language, surface overlapping
// concern guides and choose the safest assessment-first route for a discussion.
export const lingHealthTaxonomy: LingConcernTaxonomy[] = [
  {
    slug: "unexplained-fatigue-low-energy",
    family: "Energy & recovery",
    aliases: ["tired", "mostly tired", "always tired", "tired all the time", "fatigue", "low energy", "exhausted", "no energy", "weak and tired", "burnt out", "burned out"],
    relatedSlugs: ["poor-sleep-stress-recovery", "snoring-daytime-sleepiness-sleep-apnoea", "prediabetes-insulin-resistance", "low-libido-low-testosterone-symptoms"],
    assessmentRoute: "general-assessment",
    routeLabel: "Start with a broad health assessment so common medical, sleep, metabolic and medication-related causes are not missed.",
  },
  {
    slug: "weight-gain-metabolic-health",
    family: "Metabolic health",
    aliases: ["weight gain", "gained weight", "gaining weight", "putting on weight", "lose weight", "can't lose weight", "overweight", "obesity", "metabolic health", "belly fat", "waist getting bigger"],
    relatedSlugs: ["prediabetes-insulin-resistance", "fatty-liver-metabolic-liver-health", "high-blood-pressure-cardiovascular-risk", "snoring-daytime-sleepiness-sleep-apnoea"],
    assessmentRoute: "metabolic",
    routeLabel: "Start with weight history plus blood pressure, glucose, liver, lipid and sleep-risk review rather than treating weight as an isolated number.",
  },
  {
    slug: "low-libido-low-testosterone-symptoms",
    family: "Men's hormonal health",
    aliases: ["low testosterone", "testosterone", "low libido", "no sex drive", "sex drive", "male hormone", "low male hormone", "low t"],
    relatedSlugs: ["erectile-dysfunction-mens-health", "poor-sleep-stress-recovery", "weight-gain-metabolic-health"],
    assessmentRoute: "hormone",
    routeLabel: "Start with symptoms, medicines, sleep, metabolic health and properly timed testing where a clinician thinks it is indicated.",
  },
  {
    slug: "knee-osteoarthritis-joint-pain",
    family: "Joints & recovery",
    aliases: ["knee pain", "knee hurts", "my knee hurts", "joint pain", "arthritis", "osteoarthritis", "stiff knee", "swollen knee", "prp for knee", "prgf"],
    relatedSlugs: [],
    assessmentRoute: "musculoskeletal",
    routeLabel: "Confirm the cause and severity of the joint problem first, then compare standard care and procedure options for that exact diagnosis.",
  },
  {
    slug: "poor-sleep-stress-recovery",
    family: "Sleep & recovery",
    aliases: ["poor sleep", "sleep is poor", "sleeping badly", "can't sleep", "cannot sleep", "insomnia", "stress", "stressed", "slow recovery", "not recovering", "sleep badly", "not sleeping"],
    relatedSlugs: ["snoring-daytime-sleepiness-sleep-apnoea", "unexplained-fatigue-low-energy"],
    assessmentRoute: "sleep",
    routeLabel: "Start by separating sleep quantity, sleep quality, stress, medicines, pain and possible sleep-disordered breathing.",
  },
  {
    slug: "digestive-gut-symptoms",
    family: "Gut & digestion",
    aliases: ["gut", "gut health", "bloating", "bloated", "digestive", "stomach", "bowel", "constipation", "diarrhea", "diarrhoea", "microbiome", "irritable bowel"],
    relatedSlugs: [],
    assessmentRoute: "gut",
    routeLabel: "Start with the pattern, duration, diet, medicines and alarm symptoms before assuming a microbiome problem or choosing a cleanse.",
  },
  {
    slug: "cancer-risk-early-detection",
    family: "Cancer screening",
    aliases: ["cancer screening", "cancer blood test", "mced", "multi cancer test", "cancer risk", "early detection", "family history cancer", "check for cancer", "screen for cancer"],
    relatedSlugs: ["blood-cancer-car-t-specialist-care"],
    assessmentRoute: "cancer-screening",
    routeLabel: "Start with established age- and risk-appropriate screening, then discuss newer tests separately so they are not mistaken for a diagnosis or replacement for standard screening.",
  },
  {
    slug: "blood-cancer-car-t-specialist-care",
    family: "Specialist oncology",
    aliases: ["car-t", "cart therapy", "lymphoma", "myeloma", "leukaemia", "leukemia", "blood cancer", "cell therapy cancer"],
    relatedSlugs: ["cancer-risk-early-detection"],
    assessmentRoute: "specialist-oncology",
    routeLabel: "This belongs in specialist oncology. The exact cancer subtype, prior treatment and approved product pathway need expert review.",
  },
  {
    slug: "menopause-hot-flushes-hormone-changes",
    family: "Women's hormonal health",
    aliases: ["menopause", "perimenopause", "hot flush", "hot flashes", "hot flash", "night sweats", "hrt", "menopause symptoms", "period changing"],
    relatedSlugs: ["poor-sleep-stress-recovery"],
    assessmentRoute: "hormone",
    routeLabel: "Start with symptoms, menstrual stage and personal risk factors; hormone treatment is a clinician-led benefit-risk decision, not a one-test decision.",
  },
  {
    slug: "fatty-liver-metabolic-liver-health",
    family: "Liver & metabolic health",
    aliases: ["fatty liver", "liver fat", "masld", "nafld", "liver health", "fat on liver", "liver ultrasound"],
    relatedSlugs: ["weight-gain-metabolic-health", "prediabetes-insulin-resistance", "high-blood-pressure-cardiovascular-risk"],
    assessmentRoute: "metabolic",
    routeLabel: "Review liver risk together with weight, glucose, blood pressure, lipids, alcohol and medicines, with fibrosis assessment when clinically indicated.",
  },
  {
    slug: "high-blood-pressure-cardiovascular-risk",
    family: "Heart & circulation",
    aliases: ["high blood pressure", "blood pressure", "hypertension", "heart risk", "cardiovascular", "heart check", "heart health", "bp high"],
    relatedSlugs: ["weight-gain-metabolic-health", "prediabetes-insulin-resistance", "erectile-dysfunction-mens-health"],
    assessmentRoute: "cardiovascular",
    routeLabel: "Confirm blood pressure properly and assess the wider cardiovascular picture before adding wellness treatments.",
  },
  {
    slug: "prediabetes-insulin-resistance",
    family: "Blood sugar & metabolism",
    aliases: ["prediabetes", "pre-diabetes", "insulin resistance", "hba1c", "high sugar", "blood sugar", "glucose high", "borderline diabetes"],
    relatedSlugs: ["weight-gain-metabolic-health", "fatty-liver-metabolic-liver-health", "high-blood-pressure-cardiovascular-risk"],
    assessmentRoute: "metabolic",
    routeLabel: "Confirm glucose status and look at weight, blood pressure, lipids, sleep and liver risk together, then decide on sustainable treatment options.",
  },
  {
    slug: "snoring-daytime-sleepiness-sleep-apnoea",
    family: "Sleep breathing",
    aliases: ["snore", "snoring", "sleep apnea", "sleep apnoea", "daytime sleepiness", "sleepy in day", "stop breathing in sleep", "choking in sleep", "gasping at night"],
    relatedSlugs: ["poor-sleep-stress-recovery", "unexplained-fatigue-low-energy", "weight-gain-metabolic-health", "high-blood-pressure-cardiovascular-risk"],
    assessmentRoute: "sleep",
    routeLabel: "Possible sleep apnoea needs proper sleep assessment and testing where indicated; general recovery treatments should not substitute for that work-up.",
  },
  {
    slug: "erectile-dysfunction-mens-health",
    family: "Men's sexual health",
    aliases: ["erectile dysfunction", "erection problem", "can't get erection", "cannot get erection", "ed problem", "sexual performance", "men's health", "mens health"],
    relatedSlugs: ["low-libido-low-testosterone-symptoms", "high-blood-pressure-cardiovascular-risk", "prediabetes-insulin-resistance"],
    assessmentRoute: "cardiovascular",
    routeLabel: "Start with blood-vessel, metabolic, medicine, hormone, sleep and psychological factors before jumping to hormone or regenerative procedures.",
  },
];

export function getLingTaxonomy(slug: string) {
  return lingHealthTaxonomy.find((item) => item.slug === slug);
}
