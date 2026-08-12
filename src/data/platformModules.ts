export const platformModules = [
  {
    title: "SCF Lab Roadmap",
    href: "/scf-lab-roadmap",
    eyebrow: "Future Capability",
    text: "A carefully staged roadmap for deeper clinical and lab capability, subject to regulatory, licensing, funding, technical and professional requirements.",
  },
  {
    title: "International Medicine Access Intelligence",
    href: "/international-medicine-access",
    eyebrow: "Access Intelligence",
    text: "Education on how medicine availability and costs may differ by country, with future coordination through appropriate licensed professionals.",
  },
  {
    title: "Ling Virtual Health Guide",
    href: "/ling",
    eyebrow: "Education Layer",
    text: "A guided education experience that helps people understand health concepts, prepare questions and find the right MMS next step.",
  },
] as const;

export const medicineAccessFactors = [
  "Country registration and regulatory status",
  "Licensed pharmacy and dispensing rules",
  "Manufacturer access and supply pathways",
  "Currency, taxes and importation costs",
  "Prescription and suitability requirements",
  "Continuity of follow-up and monitoring",
] as const;

export const lingBoundaries = [
  "Ling can explain general health and wellness concepts in plain language.",
  "Ling can help visitors prepare better questions before speaking with MMS.",
  "Ling can guide visitors toward screening, memberships, education or contact pathways.",
  "Ling does not diagnose, prescribe, recommend dosage or interpret personal medical results.",
] as const;
