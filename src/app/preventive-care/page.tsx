import { PatientEditorialPage, metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "Preventive Care",
  "Preventive care at MMS focuses on earlier understanding, doctor review and long-term planning.",
);

export default function PreventiveCarePage() {
  return (
    <PatientEditorialPage
      eyebrow="Preventive Care"
      title="Act before small risks become larger concerns."
      lead="Preventive care at MMS begins with a baseline, a doctor-led review and practical planning."
      introEyebrow="Earlier care"
      introTitle="Prevention is not a package. It is a way of thinking."
      introLead="The goal is to reduce uncertainty and help people make calm decisions before pressure arrives."
      points={[
        { title: "Understand risk", text: "Screening and history help reveal what deserves attention." },
        { title: "Decide better", text: "Doctor review keeps findings in context and avoids overreaction." },
        { title: "Plan ahead", text: "A preventive roadmap can evolve with life, work, travel and ageing." },
      ]}
      trustTitle="The first recommendation is often patience and clarity."
      trustLead="MMS does not need to rush visitors into programmes. The safer first step is understanding what matters."
      finalTitle="Preventive care begins with a better first conversation."
    />
  );
}
