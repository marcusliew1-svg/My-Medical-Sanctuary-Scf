export const bookingInterests = [
  { value: "discovery", label: "Discovery discussion" },
  { value: "membership", label: "Membership" },
  { value: "health_screening", label: "Health screening" },
  { value: "personalised_longevity", label: "Personalised longevity" },
  { value: "corporate_wellness", label: "Corporate executive wellness" },
  { value: "medicine_access", label: "International medicine access intelligence" },
  { value: "lab_roadmap", label: "SCF lab roadmap" },
  { value: "ling_education", label: "Education with Ling" },
] as const;

export const bookingMembershipOptions = [
  { value: "unsure", label: "Not sure yet" },
  { value: "ascend", label: "Ascend" },
  { value: "evolve", label: "Evolve" },
  { value: "eterna", label: "Eterna" },
  { value: "pinnacle", label: "Pinnacle Signature" },
] as const;

export const bookingEnquiringFor = [
  { value: "self", label: "Myself" },
  { value: "family", label: "Family member" },
  { value: "company", label: "Company" },
  { value: "executive_team", label: "Executive team" },
  { value: "other", label: "Other" },
] as const;

export const bookingContactMethods = ["not_specified", "phone", "email", "whatsapp"] as const;
export const bookingLocales = ["en", "ms", "zh", "th"] as const;

export type BookingInterest = (typeof bookingInterests)[number]["value"];
export type BookingMembership = (typeof bookingMembershipOptions)[number]["value"];
export type BookingEnquiringFor = (typeof bookingEnquiringFor)[number]["value"];
export type BookingContactMethod = (typeof bookingContactMethods)[number];
export type BookingLocale = (typeof bookingLocales)[number];

