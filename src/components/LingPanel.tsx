"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { lingDisclaimer, lingOptions } from "@/lib/content";

const guidance: Record<string, { text: string; href: string; label: string }> = {
  "I want a health screening": {
    text: "A health screening is usually the clearest first step because it gives your MMS doctor a baseline before any wellness plan is discussed.",
    href: "/health-screening",
    label: "View Health Screening",
  },
  "I want to improve my energy": {
    text: "Energy concerns can involve sleep, nutrition, stress, metabolic health and lifestyle patterns. MMS starts with discovery and screening before personalised recommendations.",
    href: "/health-journey",
    label: "View Health Journey",
  },
  "I want to manage my weight": {
    text: "Weight management works best as a structured journey that considers body composition, habits, metabolic signals and professional suitability review.",
    href: "/weight-management",
    label: "View Weight Management",
  },
  "I want to learn about longevity": {
    text: "Longevity at MMS is positioned around prevention, measurable baselines, doctor-led review and long-term planning rather than random purchases.",
    href: "/longevity-medicine",
    label: "View Longevity Medicine",
  },
  "I want to understand medicine access": {
    text: "Medicine access can vary between countries because of registration, supply, currency, tax and pharmacy rules. MMS can help frame the access discussion safely.",
    href: "/international-medicine-access",
    label: "View Medicine Access",
  },
  "I want to understand the SCF lab roadmap": {
    text: "SCF is best understood as a future capability roadmap. Public information should stay careful until regulatory, licensing and professional requirements are confirmed.",
    href: "/scf-lab-roadmap",
    label: "View Lab Roadmap",
  },
  "I'm looking for regenerative medicine": {
    text: "Regenerative medicine topics require clear education and doctor-led suitability review. Ling can help you prepare questions before speaking with MMS.",
    href: "/education",
    label: "View Education",
  },
  "I'm not sure where to start": {
    text: "Start with discovery. MMS can help you understand your goals, choose the right screening path and decide whether membership makes sense after review.",
    href: "/contact",
    label: "Start Discovery",
  },
};

export function LingPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedGuidance = selected ? guidance[selected] : null;

  return (
    <div className="rounded-lg border border-gold-light/50 bg-white/[0.94] p-6 shadow-premium md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Ling</p>
          <h3 className="mt-2 font-serif text-3xl text-navy">What brings you here today?</h3>
        </div>
        <span className="relative size-16 overflow-hidden rounded-full border-2 border-gold-light bg-ivory shadow-soft">
          <Image src="/ling-mms-guide.png" alt="Ling, the MMS intelligent health guide" fill className="object-cover object-[50%_24%]" sizes="64px" />
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {lingOptions.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition duration-300 ${
              selected === option
                ? "border-gold bg-ivory text-navy shadow-soft"
                : "border-stone-200 bg-white text-stone-700 hover:border-gold-light hover:bg-ivory"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedGuidance ? (
        <div className="mt-5 rounded-lg border border-gold-light/50 bg-ivory p-5">
          <p className="text-sm leading-6 text-stone-600">{selectedGuidance.text}</p>
          <Link
            href={selectedGuidance.href}
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-gold px-4 text-sm font-semibold text-navy transition hover:bg-gold hover:text-navy"
          >
            {selectedGuidance.label}
          </Link>
        </div>
      ) : null}
      <p className="mt-5 text-xs leading-6 text-stone-500">
        {lingDisclaimer}
      </p>
    </div>
  );
}
