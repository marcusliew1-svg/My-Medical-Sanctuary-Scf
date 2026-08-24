import { PatientEditorialPage, metadataFor } from "@/components/PatientEditorialPage";

export const metadata = metadataFor(
  "IV Therapy",
  "IV therapy at MMS is framed as a supportive wellness discussion subject to doctor assessment and suitability.",
);

export default function IvTherapyPage() {
  return (
    <PatientEditorialPage
      eyebrow="IV Wellness Support"
      title="Supportive therapy should be reviewed responsibly."
      lead="MMS presents IV therapy as a possible wellness support option, not a promised solution."
      image="/mms-about-hero.png"
      introEyebrow="Suitability first"
      introTitle="A responsible conversation begins before the drip."
      introLead="The question is not only what is available. It is whether it makes sense for the person in front of the doctor."
      points={[
        { title: "Health history", text: "A patient’s context can affect whether supportive therapy is appropriate." },
        { title: "Screening context", text: "Relevant findings may change what should or should not be considered." },
        { title: "Measured expectations", text: "Individual outcomes vary. MMS avoids exaggerated treatment promises." },
      ]}
      trustTitle="No one-size-fits-all wellness treatment belongs on a premium medical site."
      trustLead="Subject to doctor assessment. Suitable candidates only. Individual outcomes vary."
      finalTitle="Ask whether supportive therapy is suitable, not whether it is trendy."
    />
  );
}
