"use client";

import { useEffect, useMemo, useState } from "react";

type DeckKey = "partner" | "patient";
type StoryScene = {
  chapter: string;
  title: string;
  lead: string;
  body?: string;
  quote?: string;
  image: string;
  tone?: "dark" | "warm" | "light" | "burgundy";
  beats?: string[];
  treatments?: { name: string; explainer: string }[];
  package?: { name: string; price: string; promise: string; details: string[] };
  cta?: string;
};

const patientScenes: StoryScene[] = [
  {
    chapter: "PROLOGUE",
    title: "Your health deserves a longer view.",
    lead: "We plan our finances years ahead. Our careers years ahead. Our families years ahead. But our health? Too often, we wait.",
    quote: "Preventive Care. Personalised Longevity.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "01 · THE QUIET CHANGE",
    title: "Health rarely changes all at once.",
    lead: "Energy drops. Sleep worsens. Recovery slows. Weight shifts. Risk builds quietly in the background.",
    body: "Most people do not wake up one morning and suddenly feel old or unwell. Health changes accumulate — slowly enough to be ignored, but meaningfully enough to matter.",
    beats: ["Energy", "Sleep", "Metabolism", "Stress", "Screening"],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "02 · WHAT IF",
    title: "What if healthcare started earlier?",
    lead: "Not with a treatment. Not with a package. With understanding.",
    body: "MMS is designed around a simple idea: the earlier you understand what is changing, the more informed your choices can become.",
    beats: ["Discover", "Assess", "Review", "Personalise", "Continue"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "03 · MEET MMS",
    title: "One relationship around your health.",
    lead: "MMS is more than a clinic. It is a connected preventive-health and longevity ecosystem.",
    body: "Bangsar anchors the wellness and longevity experience. SS2 is planned around renal and dialysis care. Johor is intended to extend the network into advanced medical and laboratory capability. My Sanctuary, Ling and Health Intelligence create continuity around the patient.",
    beats: ["Bangsar", "SS2", "Johor", "My Sanctuary", "Ling", "Health Intelligence"],
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "04 · START WITH UNDERSTANDING",
    title: "You do not need to know which treatment you need.",
    lead: "That is not your job. Your first job is to understand your health.",
    body: "A consultation can bring together your priorities, history, symptoms, screening and relevant results. From there, qualified professionals can decide what deserves attention — and what does not.",
    quote: "Medical judgement comes first.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "05 · DISCOVER",
    title: "See more of the picture.",
    lead: "Screening and diagnostics help create a more useful baseline for your health journey.",
    treatments: [
      { name: "Executive & Preventive Screening", explainer: "A structured view of key health risks, chosen according to age, history and clinical need." },
      { name: "Ultrasound & Diagnostics", explainer: "Imaging and diagnostic tools may help clinicians investigate specific questions and establish a baseline." },
      { name: "Metabolic & Cardiovascular Review", explainer: "Weight, glucose, lipids, blood pressure and other markers can be considered together rather than in isolation." },
      { name: "Cancer Screening", explainer: "Appropriate screening pathways are considered according to risk, age, guidelines and physician judgement." }
    ],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "06 · RESTORE",
    title: "Support recovery and resilience — where appropriate.",
    lead: "Some patients explore supportive therapies as part of a broader health plan.",
    treatments: [
      { name: "IV Therapy", explainer: "Clinician-supervised infusions may be used for selected hydration or nutrient-support purposes where medically appropriate." },
      { name: "NAD+", explainer: "NAD+ infusions are marketed in longevity care, but suitability, evidence and expectations should be reviewed individually." },
      { name: "Antioxidant Support", explainer: "Selected antioxidant therapies may be considered in context, not as a substitute for diagnosis or standard medical care." },
      { name: "Recovery Support", explainer: "Sleep, nutrition, hydration, stress and recovery remain part of the conversation — not just procedures." }
    ],
    image: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "07 · OPTIMISE",
    title: "Health is interconnected.",
    lead: "Energy, sleep, metabolism, hormones and stress do not exist in separate boxes.",
    treatments: [
      { name: "Metabolic & Weight Health", explainer: "Lifestyle, body composition, metabolic markers and medication options can be considered together under medical supervision." },
      { name: "Hormone Health", explainer: "Symptoms and laboratory results may justify further review; treatment depends on diagnosis, risk and suitability." },
      { name: "Peptide Programmes", explainer: "Any peptide-based therapy requires careful medical and regulatory review; not all products or indications are appropriate." },
      { name: "Sleep & Stress", explainer: "Poor sleep and chronic stress can affect recovery, appetite, performance and quality of life, so they deserve structured attention." }
    ],
    image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "08 · REGENERATE",
    title: "Advanced options require more questions, not fewer.",
    lead: "Regenerative and cellular therapies should never be presented as shortcuts or miracle solutions.",
    treatments: [
      { name: "PRP / PRGF", explainer: "Autologous platelet-based approaches may be considered in selected musculoskeletal or aesthetic contexts after professional assessment." },
      { name: "Exosome-related Services", explainer: "Evidence, product quality, jurisdiction and indication matter. MMS should only proceed where medically and legally appropriate." },
      { name: "MSC / Cellular Therapies", explainer: "Stem-cell related interventions are highly indication- and jurisdiction-dependent and require specialist review and regulatory discipline." },
      { name: "NK / Advanced Cellular Care", explainer: "Advanced cellular services require careful evidence, sourcing, suitability and regulatory evaluation before any patient pathway is considered." }
    ],
    quote: "Suitability first. Evidence aware. No miracle claims.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "09 · CONTINUITY",
    title: "When continuity matters most.",
    lead: "Kidney and renal care remind us why healthcare cannot be reduced to one-off transactions.",
    body: "Renal pathways, including dialysis, depend on consistency, safety, monitoring and trusted teams. MMS SS2 is planned as a dedicated renal and dialysis centre, subject to licensing, fit-out and operational approvals.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "10 · YOUR PATH",
    title: "Different people need different levels of support.",
    lead: "The MMS memberships are designed as levels of relationship and continuity — not a catalogue of discounts.",
    body: "Start with the level of support that fits your current needs. Your clinical care still depends on assessment, suitability and professional judgement.",
    beats: ["Ascend", "Evolve", "Eterna", "Pinnacle"],
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1800&q=88",
    tone: "burgundy"
  },
  {
    chapter: "11 · ASCEND",
    title: "Ascend — begin with structure.",
    lead: "A preventive-health foundation for people who want to stop treating health as an afterthought.",
    package: { name: "ASCEND", price: "RM8,888", promise: "Essential preventive-health foundation", details: ["Designed as an entry point into ongoing MMS care", "Supports structured review and continuity", "Health Reserve Credits align spending with your care journey", "All services remain subject to clinical suitability"] },
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "12 · EVOLVE",
    title: "Evolve — go deeper.",
    lead: "For patients who want a more active relationship with optimisation, review and continuity.",
    package: { name: "EVOLVE", price: "RM28,888", promise: "Advanced wellness & optimisation", details: ["Broader room for ongoing care planning", "More frequent review can support adjustment over time", "Suitable for patients with multiple wellness goals", "No package guarantees treatment eligibility"] },
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "13 · ETERNA",
    title: "Eterna — build a longevity relationship.",
    lead: "A more comprehensive level of continuity for patients who want deeper, longer-term health management.",
    package: { name: "ETERNA", price: "RM78,888", promise: "Comprehensive longevity relationship", details: ["Designed for broader, longer-horizon care", "Supports multiple health priorities over time", "More room for review, monitoring and coordination", "Clinical decisions remain independent of package value"] },
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "14 · PINNACLE",
    title: "Pinnacle — concierge-level continuity.",
    lead: "For patients seeking the highest level of MMS relationship, coordination and personalised health management.",
    package: { name: "PINNACLE", price: "RM128,888", promise: "Signature personalised health management", details: ["Highest-touch MMS membership positioning", "Designed around coordination and continuity", "Can support complex, multi-priority health journeys", "Premium access never overrides medical judgement"] },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=88",
    tone: "burgundy"
  },
  {
    chapter: "15 · BEYOND THE CLINIC",
    title: "Your relationship should not end when you walk out the door.",
    lead: "My Sanctuary and Ling are designed to support navigation, reminders, organisation and continuity around care.",
    body: "The goal is not to replace clinicians with AI. It is to make the patient journey easier to understand and harder to lose track of.",
    beats: ["Appointments", "Health Journey", "Reports", "Medication Reviews", "Health Passport", "Ling"],
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "EPILOGUE",
    title: "Start with understanding your health.",
    lead: "You do not need to decide everything today. Begin with a conversation. Understand where you are. Then decide what comes next.",
    quote: "Medical judgement comes first.",
    cta: "Begin with an MMS Health Review",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  }
];

const partnerScenes: StoryScene[] = [
  {
    chapter: "PROLOGUE",
    title: "Healthcare is changing. Trust will matter even more.",
    lead: "Patients have more information than ever — and often less clarity than ever.",
    body: "The next generation of healthcare growth will not come from shouting louder. It will come from helping people navigate better.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "01 · THE NOISE",
    title: "Patients are surrounded by claims.",
    lead: "Clinics. Supplements. Social media. Wellness trends. Treatment marketing. Contradictory advice.",
    body: "In a noisy market, credibility becomes more valuable than reach. A trusted introduction can matter more than another advertisement.",
    quote: "Trust becomes the scarce asset.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "02 · THE ROLE",
    title: "You do not need to become a doctor.",
    lead: "You need to become a trusted bridge.",
    body: "A strong MMS partner helps a client take the next responsible step: from curiosity to assessment, from confusion to professional review, from one-off interaction to continuity.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "03 · THE PLATFORM",
    title: "Represent something bigger than a treatment menu.",
    lead: "MMS is building a connected preventive-health and longevity platform.",
    body: "Bangsar, SS2 and Johor create physical capability. My Sanctuary, Ling and Health Intelligence create digital continuity. The partner relationship sits around that system — not above it.",
    beats: ["Bangsar", "SS2", "Johor", "My Sanctuary", "Ling", "Health Intelligence"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "04 · WHY CLIENTS CARE",
    title: "People do not want to be sold a procedure.",
    lead: "They want to feel understood, safe, guided and supported.",
    body: "That gives partners a better conversation to have. You introduce the MMS health journey, not a miracle claim or a product of the month.",
    quote: "Medical judgement comes first.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "05 · WHAT YOU INTRODUCE",
    title: "Better health decisions — not treatment promises.",
    lead: "Partners can introduce patients to preventive assessments, memberships, doctor-guided wellness pathways and longer-term care relationships.",
    treatments: [
      { name: "Discover", explainer: "Screening, diagnostics and structured health review help patients understand where they are." },
      { name: "Restore", explainer: "Selected supportive therapies may be considered where clinically appropriate." },
      { name: "Optimise", explainer: "Metabolic health, sleep, hormones and recovery can be reviewed as interconnected areas." },
      { name: "Regenerate", explainer: "Regenerative and advanced services require stricter suitability, evidence and regulatory review." }
    ],
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "06 · THE MEMBERSHIP MODEL",
    title: "Four relationships. Four levels of commitment.",
    lead: "Ascend, Evolve, Eterna and Pinnacle allow partners to match different clients to different levels of continuity — without pretending everyone needs the same thing.",
    beats: ["Ascend · RM8,888", "Evolve · RM28,888", "Eterna · RM78,888", "Pinnacle · RM128,888"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88",
    tone: "burgundy"
  },
  {
    chapter: "07 · THE ECONOMICS",
    title: "Build income around value — not hype.",
    lead: "Partners may earn through approved introductions, membership conversions, programme enrolments and approved renewal structures.",
    body: "There are no guaranteed earnings. Results depend on activity, relationship quality, conversion, compliance and long-term performance. The model should reward responsible growth, not aggressive selling.",
    beats: ["Introduce", "Convert", "Serve", "Renew", "Refer"],
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "08 · THE CLIENT BOOK",
    title: "Your real asset is the relationship you build.",
    lead: "A one-time commission is useful. A trusted client book is more valuable.",
    body: "MMS Partner Hub is intended to help partners register leads, follow commercial progress, understand renewal timing and build continuity around their client relationships — while clinical information remains private.",
    quote: "Your most valuable asset is not this month’s commission. It is the trust you build over years.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "09 · THE OPERATING SYSTEM",
    title: "You are not expected to improvise.",
    lead: "A professional partner network needs structure.",
    beats: ["Training", "Approved Materials", "Lead Registration", "Commercial Status", "Commission Visibility", "Renewal Support"],
    body: "MMS should give partners the tools to operate consistently — and the boundaries to protect patients, doctors and the brand.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "10 · THE RULES",
    title: "Credibility is part of the business model.",
    lead: "The easiest way to destroy a healthcare brand is to let sales outrun medicine.",
    beats: ["No cure promises", "No guaranteed outcomes", "No suitability claims", "No unsupported medical claims", "No pressure-selling", "No clinical advice unless qualified"],
    quote: "Technology supports. MMS coordinates. Qualified professionals decide.",
    image: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  },
  {
    chapter: "11 · WHO WINS",
    title: "The best MMS partners will not look like traditional salespeople.",
    lead: "They will look like trusted advisors.",
    body: "Professional communication. Credible relationships. Long-term thinking. Strong follow-up. Respect for process. Reputation consciousness. The ability to explain enough — and know when to hand the conversation to a clinician.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1800&q=88",
    tone: "warm"
  },
  {
    chapter: "12 · CAREER",
    title: "Build a business that becomes more valuable over time.",
    lead: "The opportunity can evolve from individual introductions into a serious client portfolio and channel-development role.",
    beats: ["Build trust", "Build a book", "Build renewals", "Develop channels", "Mentor responsibly"],
    body: "The aim is not a recruitment pyramid. It is a professional growth pathway around healthcare relationships and accountable commercial performance.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=88",
    tone: "light"
  },
  {
    chapter: "EPILOGUE",
    title: "Build a business around something worth protecting.",
    lead: "People’s health. Their trust. Your reputation.",
    quote: "Join MMS as a trusted health-growth partner.",
    cta: "Apply · Train · Become Approved · Introduce · Grow",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=88",
    tone: "dark"
  }
];

function Scene({ scene, index, total, onNext, onPrev, onExit, deck }: { scene: StoryScene; index: number; total: number; onNext: () => void; onPrev: () => void; onExit: () => void; deck: DeckKey }) {
  return (
    <section className={`story-scene tone-${scene.tone || "dark"}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(2,22,18,.93) 0%, rgba(2,22,18,.72) 42%, rgba(2,22,18,.18) 75%, rgba(2,22,18,.06) 100%), url(${scene.image})` }}>
      <div className="story-vignette" />
      <header className="story-topbar">
        <button className="story-brand" onClick={onExit}><b>MMS</b><span>MY MEDICAL SANCTUARY</span></button>
        <div className="story-deck-label">{deck === "partner" ? "PARTNER STORY" : "PATIENT STORY"}</div>
        <div className="story-count">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
      </header>

      <div className="story-copy-wrap">
        <p className="story-chapter">{scene.chapter}</p>
        <h1>{scene.title}</h1>
        <p className="story-lead">{scene.lead}</p>
        {scene.body && <p className="story-body">{scene.body}</p>}

        {scene.beats && <div className="story-beats">{scene.beats.map((b, i) => <span key={b}><em>{String(i + 1).padStart(2, "0")}</em>{b}</span>)}</div>}

        {scene.treatments && <div className="treatment-grid">{scene.treatments.map((t) => <article key={t.name}><h3>{t.name}</h3><p>{t.explainer}</p></article>)}</div>}

        {scene.package && <div className="package-panel"><div><span>{scene.package.name}</span><strong>{scene.package.price}</strong><p>{scene.package.promise}</p></div><ul>{scene.package.details.map((d) => <li key={d}>{d}</li>)}</ul></div>}

        {scene.quote && <blockquote className="story-quote">{scene.quote}</blockquote>}
        {scene.cta && <button className="story-cta">{scene.cta} →</button>}
      </div>

      <footer className="story-footer">
        <div className="story-progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
        <div className="story-controls"><button onClick={onPrev} disabled={index === 0}>←</button><button onClick={onNext} disabled={index === total - 1}>→</button></div>
      </footer>
      <div className="story-scroll-hint">SCROLL · ARROWS · SPACE</div>
    </section>
  );
}

function Story({ deck, onExit }: { deck: DeckKey; onExit: () => void }) {
  const scenes = deck === "partner" ? partnerScenes : patientScenes;
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  const go = (direction: 1 | -1) => {
    if (locked) return;
    setLocked(true);
    setIndex((i) => Math.min(scenes.length - 1, Math.max(0, i + direction)));
    window.setTimeout(() => setLocked(false), 520);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === "Escape") onExit();
    };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 28) return;
      go(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", key, { passive: false });
    window.addEventListener("wheel", wheel, { passive: true });
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("wheel", wheel); };
  }, [locked]);

  return <Scene scene={scenes[index]} index={index} total={scenes.length} onNext={() => go(1)} onPrev={() => go(-1)} onExit={onExit} deck={deck} />;
}

export default function MMSPresentationPreview() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [deck, setDeck] = useState<DeckKey | null>(null);
  const [error, setError] = useState(false);
  const title = useMemo(() => "MMS Cinematic Story Experience", []);

  if (!unlocked) return (
    <main className="story-gate">
      <div className="gate-film" />
      <section className="story-gate-card">
        <div className="gate-wordmark">MMS</div>
        <p>MY MEDICAL SANCTUARY</p>
        <h1>{title}</h1>
        <span>Preventive Care. Personalised Longevity.</span>
        <form onSubmit={(e) => { e.preventDefault(); if (password === "MMS2026") { setUnlocked(true); setError(false); } else setError(true); }}>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter access password" aria-label="Presentation password" />
          <button>Enter →</button>
        </form>
        {error && <small>Incorrect password. Preview password: MMS2026</small>}
      </section>
    </main>
  );

  if (deck) return <Story deck={deck} onExit={() => setDeck(null)} />;

  return (
    <main className="story-selector">
      <div className="selector-brand"><b>MMS</b><span>MY MEDICAL SANCTUARY</span></div>
      <div className="selector-intro"><p>CHOOSE YOUR STORY</p><h1>Two audiences.<br/>Two journeys.<br/><i>One MMS.</i></h1></div>
      <div className="selector-cards">
        <button className="cinema-card partner" onClick={() => setDeck("partner")}><span>PARTNER STORY</span><h2>Build trust.<br/>Build relationships.<br/>Build something meaningful.</h2><b>Enter partner experience →</b></button>
        <button className="cinema-card patient" onClick={() => setDeck("patient")}><span>PATIENT STORY</span><h2>A longer view<br/>of your health<br/>starts here.</h2><b>Enter patient experience →</b></button>
      </div>
      <p className="selector-foot">Private preview · Cinematic web experience · Use arrow keys or scroll</p>
    </main>
  );
}
