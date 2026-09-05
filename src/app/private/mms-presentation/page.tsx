"use client";

import { useEffect, useMemo, useState } from "react";

type DeckKey = "partner" | "patient";
type Slide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  kicker?: string;
  mode?: "cover" | "split" | "journey" | "tiers" | "rules" | "closing" | "network";
};

const partner: Slide[] = [
  { eyebrow: "MMS PARTNER EXPERIENCE", title: "Join MMS as a Trusted Health-Growth Partner", subtitle: "Help more people take control of their health earlier — while building a meaningful business around trusted healthcare.", kicker: "Preventive Care. Personalised Longevity.", mode: "cover" },
  { eyebrow: "01 — THE SHIFT", title: "A New Era in Healthcare", subtitle: "Healthcare is moving upstream — from reacting later to understanding earlier.", bullets: ["Preventive health", "Personalised guidance", "Longevity planning", "Better continuity", "Trusted medical navigation"], kicker: "This shift creates a new kind of healthcare opportunity.", mode: "split" },
  { eyebrow: "02 — THE PLATFORM", title: "More Than a Clinic", subtitle: "MMS is building a connected preventive-health and longevity ecosystem.", bullets: ["Bangsar — Wellness & Longevity Flagship · Opening pathway", "SS2 — Renal & Dialysis Centre · Planned", "Johor — Advanced Medical / ACC / Laboratory Hub · Planned", "My Sanctuary · Ling · MMS Health Intelligence"], mode: "network" },
  { eyebrow: "03 — THE PATIENT", title: "People Want More Than Treatment", subtitle: "They want to feel understood, safe, guided and supported.", bullets: ["Doctor-led care", "Personalised health pathways", "Premium patient experience", "Preventive health thinking", "Long-term continuity"], kicker: "Medical judgement comes first.", mode: "split" },
  { eyebrow: "04 — THE PEOPLE", title: "The Right People. Not Just More People.", subtitle: "We prefer credible relationship-builders over aggressive sellers.", bullets: ["Sales consultants", "Channel partners", "Wellness advisors", "Business development professionals", "Corporate-health introducers", "Trusted network builders"], kicker: "Credibility > pressure · Relationships > hard selling · Long-term trust > quick commissions", mode: "split" },
  { eyebrow: "05 — THE ROLE", title: "You Don’t Sell Treatments.", subtitle: "You introduce people to better health decisions.", bullets: ["Preventive health assessments", "Executive health screening", "Longevity programmes", "Metabolic-health programmes", "Membership pathways", "Doctor-guided wellness services"], kicker: "The patient journey begins with assessment and professional review — not a treatment promise.", mode: "journey" },
  { eyebrow: "06 — MEMBERSHIPS", title: "Four Premium Pathways", subtitle: "Different levels of support. One commitment to longer-term health.", mode: "tiers" },
  { eyebrow: "07 — OPPORTUNITY", title: "A Meaningful Income Opportunity", subtitle: "Performance-based. Ethical. Transparent.", bullets: ["Approved introductions", "Membership conversions", "Programme enrolments", "Approved renewal structures", "Channel-development activity"], kicker: "No guaranteed earnings. Income depends on activity, relationships, conversion, compliance and long-term performance.", mode: "split" },
  { eyebrow: "08 — ENABLEMENT", title: "You Are Not Expected to Do This Alone", subtitle: "MMS gives partners a professional operating system.", bullets: ["Partner Hub", "Lead registration", "Commercial status visibility", "Commission visibility", "Training and approved materials", "Updates and support"], kicker: "Commercial progress is visible. Confidential clinical information is not.", mode: "network" },
  { eyebrow: "09 — TRUST", title: "Trust Is Part of the Business Model", subtitle: "The rules protect patients, partners and MMS.", bullets: ["No cure promises", "No guaranteed outcomes", "No suitability claims", "No unsupported medical claims", "No pressure-selling", "Clinical questions go to qualified professionals"], kicker: "Technology supports. MMS coordinates. Qualified professionals decide.", mode: "rules" },
  { eyebrow: "10 — FIT", title: "Could This Be You?", subtitle: "The strongest MMS partners combine trust, discipline and long-term thinking.", bullets: ["Trusted network", "Professional communication", "Responsible messaging", "Relationship mindset", "Reputation conscious", "Comfortable following a structured system"], kicker: "Not for fast-money thinking, aggressive selling or exaggerated health claims.", mode: "split" },
  { eyebrow: "11 — NEXT", title: "Help Build a Healthier Tomorrow", subtitle: "Join MMS as a trusted health-growth partner.", kicker: "Apply → Train → Become Approved → Introduce → Grow", mode: "closing" },
];

const patient: Slide[] = [
  { eyebrow: "MMS PATIENT EXPERIENCE", title: "Your Health Deserves a Longer View", subtitle: "We help you understand your health earlier, make better-informed decisions and build a more personalised path forward.", kicker: "Preventive Care. Personalised Longevity.", mode: "cover" },
  { eyebrow: "01 — WHY NOW", title: "Most Healthcare Starts Too Late", subtitle: "Many people investigate only after symptoms, crisis or visible decline.", bullets: ["Energy quietly changes", "Metabolic risk builds", "Sleep and stress are normalised", "Screening gets delayed", "Care becomes fragmented"], kicker: "The earlier you understand what is changing, the more informed your choices can become.", mode: "split" },
  { eyebrow: "02 — CONTINUITY", title: "Prevention Is More Than a Checkup", subtitle: "A screening gives information. Continuity gives that information meaning.", bullets: ["Understand your baseline", "Interpret what matters", "Choose personalised next steps", "Review changes over time", "Stay supported"], kicker: "Your health is not a one-day event.", mode: "journey" },
  { eyebrow: "03 — THE JOURNEY", title: "Discover → Assess → Review → Personalise → Continue", subtitle: "A clear care journey so you always know what comes next.", bullets: ["Discover what matters to you", "Assess with appropriate screening", "Review with qualified professionals", "Personalise your care direction", "Continue with support and monitoring"], mode: "journey" },
  { eyebrow: "04 — YOUR HEALTH", title: "What Would You Like to Understand Better?", bullets: ["Healthy Ageing", "Metabolic Health", "Energy & Recovery", "Sleep & Stress", "Hormone Health", "Cancer Screening", "Kidney Health", "Executive Health"], kicker: "You do not need to know which treatment you need. Start by understanding your health.", mode: "network" },
  { eyebrow: "05 — MEMBERSHIPS", title: "Choose the Level of Support That Fits Your Journey", subtitle: "Four membership pathways designed around different levels of continuity.", mode: "tiers" },
  { eyebrow: "06 — ONBOARDING", title: "What Happens After You Join?", bullets: ["Consultation scheduling", "Baseline health review", "Appropriate assessments", "Doctor review & suitability", "Personalised health direction", "Ongoing coordination", "Review & monitoring"], kicker: "A clear, concierge-style journey from day one.", mode: "journey" },
  { eyebrow: "07 — SUITABILITY", title: "Doctor-Led Review Comes First", subtitle: "Not every service is suitable for every person.", bullets: ["Medical history", "Relevant screening", "Laboratory review", "Medication review", "Risk assessment", "Informed consent", "Clinical monitoring where required"], kicker: "A membership gives you access to MMS. It does not guarantee that every treatment is suitable for you.", mode: "rules" },
  { eyebrow: "08 — CONTINUITY", title: "My Sanctuary + Ling", subtitle: "Your MMS relationship continues beyond the clinic.", bullets: ["Appointments and reminders", "Membership information", "Health journey overview", "Reports and medication-review support", "Health Passport", "Care coordination"], kicker: "Ling helps you navigate, understand and prepare. Ling does not replace your doctor.", mode: "network" },
  { eyebrow: "09 — DIFFERENCE", title: "More Than a One-Off Checkup", subtitle: "More serious than a wellness spa. More continuous than a single appointment.", bullets: ["Physician-guided", "Preventive", "Evidence-aware", "Personalised", "Continuity-focused", "Premium and private", "Health-intelligence enabled"], mode: "split" },
  { eyebrow: "10 — TRUST", title: "Safety and Privacy Are Part of Your Care", bullets: ["Medical decisions stay with qualified professionals", "Suitability before treatment", "No miracle promises", "Clear consent", "Appropriate confidentiality", "Advanced services subject to medical, regulatory and availability requirements"], kicker: "Technology supports. MMS coordinates. Qualified professionals decide.", mode: "rules" },
  { eyebrow: "11 — BEGIN", title: "Start With Understanding Your Health", subtitle: "You do not need to decide everything today. Begin with a conversation. Understand where you are. Then decide what comes next.", kicker: "Begin with an MMS Health Review", mode: "closing" },
];

const tiers = [
  ["ASCEND", "RM8,888", "Essential preventive-health foundation"],
  ["EVOLVE", "RM28,888", "Advanced wellness & optimisation"],
  ["ETERNA", "RM78,888", "Comprehensive longevity relationship"],
  ["PINNACLE", "RM128,888", "Signature personalised health management"],
];

function Presentation({ deck, onExit }: { deck: DeckKey; onExit: () => void }) {
  const slides = deck === "partner" ? partner : patient;
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const [notes, setNotes] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") setIndex((i) => Math.min(slides.length - 1, i + 1));
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, onExit]);

  const progress = ((index + 1) / slides.length) * 100;

  return (
    <main className={`mms-stage ${deck}`}>
      <div className="mms-grain" />
      <div className="mms-aurora a1" /><div className="mms-aurora a2" />
      <header className="mms-topbar">
        <button className="brand" onClick={onExit}><b>MMS</b><span>MY MEDICAL SANCTUARY</span></button>
        <div className="decklabel">{deck === "partner" ? "PARTNER EXPERIENCE" : "PATIENT EXPERIENCE"}</div>
        <button className="ghost" onClick={() => setNotes(v => !v)}>{notes ? "Hide notes" : "Presenter notes"}</button>
      </header>

      <aside className="rail" aria-label="Slide navigation">
        {slides.map((s, i) => <button key={s.title} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span></button>)}
      </aside>

      <section key={`${deck}-${index}`} className={`slide mode-${slide.mode || "split"}`}>
        <div className="gold-sweep" />
        <div className="copy">
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1>{slide.title}</h1>
          {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
          {slide.bullets && slide.mode !== "tiers" && <div className="bulletgrid">{slide.bullets.map((b, i) => <div className="bullet" key={b}><i>{String(i + 1).padStart(2, "0")}</i><span>{b}</span></div>)}</div>}
          {slide.mode === "tiers" && <div className="tiers">{tiers.map(([name, price, desc], i) => <article key={name} className={`tier t${i}`}><span>{String(i + 1).padStart(2, "0")}</span><h3>{name}</h3><strong>{price}</strong><p>{desc}</p></article>)}</div>}
          {slide.kicker && <blockquote>{slide.kicker}</blockquote>}
          {slide.mode === "closing" && <div className="cta-row"><button>Begin the conversation</button><button className="outline">Speak with MMS</button></div>}
        </div>

        <div className="visual" aria-hidden="true">
          <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
          <div className="halo"/>
          <div className="monogram">M</div>
          <div className="visual-caption">{deck === "partner" ? "TRUST · GROWTH · MEDICAL CREDIBILITY" : "UNDERSTANDING · CONTINUITY · CARE"}</div>
        </div>
      </section>

      {notes && <div className="notes"><b>Presenter note</b><p>{slide.mode === "tiers" ? "Present the four pathways as levels of relationship and continuity, not discount packages." : slide.kicker || "Keep the narration concise and let the visual composition carry the emotion."}</p></div>}

      <footer className="mms-footer">
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="counter">{String(index + 1).padStart(2, "0")} <em>/</em> {String(slides.length).padStart(2, "0")}</div>
        <div className="controls"><button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>←</button><button onClick={() => setIndex(i => Math.min(slides.length - 1, i + 1))} disabled={index === slides.length - 1}>→</button></div>
      </footer>
    </main>
  );
}

export default function MMSPresentationPreview() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [deck, setDeck] = useState<DeckKey | null>(null);
  const [error, setError] = useState(false);

  const intro = useMemo(() => ({ title: "Private MMS Presentation", subtitle: "Two cinematic stories. One healthcare platform." }), []);

  if (!unlocked) return (
    <main className="mms-stage gate">
      <div className="mms-grain"/><div className="mms-aurora a1"/><div className="mms-aurora a2"/>
      <section className="gate-card">
        <p className="eyebrow">PRIVATE PRESENTATION</p><div className="gate-logo">MMS</div><h1>{intro.title}</h1><p>{intro.subtitle}</p>
        <form onSubmit={(e) => { e.preventDefault(); if (password === "MMS2026") { setUnlocked(true); setError(false); } else setError(true); }}>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter access password" aria-label="Presentation password" />
          <button>Enter experience →</button>
        </form>
        {error && <small>Incorrect password. Preview password: MMS2026</small>}
        <div className="disclaimer">Prototype access only · Change password before production</div>
      </section>
    </main>
  );

  if (deck) return <Presentation deck={deck} onExit={() => setDeck(null)} />;

  return (
    <main className="mms-stage selector">
      <div className="mms-grain"/><div className="mms-aurora a1"/><div className="mms-aurora a2"/>
      <header className="selector-head"><div className="gate-logo">MMS</div><p>MY MEDICAL SANCTUARY</p><span>Preventive Care. Personalised Longevity.</span></header>
      <section className="selector-grid">
        <button onClick={() => setDeck("partner")} className="deck-card partner-card"><p>01 / PARTNER</p><h2>Build trust.<br/>Create growth.</h2><span>Sales recruitment & channel partner story</span><b>Enter partner experience →</b></button>
        <button onClick={() => setDeck("patient")} className="deck-card patient-card"><p>02 / PATIENT</p><h2>A longer view<br/>of your health.</h2><span>Preventive health & membership story</span><b>Enter patient experience →</b></button>
      </section>
      <div className="selector-note">Private stakeholder preview · cinematic web presentation concept</div>
    </main>
  );
}
