import { PatientEditorialPage, metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Longevity Medicine",
  "Personalised longevity at MMS is approached through screening, doctor review, lifestyle context and continuity.",
);

export default function LongevityMedicinePage() {
  return (
    <PatientEditorialPage
      eyebrow="Longevity Medicine"
      title="Ageing well deserves medical judgement, not hype."
      lead="MMS approaches longevity through baseline understanding, evidence-informed discussion and professional review."
      image="/mms-health-screening-hero.png"
      introEyebrow="Healthy ageing"
      introTitle="Longevity is most credible when it is personal and measured."
      introLead="The right questions are usually about resilience, energy, metabolic health, recovery and long-term independence."
      points={[
        { title: "Baseline first", text: "Screening helps identify what is measurable today." },
        { title: "Context matters", text: "Lifestyle, sleep, stress and family history shape the conversation." },
        { title: "Follow over time", text: "Longer-view planning is more useful than one dramatic intervention." },
      ]}
      trustTitle="Advanced longevity discussions require careful boundaries."
      trustLead="Suitability, uncertainty and individual variation should remain visible before any programme is considered."
      finalTitle="Build longevity on clarity, not promises."
    />
  );
}
