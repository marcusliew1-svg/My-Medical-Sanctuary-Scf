import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { StepCard } from "@/components/StepCard";
import { steps } from "@/data/steps";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Understand the MMS 8-step journey from discovery to review.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Hero
        eyebrow="How It Works"
        title="A clear journey from discovery to review."
        subtitle="MMS gives members a structured process before personalised wellness decisions are made."
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="8 Steps"
            title="Designed for clarity and safe boundaries."
            description="This sequence keeps the experience calm, coordinated and professionally reviewed."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
