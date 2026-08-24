export type WorkflowTemplateId =
  | "executive-screening"
  | "longevity-membership"
  | "medicine-access"
  | "corporate-wellness"
  | "iv-wellness-support";

export type Role =
  | "Reception"
  | "Intake"
  | "Nurse"
  | "Doctor"
  | "Care Coordinator"
  | "Treatment"
  | "Discharge";

export type Status = "Ready" | "In Progress" | "Waiting" | "Complete";

export type CommercialOpportunity = {
  id: string;
  personId: string;
  label: string;
  stage: "New" | "Qualified" | "Discuss Later";
  owner: "Commercial";
  note: string;
};

export type PrototypePerson = {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  mobile: string;
  countryCity: string;
  preferredLanguage: string;
  enquiry: {
    id: string;
    source: string;
    interest: string;
    receivedAt: string;
    status: Status;
  };
  journey: {
    id: string;
    templateId: WorkflowTemplateId;
    label: string;
    status: Status;
    coordinatorPriority: string;
  };
  episode?: {
    id: string;
    label: string;
    reason: string;
    status: Status;
  };
  appointment: {
    id: string;
    date: string;
    time: string;
    type: string;
    location: string;
    status: Status;
  };
  encounter: {
    id: string;
    clinicianApprovedPriorities: string[];
    nurseTasks: string[];
    treatmentTasks: string[];
    dischargeTasks: string[];
    privateClinicalNote: string;
    status: Status;
  };
};

export const workflowTemplates: Record<
  WorkflowTemplateId,
  {
    name: string;
    summary: string;
    handoffs: Array<{ from: Role; to: Role; payload: string }>;
  }
> = {
  "executive-screening": {
    name: "Executive Health Screening",
    summary: "Discovery-led screening for busy professionals and founders.",
    handoffs: [
      { from: "Reception", to: "Intake", payload: "Confirm identity, consent and visit purpose." },
      { from: "Intake", to: "Nurse", payload: "Vitals, baseline checks and screening preparation." },
      { from: "Nurse", to: "Doctor", payload: "Structured observations and completed screening readiness." },
      { from: "Doctor", to: "Care Coordinator", payload: "Clinician-approved care priorities only." },
      { from: "Care Coordinator", to: "Discharge", payload: "Follow-up schedule and patient-facing next steps." },
    ],
  },
  "longevity-membership": {
    name: "Longevity Membership Review",
    summary: "Doctor-led review before membership planning and long-term coordination.",
    handoffs: [
      { from: "Reception", to: "Intake", payload: "Membership interest and consent captured." },
      { from: "Intake", to: "Doctor", payload: "Goals, baseline context and suitability questions." },
      { from: "Doctor", to: "Care Coordinator", payload: "Approved priorities and follow-up cadence." },
      { from: "Care Coordinator", to: "Discharge", payload: "Membership education and next review date." },
    ],
  },
  "medicine-access": {
    name: "International Medicine Access Intelligence",
    summary: "Education and coordination pathway for country-specific access questions.",
    handoffs: [
      { from: "Reception", to: "Intake", payload: "Country, medicine-access question and consent only." },
      { from: "Intake", to: "Doctor", payload: "Access question for professional boundary review." },
      { from: "Doctor", to: "Care Coordinator", payload: "Approved education points and licensed-party routing." },
      { from: "Care Coordinator", to: "Discharge", payload: "Patient-facing access discussion summary." },
    ],
  },
  "corporate-wellness": {
    name: "Corporate Executive Wellness",
    summary: "Employer or leadership-team enquiry routed separately from individual care details.",
    handoffs: [
      { from: "Reception", to: "Intake", payload: "Company profile and programme interest." },
      { from: "Intake", to: "Care Coordinator", payload: "Non-clinical coordination needs and participant count." },
      { from: "Care Coordinator", to: "Doctor", payload: "Clinical governance questions for programme design." },
      { from: "Care Coordinator", to: "Discharge", payload: "Corporate next-step checklist." },
    ],
  },
  "iv-wellness-support": {
    name: "IV Wellness Support Suitability",
    summary: "Supportive wellness request requiring review before treatment-room activity.",
    handoffs: [
      { from: "Reception", to: "Intake", payload: "Request type and consent captured." },
      { from: "Intake", to: "Nurse", payload: "Pre-treatment observations required." },
      { from: "Nurse", to: "Doctor", payload: "Readiness observations and escalation flags." },
      { from: "Doctor", to: "Treatment", payload: "Approved treatment-room tasks only." },
      { from: "Treatment", to: "Discharge", payload: "Completed treatment-room checklist." },
    ],
  },
};

export const prototypePeople: PrototypePerson[] = [
  {
    id: "mms-1001",
    name: "Alicia Tan",
    preferredName: "Alicia",
    age: 42,
    mobile: "+60 12 555 0188",
    countryCity: "Malaysia / Kuala Lumpur",
    preferredLanguage: "English",
    enquiry: {
      id: "enq-7001",
      source: "Website",
      interest: "Health screening",
      receivedAt: "2026-08-12 09:10",
      status: "Ready",
    },
    journey: {
      id: "journey-3001",
      templateId: "executive-screening",
      label: "Executive Health Screening",
      status: "In Progress",
      coordinatorPriority: "Explain screening sequence and confirm follow-up window.",
    },
    episode: {
      id: "episode-2101",
      label: "Initial screening episode",
      reason: "Baseline assessment before preventive plan",
      status: "In Progress",
    },
    appointment: {
      id: "appt-9001",
      date: "2026-08-14",
      time: "09:30",
      type: "Health Screening",
      location: "MMS KL",
      status: "Ready",
    },
    encounter: {
      id: "enc-5001",
      clinicianApprovedPriorities: [
        "Clarify screening flow and fasting requirements.",
        "Prepare follow-up conversation after doctor review.",
      ],
      nurseTasks: ["Confirm fasting status.", "Record vitals.", "Prepare screening checklist."],
      treatmentTasks: ["No treatment-room task before doctor review."],
      dischargeTasks: ["Provide next appointment guidance.", "Share approved education summary."],
      privateClinicalNote: "Synthetic doctor-only note hidden from coordinator, nurse, and treatment views.",
      status: "In Progress",
    },
  },
  {
    id: "mms-1002",
    name: "Daniel Wong",
    preferredName: "Daniel",
    age: 51,
    mobile: "+60 17 555 0199",
    countryCity: "Singapore / Singapore",
    preferredLanguage: "English",
    enquiry: {
      id: "enq-7002",
      source: "Ling",
      interest: "Medicine access question",
      receivedAt: "2026-08-12 10:20",
      status: "Waiting",
    },
    journey: {
      id: "journey-3002",
      templateId: "medicine-access",
      label: "International Medicine Access Intelligence",
      status: "Ready",
      coordinatorPriority: "Share approved access-process education, not prescribing guidance.",
    },
    appointment: {
      id: "appt-9002",
      date: "2026-08-15",
      time: "14:00",
      type: "Access Discussion",
      location: "Virtual",
      status: "Waiting",
    },
    encounter: {
      id: "enc-5002",
      clinicianApprovedPriorities: [
        "Explain jurisdictional access differences.",
        "Route medicine questions to professional review and licensed parties.",
      ],
      nurseTasks: ["No nurse task required at enquiry stage."],
      treatmentTasks: ["No treatment task. Medicine access is not treatment-room work."],
      dischargeTasks: ["Send approved access-discussion summary.", "Offer discovery appointment."],
      privateClinicalNote: "Synthetic doctor-only note: do not expose medicine details or prescribing logic.",
      status: "Waiting",
    },
  },
  {
    id: "mms-1003",
    name: "Priya Menon",
    preferredName: "Priya",
    age: 38,
    mobile: "+60 19 555 0166",
    countryCity: "Malaysia / Petaling Jaya",
    preferredLanguage: "English",
    enquiry: {
      id: "enq-7003",
      source: "Corporate referral",
      interest: "Longevity membership",
      receivedAt: "2026-08-12 11:05",
      status: "Ready",
    },
    journey: {
      id: "journey-3003",
      templateId: "longevity-membership",
      label: "Longevity Membership Review",
      status: "In Progress",
      coordinatorPriority: "Prepare membership education after doctor review.",
    },
    episode: {
      id: "episode-2103",
      label: "Membership suitability review",
      reason: "Long-term preventive planning",
      status: "Ready",
    },
    appointment: {
      id: "appt-9003",
      date: "2026-08-16",
      time: "11:00",
      type: "Doctor Review",
      location: "MMS PJ",
      status: "Ready",
    },
    encounter: {
      id: "enc-5003",
      clinicianApprovedPriorities: [
        "Discuss membership only after health baseline is reviewed.",
        "Confirm patient goals and preferred follow-up style.",
      ],
      nurseTasks: ["Prepare baseline measurement room.", "Flag readiness to doctor."],
      treatmentTasks: ["No treatment-room task before care plan approval."],
      dischargeTasks: ["Schedule roadmap review.", "Provide membership information pack."],
      privateClinicalNote: "Synthetic doctor-only membership suitability note.",
      status: "Ready",
    },
  },
];

export const commercialOpportunities: CommercialOpportunity[] = [
  {
    id: "opp-4401",
    personId: "mms-1003",
    label: "Family membership discussion",
    stage: "Discuss Later",
    owner: "Commercial",
    note: "Separate commercial follow-up. Not part of the care journey record.",
  },
  {
    id: "opp-4402",
    personId: "mms-1002",
    label: "Corporate executive group intro",
    stage: "New",
    owner: "Commercial",
    note: "Keep separate from Daniel's access discussion pathway.",
  },
];

export const hierarchy = [
  "Enquiry",
  "Person",
  "Journey",
  "Optional Episode",
  "Appointment",
  "Encounter",
];

export function getPerson(id: string) {
  return prototypePeople.find((person) => person.id === id);
}
