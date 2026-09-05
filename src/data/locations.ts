export type LocationStatus = "operational" | "opening_soon" | "planned";

export type MmsLocation = {
  slug: string;
  name: string;
  positioning: string;
  status: LocationStatus;
  city: string;
  address?: string;
  overview: string;
  image: string;
  services?: string[];
};

export const locationStatusLabels: Record<LocationStatus, string> = {
  operational: "Operational",
  opening_soon: "Opening soon",
  planned: "Planned",
};

export const mmsLocations: MmsLocation[] = [
  {
    slug: "bangsar",
    name: "MMS Bangsar",
    positioning: "Wellness & Longevity Flagship",
    status: "planned",
    city: "Kuala Lumpur",
    overview:
      "A future warm, hospitality-led preventive health environment for discovery, longevity planning and continuity conversations.",
    image: "/mms-concierge-lounge.png",
  },
  {
    slug: "ss2",
    name: "MMS SS2",
    positioning: "Renal & Dialysis Centre",
    status: "planned",
    city: "Petaling Jaya",
    overview:
      "A specialised clinical-care context intended to communicate reliability, privacy and careful patient support.",
    image: "/mms-health-screening-hero.png",
  },
  {
    slug: "johor",
    name: "MMS Johor",
    positioning: "Advanced Medical / ACC / Laboratory Hub",
    status: "planned",
    city: "Johor",
    overview:
      "A future advanced-care and laboratory-capability hub, subject to regulatory, licensing, funding, technical and professional requirements.",
    image: "/mms-diagnostics-screening.png",
  },
];
