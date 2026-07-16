import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy / Disclaimer",
  description: "Privacy and disclaimer information for My Medical Sanctuary.",
};

export default function PrivacyDisclaimerPage() {
  return (
    <main>
      <Hero
        eyebrow="Privacy / Disclaimer"
        title="Clear boundaries for a trustworthy wellness journey."
        subtitle="MMS provides general education and discovery support. Personalised decisions require professional review."
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Important"
            title="General information only."
            description="This page is a v0.1 placeholder and should be reviewed by legal and clinical advisors before public launch."
          />
          <div className="grid gap-5">
            <DisclaimerBox title="Not medical advice">
              <p>
                Website content is for general information and education only. It should not be treated as personalised medical advice.
              </p>
            </DisclaimerBox>
            <DisclaimerBox title="Professional review required">
              <p>
                Any membership journey, wellness pathway or service discussion requires discovery, professional review and suitability assessment.
              </p>
            </DisclaimerBox>
            <DisclaimerBox title="No outcome promises">
              <p>
                MMS does not promise specific outcomes. Individual experiences vary and depend on many personal factors.
              </p>
            </DisclaimerBox>
            <DisclaimerBox title="Jurisdiction matters">
              <p>
                Availability of services may depend on Malaysian laws, professional requirements, licensing and clinical governance.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
    </main>
  );
}
