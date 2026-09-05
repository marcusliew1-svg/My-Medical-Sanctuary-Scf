import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { CTASection, EditorialSplit, HealthIntelligenceFeature, ImageFeature, JourneyStepRail, LocationFeature, PublicHero, SectionHeading, TrustBar } from "@/components/PublicExperience";
import { EditorialIndex, ImagePair, PrincipleRow } from "@/components/PublicEditorialModules";
import { PublicSectionShell, ResponsiveEditorialImage } from "@/components/PublicVisualPrimitives";
import { mmsLocations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Preventive Care • Personalised Longevity",
  description: "My Medical Sanctuary is a physician-guided preventive healthcare and personalised longevity platform built around understanding, assessment and continuity.",
};

const trustItems = [
  { title: "Physician-guided", text: "Medical judgement before personalised recommendations." },
  { title: "Suitability-first", text: "Context and assessment before any advanced option." },
  { title: "Evidence-aware", text: "Clarity about what is known and uncertain." },
  { title: "Private", text: "Discretion and consent throughout the journey." },
  { title: "Continuous", text: "Health planning beyond a single appointment." },
  { title: "Human-led", text: "Technology supports. Professionals decide." },
];

const healthGoals = [
  ["Healthy Ageing", "Strength, independence and resilience.", "/mms-doctor-couple-consult.png", "/longevity-medicine"],
  ["Metabolic Health", "Weight, glucose and cardiovascular risk in context.", "/mms-diagnostics-screening.png", "/health-concerns/weight-gain-metabolic-health"],
  ["Energy & Recovery", "Look beyond fatigue to the patterns underneath.", "/mms-doctor-results-review.png", "/health-concerns/unexplained-fatigue-low-energy"],
  ["Sleep & Stress", "Understand recovery before reaching for quick fixes.", "/mms-concierge-lounge.png", "/health-concerns/poor-sleep-stress-recovery"],
  ["Hormone Health", "Symptoms, testing and benefit-risk review together.", "/mms-about-hero.png", "/health-concerns/low-libido-low-testosterone-symptoms"],
  ["Cancer Screening", "Know what screening can and cannot answer.", "/mms-health-screening-hero.png", "/health-concerns/cancer-risk-early-detection"],
  ["Kidney Health", "Bring renal risk into long-term health planning.", "/mms-medicine-access-consult.png", "/health-screening"],
  ["Executive Health", "Make prevention workable around a demanding life.", "/mms-doctor-couple-consult.png", "/corporate-executive-wellness"],
].map(([title, text, image, href]) => ({ title, text, image, href, eyebrow: "Your health", detail: "Begin with your concern, then let screening and professional review shape the next step." }));

const method = [
  { title: "Discover", text: "Listen to your story, goals and concerns." },
  { title: "Assess", text: "Build a useful baseline with appropriate screening." },
  { title: "Review", text: "A qualified professional interprets the context." },
  { title: "Personalise", text: "Create a practical, suitability-led roadmap." },
  { title: "Continue", text: "Keep follow-up and long-term priorities visible." },
];

export default function HomePage() {
  return (
    <main data-public-home-shell>
      <PublicHero eyebrow="My Medical Sanctuary" title="Your health deserves a longer view." brandLine="Preventive Care. Personalised Longevity. Physician-guided." lead="Understand your health earlier, make better-informed decisions and build a relationship designed to continue over time." image="/mms-doctor-couple-consult.png" imageAlt="Physician and patient discussing a long-term preventive health plan." imagePosition="62% center" primaryLabel="Begin Your Health Journey" secondaryLabel="How MMS Works" secondaryHref="/how-it-works" />
      <TrustBar items={trustItems} />

      <PublicSectionShell><div className="mx-auto max-w-5xl py-6 md:py-10">
        <SectionHeading eyebrow="Why MMS" title="Most healthcare begins when something goes wrong. MMS begins earlier." lead="We bring health screening, medical review and ongoing coordination into one considered relationship, so patients can understand more before decisions become urgent." />
        <div className="mt-12"><PrincipleRow items={[
          { title: "Understand earlier", text: "See patterns, risks and priorities before symptoms become the only signal." },
          { title: "Decide better", text: "Use professional context to separate useful options from unnecessary noise." },
          { title: "Stay healthier longer", text: "Turn one assessment into a practical, evolving plan." },
        ]} /></div>
      </div></PublicSectionShell>

      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[0.64fr_1.36fr] lg:items-start">
        <SectionHeading eyebrow="Your health" title="What would you like to understand better?" lead="Start with the question that matters to you. Treatment names can come later, if they are relevant at all." />
        <ImageFeature items={healthGoals} />
      </div></PublicSectionShell>

      <EditorialSplit eyebrow="Medical trust" title="Medical judgement comes first." lead="Technology can organise information and advanced care can widen possibilities. Neither replaces careful assessment, professional responsibility or a clear conversation about suitability." image="/mms-doctor-results-review.png" imageAlt="Physician reviewing results with a patient before making recommendations." dark reverse>
        <EditorialIndex dark items={[
          { title: "Assess before recommending", text: "Health history, goals, medicines and relevant investigations establish context." },
          { title: "Explain the evidence", text: "Patients should hear both what is established and what remains uncertain." },
          { title: "Continue responsibly", text: "Monitoring and follow-up matter as much as the first decision." },
        ]} />
      </EditorialSplit>

      <PublicSectionShell><SectionHeading eyebrow="The MMS method" title="A thoughtful journey, designed around you." lead="One connected progression from first conversation to long-term continuity." /><div className="mt-14"><JourneyStepRail steps={method} /></div></PublicSectionShell>

      <PublicSectionShell tone="stone"><div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <ImagePair primary="/mms-concierge-lounge.png" secondary="/mms-doctor-couple-consult.png" primaryAlt="Quiet private healthcare lounge." secondaryAlt="Attentive physician consultation." />
        <div><SectionHeading eyebrow="The sanctuary experience" title="Care should feel considered from the moment you arrive." lead="Privacy, calm attention and medical professionalism create the conditions for better conversations and stronger continuity." /><div className="mt-9"><PrincipleRow items={[
          { title: "Private", text: "Discreet conversations and consent-minded service." },
          { title: "Attentive", text: "Time to understand the person behind the results." },
          { title: "Continuous", text: "A relationship that remembers what matters next." },
        ]} /></div></div>
      </div></PublicSectionShell>

      <PublicSectionShell><SectionHeading eyebrow="Locations" title="One MMS. Three specialised centres." lead="Different centres of expertise, each presented according to its verified status. Planned services are not described as operational." /><div className="mt-12"><LocationFeature locations={mmsLocations} /></div></PublicSectionShell>

      <PublicSectionShell tone="midnight"><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading eyebrow="Programmes" title="Four depths of one relationship." lead="Membership follows discovery and professional review. It is a level of coordination, not a public price shelf." dark />
        <EditorialIndex dark items={[
          { eyebrow: "Clarity", title: "Ascend", text: "A structured beginning for screening, review and a clearer health baseline." },
          { eyebrow: "Progress", title: "Evolve", text: "Closer coordination for people actively working on energy, metabolic health and lifestyle." },
          { eyebrow: "Continuity", title: "Eterna", text: "Longer-term preventive planning, monitoring and relationship support." },
          { eyebrow: "Confidence", title: "Pinnacle", text: "Highly coordinated care by invitation and clinical suitability." },
        ]} />
      </div></PublicSectionShell>

      <EditorialSplit eyebrow="Advanced care" title="Advanced options. Considered individually." lead="Advanced does not automatically mean better. Evidence, product quality, indication, alternatives and personal risk all deserve careful review." image="/mms-diagnostics-screening.png" imageAlt="Clinical diagnostics supporting suitability assessment." reverse><ButtonLink href="/treatments" variant="outline">Understand Advanced Care</ButtonLink></EditorialSplit>

      <PublicSectionShell tone="green"><div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div><SectionHeading eyebrow="Ling" title="You do not need to know where to begin." lead="Ling can explain general concepts, organise questions and help you find the right MMS pathway. She does not diagnose, prescribe or determine suitability." dark /><div className="mt-8"><ButtonLink href="/ling" variant="light">Start With Ling</ButtonLink></div></div>
        <ResponsiveEditorialImage src="/ling-concierge.png" alt="Ling, the MMS digital health guide, in a calm concierge setting." className="min-h-[420px] md:min-h-[560px]" objectPosition="50% 20%" />
      </div></PublicSectionShell>

      <HealthIntelligenceFeature />

      <PublicSectionShell tone="midnight"><div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
        <SectionHeading eyebrow="Regional continuity" title="Your care can travel with you." lead="MMS helps patients prepare documentation, questions and follow-up across borders without promising access, importation or availability." dark />
        <EditorialIndex dark items={[
          { title: "Before travel", text: "Clarify goals, records, practical needs and what requires professional review." },
          { title: "During care", text: "Keep communication and expectations organised around the patient." },
          { title: "After return", text: "Bring results and next steps back into one continuity plan." },
        ]} />
      </div></PublicSectionShell>

      <CTASection />
    </main>
  );
}
