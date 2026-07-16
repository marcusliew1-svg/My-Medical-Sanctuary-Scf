import type { Metadata } from "next";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About MMS",
  description:
    "Learn how My Medical Sanctuary moves wellness from random purchases to a structured membership journey.",
};

export default function AboutMMSPage() {
  return (
    <main>
      <Hero
        eyebrow="About MMS"
        title="From random purchases to a structured wellness journey."
        subtitle="My Medical Sanctuary is built around discovery, HRM coordination, professional review and personalised longevity."
        image="/mms-about-hero.png"
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Vision"
            title="Premium membership, safe boundaries and discovery-first guidance."
            description="MMS exists for people who want a calm, structured and professionally reviewed way to approach preventive care."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              "Premium membership model",
              "HRM coordination",
              "Discovery-first experience",
              "Professional review",
              "Safe service boundaries",
              "Long-term wellness roadmap",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-warm-white bg-white p-6">
                <h2 className="font-serif text-2xl text-navy">{item}</h2>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <DisclaimerBox title="Clinical and lab roadmap">
              <p>
                MMS aims to develop deeper clinical and lab capability in 2027, subject to regulatory, licensing, funding, technical and professional requirements.
              </p>
            </DisclaimerBox>
          </div>
        </div>
      </section>
    </main>
  );
}
