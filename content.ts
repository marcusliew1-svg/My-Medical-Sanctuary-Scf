export const navigation = [
  { label: "Home", href: "/" },
  { label: "About MMS", href: "/about-mms" },
  { label: "Our Philosophy", href: "/our-philosophy" },
  { label: "Membership", href: "/membership" },
  { label: "Knowledge Hub", href: "/health-articles" },
  { label: "Ling", href: "/ling" },
  { label: "Contact", href: "/contact" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Privacy / PDPA", href: "/privacy-pdpa" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Terms", href: "/terms" },
];

export const lingDisclaimer =
  "Ling is an AI Health Education Companion. Ling provides educational information only and does not diagnose, prescribe, or replace an MMS doctor.";

export const journeyCards = [
  {
    title: "Understand My Health",
    text: "Start with screening, doctor review, and a clear baseline of where your health stands today.",
  },
  {
    title: "Improve My Energy",
    text: "Explore lifestyle, metabolic, sleep, and nutritional factors that may be affecting daily vitality.",
  },
  {
    title: "Optimise My Weight",
    text: "Build a more informed plan around body composition, habits, and clinical suitability.",
  },
  {
    title: "Support Healthy Ageing",
    text: "Identify risks earlier and plan long-term strategies for strength, resilience, and independence.",
  },
  {
    title: "Improve Gut Health",
    text: "Understand digestive patterns, lifestyle drivers, and education-led next steps with your care team.",
  },
  {
    title: "Learn About Regenerative Medicine",
    text: "Get clear education before considering advanced therapies, with doctor-led suitability review.",
  },
];

export const primaryServices = [
  {
    title: "Health Screening",
    href: "/health-screening",
    text: "Comprehensive screening to understand current health status and identify potential risks earlier.",
  },
  {
    title: "Preventive Care",
    href: "/preventive-care",
    text: "Doctor-led planning focused on early detection, risk awareness, and long-term follow-up.",
  },
  {
    title: "Longevity Medicine",
    href: "/longevity-medicine",
    text: "Personalised health optimisation with evidence-informed guidance and suitability review.",
  },
  {
    title: "IV Therapy",
    href: "/iv-therapy",
    text: "Supportive wellness therapies subject to doctor assessment and individual suitability.",
  },
  {
    title: "Weight Management",
    href: "/weight-management",
    text: "Structured assessment and planning for metabolic health, habits, and sustainable progress.",
  },
  {
    title: "Corporate Wellness",
    href: "/corporate-wellness",
    text: "Preventive health programmes for leadership teams, employees, and corporate partners.",
  },
];

export const assuranceCopy =
  "Subject to doctor assessment. Suitable candidates only. Individual outcomes vary.";

export const conversionActions = [
  { label: "Book Appointment", href: "/book-appointment" },
  { label: "WhatsApp", href: "/contact" },
  { label: "Call Clinic", href: "/contact" },
];

export const corporatePages = [
  { title: "Home", href: "/" },
  { title: "About MMS", href: "/about-mms" },
  { title: "Our Philosophy", href: "/our-philosophy" },
  { title: "Health Screening", href: "/health-screening" },
  { title: "Preventive Care", href: "/preventive-care" },
  { title: "Longevity Medicine", href: "/longevity-medicine" },
  { title: "IV Therapy", href: "/iv-therapy" },
  { title: "Weight Management", href: "/weight-management" },
  { title: "Corporate Wellness", href: "/corporate-wellness" },
  { title: "Professional Alliance Programme", href: "/professional-alliance-programme" },
  { title: "Medical Tourism (Future)", href: "/medical-tourism" },
  { title: "Health Articles / Blog", href: "/health-articles" },
  { title: "FAQ", href: "/faq" },
  { title: "Contact", href: "/contact" },
  { title: "Book Appointment", href: "/book-appointment" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms of Use", href: "/terms-of-use" },
];

export const membershipTiers = [
  {
    name: "Ascend",
    promise: "Start Strong",
    text: "For patients beginning a structured preventive healthcare journey with screening, review, and follow-up.",
  },
  {
    name: "Evolve",
    promise: "Optimise Your Potential",
    text: "For patients ready to improve energy, metabolism, lifestyle patterns, and measurable health markers.",
  },
  {
    name: "Eterna",
    promise: "Protect Your Future",
    text: "For long-term health planning focused on resilience, ageing well, and continuity of care.",
  },
  {
    name: "Pinnacle Signature",
    promise: "By Invitation & Clinical Suitability",
    text: "A highly personalised journey for complex goals, advanced diagnostics, and close clinical oversight.",
  },
];

export const knowledgeCategories = [
  "Understand Your Health",
  "Optimise Your Health",
  "Longevity",
  "Regenerative Medicine",
];

export const lingOptions = [
  "I want a health screening",
  "I want to improve my energy",
  "I want to manage my weight",
  "I want to learn about longevity",
  "I'm looking for regenerative medicine",
  "I'm not sure where to start",
];

export const serviceQualities = [
  "Doctor-led",
  "Personalised",
  "Long-term",
  "Technology-supported",
];

export const zohoLeadFieldMapping = [
  ["Full Name", "Full Name"],
  ["Mobile Number", "Mobile"],
  ["Email", "Email"],
  ["Country", "Country"],
  ["Preferred Language", "Preferred Language"],
  ["Interested In", "Interested Service"],
  ["Preferred Contact Method", "Preferred Contact Method"],
  ["Preferred Appointment Date", "Next Follow-up / Appointment Preference"],
  ["Source", "Website"],
  ["Consent to Contact", "Consent to Contact"],
] as const;
