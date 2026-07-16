import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CorporateCTA } from "@/components/CorporateCTA";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Corporate Executive Wellness",
  description: "Corporate executive wellness programmes with discovery, HRM coordination and professional review.",
};

export default function CorporateExecutiveWellnessPage() {
  return (
    <main>
      <Hero
        eyebrow="Corporate Executive Wellness"
        title="Premium preventive wellness for leaders and teams."
        subtitle="MMS supports companies with structured discovery, executive wellness coordination and professional review pathways."
      />
      <section className="bg-ivory px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="For Companies"
              title="Designed for executive wellbeing."
              description="Programmes can support business owners, leadership teams and employee wellness education."
            />
            <ul className="grid gap-3 text-warm-gray">
              <li>Executive discovery discussions</li>
              <li>HRM coordination and scheduling</li>
              <li>Preventive care education</li>
              <li>Professional review pathways</li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
      <CorporateCTA />
    </main>
  );
}
