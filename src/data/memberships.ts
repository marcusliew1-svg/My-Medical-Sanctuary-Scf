export type Membership = {
  name: string;
  accessNote: string;
  tagline: string;
  whoItSuits: string;
  coordination: string;
  firstThirtyDays: string[];
};

export const memberships: Membership[] = [
  {
    name: "Ascend",
    accessNote: "Discovery-first membership pathway",
    tagline: "Start with clarity.",
    whoItSuits:
      "Individuals beginning a structured wellness journey who want screening, coordination and professional review.",
    coordination:
      "Health Relationship Manager coordination for discovery, appointment guidance and follow-up reminders.",
    firstThirtyDays: [
      "Discovery discussion",
      "Baseline screening pathway",
      "Professional review planning",
      "Personalised wellness roadmap",
    ],
  },
  {
    name: "Evolve",
    accessNote: "Personalised coordination pathway",
    tagline: "Optimise your potential.",
    whoItSuits:
      "Members who want closer coordination for energy, weight, metabolic health and lifestyle optimisation.",
    coordination:
      "HRM coordination with structured check-ins, service navigation and review preparation.",
    firstThirtyDays: [
      "Discovery and goals mapping",
      "Screening and lifestyle review",
      "Suitability assessment",
      "Quarterly coordination plan",
    ],
  },
  {
    name: "Eterna",
    accessNote: "Long-term preventive care pathway",
    tagline: "Protect your future.",
    whoItSuits:
      "Members planning for preventive care, personalised longevity and long-term wellness oversight.",
    coordination:
      "Priority HRM coordination, review scheduling and longitudinal wellness roadmap support.",
    firstThirtyDays: [
      "Expanded discovery",
      "Preventive health planning",
      "Professional review coordination",
      "Long-term roadmap setup",
    ],
  },
  {
    name: "Pinnacle",
    accessNote: "By invitation and suitability assessment",
    tagline: "Private, highly coordinated care.",
    whoItSuits:
      "Executives, founders and families seeking a highly coordinated preventive care relationship.",
    coordination:
      "Dedicated HRM coordination, personalised service planning and priority appointment support.",
    firstThirtyDays: [
      "Private discovery session",
      "Clinical suitability review",
      "Bespoke coordination plan",
      "Executive wellness roadmap",
    ],
  },
];
