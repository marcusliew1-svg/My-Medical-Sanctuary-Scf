import { PatientEditorialPage, metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Weight Management",
  "MMS weight management starts with health context, metabolic review and personalised planning.",
);

export default function WeightManagementPage() {
  return (
    <PatientEditorialPage
      eyebrow="Weight Management"
      title="Weight change deserves context, not judgement."
      lead="MMS approaches weight through body composition, metabolic health, lifestyle patterns and professional review."
      image="/mms-health-screening-hero.png"
      introEyebrow="Metabolic health"
      introTitle="The better question is what is driving the change."
      introLead="Weight can reflect sleep, stress, hormones, glucose, habits, medication, travel and life stage."
      points={[
        { title: "Body composition", text: "Understand what is changing beyond a single number." },
        { title: "Metabolic review", text: "Look for health patterns that may need professional attention." },
        { title: "Sustainable follow-up", text: "A plan should fit real life, not only a short burst of motivation." },
      ]}
      trustTitle="Weight management should not feel like a cosmetic shortcut."
      trustLead="MMS keeps the conversation clinical, respectful and personalised."
      finalTitle="Start with the factors behind the change."
    />
  );
}
