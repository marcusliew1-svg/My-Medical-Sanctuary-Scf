"use client";

import { useEffect, useMemo, useState } from "react";

type DeckKey = "partner" | "patient";
type SlideKind = "cover" | "editorial" | "journey" | "treatment" | "package" | "network" | "income" | "rules" | "closing";
type Slide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  quote?: string;
  kind?: SlideKind;
  image?: string;
  imagePosition?: string;
  stat?: string;
  statLabel?: string;
  packageName?: string;
  packagePrice?: string;
  packageTag?: string;
  packagePoints?: string[];
};

const IMG = {
  consult: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=88",
  doctor: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1800&q=88",
  mature: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1800&q=88",
  wellness: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=88",
  lab: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1800&q=88",
  microscope: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1800&q=88",
  executive: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=88",
  recovery: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1800&q=88",
  digital: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=88",
  clinic: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=88",
  city: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=88",
  calm: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=88",
};

const partner: Slide[] = [
  { eyebrow: "MMS PARTNER EXPERIENCE", title: "Build a Meaningful Business Around Better Health", subtitle: "A private-healthcare growth opportunity for people who value trust, relationships and long-term reputation.", quote: "Preventive Care. Personalised Longevity.", kind: "cover", image: IMG.consult },
  { eyebrow: "01 — THE SHIFT", title: "Healthcare Is Moving Earlier", subtitle: "The old model waits for symptoms. A growing number of people want to understand risk, performance and ageing before a crisis forces the conversation.", body: "MMS is designed for that shift: more proactive, more personalised and more continuous — while keeping medical judgement where it belongs, with qualified professionals.", bullets: ["Preventive health", "Personalised guidance", "Longevity planning", "Continuity", "Trusted navigation"], kind: "editorial", image: IMG.mature },
  { eyebrow: "02 — WHY THIS MATTERS", title: "The Opportunity Is Not ‘Selling More Treatments’", subtitle: "It is helping people enter healthcare earlier — and stay connected for longer.", body: "A trusted introducer can become the bridge between a person who knows something needs to change and a medical team that can assess what actually matters.", quote: "The strongest partners create trust before they create revenue.", kind: "editorial", image: IMG.executive },
  { eyebrow: "03 — THE PLATFORM", title: "More Than a Clinic", subtitle: "MMS is being built as a connected healthcare platform with physical centres, digital continuity and health intelligence.", bullets: ["Bangsar — Wellness & Longevity Flagship · Opening pathway", "SS2 — Renal & Dialysis Centre · Planned", "Johor — Advanced Medical / ACC / Laboratory Hub · Planned", "My Sanctuary — patient continuity layer", "Ling — digital health guide", "MMS Health Intelligence — medicine and regional-care intelligence"], kind: "network", image: IMG.clinic },
  { eyebrow: "04 — THE PATIENT EXPERIENCE", title: "People Want to Feel Understood Before They Are Sold Anything", subtitle: "MMS is designed around a simple emotional sequence: I feel understood → I understand MMS → I trust the medical foundation → I can see the next step.", body: "That is why the partner role is different. Your job is not to diagnose or prescribe. Your job is to open a credible door and help the relationship begin well.", quote: "Medical judgement comes first.", kind: "editorial", image: IMG.consult },
  { eyebrow: "05 — WHAT YOU REPRESENT", title: "A Journey, Not a Menu", subtitle: "MMS organises care around patient goals and professional review rather than pushing isolated procedures.", bullets: ["Discover what matters", "Assess appropriately", "Review with qualified professionals", "Personalise the direction", "Continue with support"], kind: "journey", image: IMG.doctor },
  { eyebrow: "06 — TREATMENT KNOWLEDGE", title: "Discover & Assess", subtitle: "Screening, diagnostics and executive health are the starting point for understanding what deserves attention.", body: "Depending on the patient, this may include health history, physical review, laboratory testing, ultrasound or other appropriate screening. The purpose is not to find a treatment to sell — it is to understand the person better.", bullets: ["Executive screening", "Metabolic markers", "Cardiovascular risk review", "Liver and kidney markers", "Cancer screening pathways", "Ultrasound / diagnostics where appropriate"], quote: "Assessment determines direction. It does not guarantee treatment suitability.", kind: "treatment", image: IMG.lab },
  { eyebrow: "07 — TREATMENT KNOWLEDGE", title: "Restore & Recover", subtitle: "MMS may use supportive wellness services where clinically appropriate to help patients address hydration, recovery, nutritional status and energy-related concerns.", body: "IV therapies, NAD+ and antioxidant-based programmes are not positioned as miracle solutions. They sit within a broader physician-guided plan and are subject to suitability, evidence, local regulation and clinical judgement.", bullets: ["IV hydration and nutrient support", "NAD+ pathways", "Antioxidant support", "Recovery-oriented programmes", "Oxygen / red-light modalities where appropriate"], kind: "treatment", image: IMG.recovery },
  { eyebrow: "08 — TREATMENT KNOWLEDGE", title: "Optimise Metabolic & Hormonal Health", subtitle: "Weight, insulin resistance, sleep, stress and hormone patterns can shape how people feel and how they age.", body: "MMS approaches these areas through assessment first. Medical options may include evidence-based metabolic care, physician-supervised weight management, hormone review or peptide-related services where clinically and legally appropriate.", bullets: ["Metabolic health", "Weight-management pathways", "Hormone assessment", "Sleep & stress", "Peptide-related services subject to medical review"], kind: "treatment", image: IMG.wellness },
  { eyebrow: "09 — TREATMENT KNOWLEDGE", title: "Regenerative & Recovery Medicine", subtitle: "Some patients explore regenerative approaches because they are seeking better recovery, function or a more advanced care pathway.", body: "PRP / PRGF and other regenerative procedures are evaluated service by service. Evidence, indication, regulation and patient suitability matter. Advanced products such as exosome-related services require particularly careful review.", bullets: ["PRP / PRGF", "Recovery procedures", "Musculoskeletal-focused pathways", "Advanced biologic / exosome-related services only where permitted and appropriate"], kind: "treatment", image: IMG.microscope },
  { eyebrow: "10 — TREATMENT KNOWLEDGE", title: "Advanced Cellular Wellness", subtitle: "MMS may develop access to advanced cellular services through appropriately licensed pathways and specialist review.", body: "MSC, NK-cell and other cellular concepts should never be presented as guaranteed cures. The evidence varies by indication and the regulatory pathway matters. Partners must refer all clinical questions back to MMS.", quote: "Advanced does not mean automatic. Suitability, evidence and regulation come first.", kind: "treatment", image: IMG.microscope },
  { eyebrow: "11 — A DISTINCT CAPABILITY", title: "Kidney & Renal Care", subtitle: "SS2 is planned as a dedicated renal and dialysis centre, creating a very different kind of long-term healthcare relationship.", body: "Renal care depends on continuity, disciplined operations, medical oversight and trust. It also broadens MMS beyond wellness into a more serious healthcare platform.", bullets: ["Renal assessment pathways", "Dialysis services subject to licensing", "Long-term continuity", "Family and caregiver support", "Clinical governance"], kind: "treatment", image: IMG.doctor },
  { eyebrow: "12 — THE MEMBERSHIP MODEL", title: "Four Levels of Relationship", subtitle: "The membership structure is designed to make continuity easier to understand — from an essential preventive-health foundation to a signature concierge relationship.", quote: "Access. Continuity. Care. Not discount selling.", kind: "journey", image: IMG.calm },
  { eyebrow: "13 — ASCEND", title: "Ascend", packageName: "ASCEND", packagePrice: "RM8,888", packageTag: "Essential preventive-health foundation", body: "For people who want a structured entry into MMS: understand where they are, establish a baseline and begin a more intentional relationship with their health.", packagePoints: ["Health Reserve Credits aligned to the package value", "Executive-health / assessment pathway", "Doctor-review access according to approved package terms", "12-month continuity / concierge support", "Founders benefits where applicable"], kind: "package", image: IMG.consult },
  { eyebrow: "14 — EVOLVE", title: "Evolve", packageName: "EVOLVE", packagePrice: "RM28,888", packageTag: "Advanced wellness & optimisation", body: "For patients who want more depth: broader assessment, more frequent review and a more active optimisation plan across metabolic, recovery and longevity priorities.", packagePoints: ["Health Reserve Credits aligned to package value", "Enhanced assessment pathway", "More frequent doctor review according to approved terms", "Priority continuity support", "Founder / privilege benefits where applicable"], kind: "package", image: IMG.wellness },
  { eyebrow: "15 — ETERNA", title: "Eterna", packageName: "ETERNA", packagePrice: "RM78,888", packageTag: "Comprehensive longevity relationship", body: "For patients who want a deeper, longer-view relationship with MMS and expect more coordination, review and access across a wider care journey.", packagePoints: ["Higher Health Reserve Credit allocation", "Broader assessment and review pathway", "Enhanced continuity and concierge support", "Family-related privileges where approved", "Priority access to suitable services"], kind: "package", image: IMG.calm },
  { eyebrow: "16 — PINNACLE", title: "Pinnacle", packageName: "PINNACLE", packagePrice: "RM128,888", packageTag: "Signature personalised health management", body: "The highest-touch MMS relationship: designed for people who value coordination, privacy, executive-level attention and a more bespoke healthcare-navigation experience.", packagePoints: ["Signature Health Reserve Credit allocation", "Executive review cadence according to approved terms", "Premium concierge relationship", "Family planning / navigation support where approved", "Priority coordination across MMS capabilities"], kind: "package", image: IMG.executive },
  { eyebrow: "17 — WHY PARTNERS CARE", title: "Build a Client Book — Not Just a One-Time Sale", subtitle: "The real commercial value is continuity: relationships, follow-up, renewals and reputation.", body: "A strong partner should know who they introduced, where the commercial relationship stands and when follow-up matters — without ever seeing confidential clinical information.", bullets: ["Lead ownership / attribution", "Relationship history", "Follow-up discipline", "Approved renewal opportunities", "Long-term client value"], kind: "income", image: IMG.executive },
  { eyebrow: "18 — INCOME LOGIC", title: "Earn Through Performance, Not Hype", subtitle: "Partners may earn through approved introductions, membership conversions, programme enrolments, renewals and channel-development activity.", body: "There are no guaranteed earnings. Actual income depends on activity, conversion, relationship quality, compliance and the approved commission structure in force at the time.", quote: "No pyramids. No recruitment-income promises. No exaggerated earnings claims.", kind: "income", image: IMG.executive },
  { eyebrow: "19 — CAREER PATH", title: "A Business Opportunity That Can Become a Career", subtitle: "For the right people, MMS can create a progression from individual relationship-building into a more senior commercial role.", bullets: ["Associate", "Senior", "Elite", "Channel / leadership responsibilities", "Approved renewal participation"], body: "Progression should be earned through performance, conduct and the ability to represent MMS responsibly — not simply by recruiting more people.", kind: "journey", image: IMG.executive },
  { eyebrow: "20 — PARTNER HUB", title: "MMS Gives You a Professional Operating System", subtitle: "The Partner Hub is designed to make disciplined selling easier and safer.", bullets: ["Lead registration", "Commercial-status visibility", "Commission tracking", "Training", "Approved marketing assets", "Renewal prompts", "Support"], quote: "Partners see commercial progress. They do not see diagnosis, medicines, labs, notes or other confidential clinical information.", kind: "network", image: IMG.digital },
  { eyebrow: "21 — TRAINING", title: "You Are Not Expected to Improvise", subtitle: "MMS should give every approved partner a clear story, approved language, product knowledge and a repeatable process.", bullets: ["Brand & positioning", "Patient journey", "Membership knowledge", "Treatment boundaries", "Objection handling", "Lead registration", "Privacy & compliance"], kind: "editorial", image: IMG.executive },
  { eyebrow: "22 — THE RULES", title: "Trust Is Part of the Business Model", subtitle: "The rules are simple because reputation compounds — both positively and negatively.", bullets: ["Never promise a cure", "Never guarantee an outcome", "Never claim treatment suitability", "Never invent medical evidence", "Never pressure-sell", "Never disclose confidential patient information", "Refer clinical questions to qualified professionals"], quote: "Technology supports. MMS coordinates. Qualified professionals decide.", kind: "rules", image: IMG.doctor },
  { eyebrow: "23 — WHO FITS", title: "We Want Fewer, Better Partners", subtitle: "The ideal MMS partner is trusted, disciplined, ambitious and comfortable building relationships over time.", bullets: ["Credible personal network", "Professional communication", "Strong follow-up", "Reputation-conscious", "Comfortable with approved messaging", "Interested in healthcare and longevity"], quote: "Not for fast-money thinking, aggressive selling or exaggerated health claims.", kind: "editorial", image: IMG.executive },
  { eyebrow: "24 — THE CLOSE", title: "Build Something Worth Representing", subtitle: "If you want to grow in healthcare without becoming another pushy salesperson, MMS is designed to give you a more credible platform.", quote: "Apply → Train → Become Approved → Introduce → Build → Grow", kind: "closing", image: IMG.consult },
];

const patient: Slide[] = [
  { eyebrow: "MMS PATIENT EXPERIENCE", title: "Your Health Deserves a Longer View", subtitle: "A calmer, more personalised way to understand your health, make better-informed decisions and stay supported over time.", quote: "Preventive Care. Personalised Longevity.", kind: "cover", image: IMG.consult },
  { eyebrow: "01 — WHY NOW", title: "Most Healthcare Starts Too Late", subtitle: "We often pay attention only when something feels wrong. But many changes happen gradually — long before they become urgent.", body: "Energy changes. Weight shifts. Sleep gets worse. Metabolic markers move. Risk can accumulate quietly. Earlier understanding does not guarantee prevention — but it can give you more informed choices.", kind: "editorial", image: IMG.mature },
  { eyebrow: "02 — THE DIFFERENCE", title: "A Checkup Gives You Data. Continuity Gives It Meaning.", subtitle: "MMS is designed to connect what you learn today with what you do next — and what changes over time.", bullets: ["Understand your baseline", "Interpret what matters", "Decide appropriate next steps", "Review changes", "Stay connected"], quote: "Your health is not a one-day event.", kind: "journey", image: IMG.doctor },
  { eyebrow: "03 — THE JOURNEY", title: "Discover → Assess → Review → Personalise → Continue", subtitle: "A simple structure so you always understand what happens next.", bullets: ["Discover — your concerns, goals and history", "Assess — appropriate screening and testing", "Review — qualified professional interpretation", "Personalise — a care direction suited to you", "Continue — monitoring, support and adjustment"], kind: "journey", image: IMG.consult },
  { eyebrow: "04 — YOUR HEALTH", title: "What Would You Like to Understand Better?", subtitle: "You do not need to arrive knowing which treatment you want. Start with the questions that matter to you.", bullets: ["Healthy ageing", "Metabolic health", "Energy & recovery", "Sleep & stress", "Hormone health", "Cancer screening", "Kidney health", "Executive health"], kind: "network", image: IMG.mature },
  { eyebrow: "05 — DISCOVER & ASSESS", title: "Build the Baseline First", subtitle: "Before talking about optimisation, MMS wants to understand the person.", body: "Depending on your needs, assessment may include medical history, physical review, laboratory testing, ultrasound or other appropriate screening. Your doctor decides what is relevant.", bullets: ["Executive screening", "Metabolic markers", "Cardiovascular-risk review", "Kidney & liver markers", "Cancer-screening pathways", "Diagnostics / ultrasound where appropriate"], kind: "treatment", image: IMG.lab },
  { eyebrow: "06 — RESTORE & RECOVER", title: "Support Recovery — Without Miracle Claims", subtitle: "Some patients explore supportive wellness services because they feel depleted, stressed or are looking for a more structured recovery plan.", body: "Where appropriate, MMS may use IV hydration, nutrient support, NAD+ or antioxidant-based programmes. These are not shortcuts or guaranteed outcomes; they are considered within a broader clinical picture.", bullets: ["IV hydration / nutrient support", "NAD+ pathways", "Antioxidant support", "Recovery programmes", "Oxygen / red-light modalities where appropriate"], kind: "treatment", image: IMG.recovery },
  { eyebrow: "07 — METABOLIC HEALTH", title: "Weight Is Only One Part of the Picture", subtitle: "Metabolic health involves glucose regulation, body composition, cardiovascular risk, sleep, stress and lifestyle.", body: "MMS may use lifestyle support, monitoring and medical options where appropriate. Prescription therapies are only considered after professional assessment and are never automatically included because someone joins a package.", bullets: ["Metabolic assessment", "Weight-management pathways", "Nutrition & lifestyle support", "Monitoring", "Medication only when clinically appropriate"], kind: "treatment", image: IMG.wellness },
  { eyebrow: "08 — HORMONES, SLEEP & STRESS", title: "How You Feel Is Often Multi-Factorial", subtitle: "Low energy, poor sleep, stress and hormonal symptoms can overlap. That is why assessment matters.", body: "MMS can help patients organise the right questions and, where appropriate, review hormone, sleep and stress factors. Any hormone or peptide-related treatment remains physician-led and suitability-dependent.", kind: "treatment", image: IMG.calm },
  { eyebrow: "09 — REGENERATIVE", title: "Regenerative Options Require Context", subtitle: "PRP / PRGF and other regenerative procedures may be explored for selected patients and indications.", body: "These are not universal solutions. Evidence differs by condition and procedure, and more advanced products require stricter clinical and regulatory review.", bullets: ["PRP / PRGF", "Musculoskeletal recovery pathways", "Procedure-based care", "Advanced biologic / exosome-related options only where permitted and appropriate"], kind: "treatment", image: IMG.microscope },
  { eyebrow: "10 — ADVANCED CELLULAR", title: "Advanced Does Not Mean Automatic", subtitle: "Cellular concepts such as MSC or NK-cell services are complex and should never be presented as guaranteed cures or routine wellness add-ons.", body: "Availability, evidence, indication, licensing and regulation all matter. Where MMS develops these capabilities, suitability and specialist review come first.", quote: "If the evidence or regulatory pathway is uncertain, MMS should say so clearly.", kind: "treatment", image: IMG.microscope },
  { eyebrow: "11 — KIDNEY HEALTH", title: "Kidney Health Needs Continuity", subtitle: "MMS plans a dedicated renal and dialysis centre at SS2, subject to licensing and operational readiness.", body: "Renal care is different from one-off wellness services. It depends on regular monitoring, disciplined clinical processes, family support and long-term medical oversight.", kind: "treatment", image: IMG.doctor },
  { eyebrow: "12 — MEMBERSHIP", title: "Choose the Level of Support That Fits Your Journey", subtitle: "The four MMS pathways are designed around different levels of continuity, access and coordination — not around selling you every available treatment.", quote: "Membership gives access to MMS. It does not guarantee treatment suitability.", kind: "journey", image: IMG.calm },
  { eyebrow: "13 — ASCEND", title: "Ascend", packageName: "ASCEND", packagePrice: "RM8,888", packageTag: "Essential preventive-health foundation", body: "A structured starting point for people who want to stop treating health as an occasional checkup and begin understanding their baseline more intentionally.", packagePoints: ["Health Reserve Credits aligned to package value", "Executive-health / assessment pathway", "Doctor-review access according to approved terms", "12-month continuity support", "Founders benefits where applicable"], kind: "package", image: IMG.consult },
  { eyebrow: "14 — EVOLVE", title: "Evolve", packageName: "EVOLVE", packagePrice: "RM28,888", packageTag: "Advanced wellness & optimisation", body: "For patients who want more active support across metabolic health, recovery, lifestyle and longevity priorities, with a deeper assessment and review relationship.", packagePoints: ["Higher Health Reserve Credit allocation", "Enhanced assessment pathway", "More frequent review according to approved terms", "Priority continuity support", "Founder / privilege benefits where applicable"], kind: "package", image: IMG.wellness },
  { eyebrow: "15 — ETERNA", title: "Eterna", packageName: "ETERNA", packagePrice: "RM78,888", packageTag: "Comprehensive longevity relationship", body: "For patients looking for a more comprehensive, longer-term relationship that brings together assessment, review, navigation and appropriate services over time.", packagePoints: ["Higher Health Reserve Credit allocation", "Broader assessment & review pathway", "Enhanced concierge continuity", "Family-related privileges where approved", "Priority coordination"], kind: "package", image: IMG.calm },
  { eyebrow: "16 — PINNACLE", title: "Pinnacle", packageName: "PINNACLE", packagePrice: "RM128,888", packageTag: "Signature personalised health management", body: "MMS's highest-touch relationship for people who value privacy, coordination, executive attention and a more bespoke approach to navigating their health.", packagePoints: ["Signature Health Reserve Credit allocation", "Executive review cadence according to approved terms", "Premium concierge relationship", "Family planning / navigation support where approved", "Priority coordination across MMS capabilities"], kind: "package", image: IMG.executive },
  { eyebrow: "17 — AFTER YOU JOIN", title: "You Should Always Know What Happens Next", subtitle: "A premium experience is not only about the clinic. It is about clarity.", bullets: ["Consultation scheduling", "Baseline health review", "Appropriate assessments", "Doctor review & suitability", "Personalised direction", "Ongoing coordination", "Review & monitoring"], kind: "journey", image: IMG.consult },
  { eyebrow: "18 — SUITABILITY", title: "Doctor-Led Review Comes First", subtitle: "Not every service is right for every person — even if it is included in a brochure or available at MMS.", bullets: ["Medical history", "Relevant screening", "Laboratory review", "Medication review", "Risk assessment", "Informed consent", "Monitoring where required"], quote: "A membership gives you access. It does not guarantee every treatment is suitable for you.", kind: "rules", image: IMG.doctor },
  { eyebrow: "19 — MY SANCTUARY", title: "Your Relationship Should Continue Beyond the Clinic", subtitle: "My Sanctuary is the planned digital continuity layer around your MMS journey.", bullets: ["Appointments", "Membership information", "Health journey", "Reports", "Medication-review support", "Reminders", "Health Passport", "Care coordination"], kind: "network", image: IMG.digital },
  { eyebrow: "20 — LING", title: "A Digital Guide — Not a Digital Doctor", subtitle: "Ling is designed to help you navigate MMS, understand information and prepare for the next step.", body: "Ling can support education, reminders and navigation. It should not diagnose, prescribe or replace qualified medical judgement.", quote: "Technology supports. MMS coordinates. Qualified professionals decide.", kind: "network", image: IMG.digital },
  { eyebrow: "21 — HEALTH INTELLIGENCE", title: "Healthcare Is Global. Prices Aren’t.", subtitle: "MMS Health Intelligence is being developed to help patients understand medicines, pricing and regional-care options more clearly.", body: "The aim is better-informed navigation — not automatic switching, importing or self-medication. Product identity, access rules, clinical suitability and local regulation all matter.", kind: "network", image: IMG.digital },
  { eyebrow: "22 — WHY MMS", title: "More Than a One-Off Checkup. More Serious Than a Wellness Spa.", subtitle: "MMS is designed to sit between fragmented wellness and reactive healthcare — with medical judgement, continuity and a premium patient experience at the centre.", bullets: ["Physician-guided", "Preventive", "Evidence-aware", "Personalised", "Continuity-focused", "Premium & private", "Health-intelligence enabled"], kind: "editorial", image: IMG.clinic },
  { eyebrow: "23 — TRUST", title: "Safety and Privacy Are Part of the Care", subtitle: "Medical decisions remain with qualified professionals. Personal information should be handled appropriately and advanced services remain subject to medical, regulatory and availability requirements.", bullets: ["Suitability before treatment", "No miracle promises", "Clear consent", "Privacy-minded systems", "Human accountability"], kind: "rules", image: IMG.doctor },
  { eyebrow: "24 — BEGIN", title: "Start With Understanding Your Health", subtitle: "You do not need to decide everything today. Begin with a conversation. Understand where you are. Then decide what comes next.", quote: "Begin with an MMS Health Review", kind: "closing", image: IMG.consult },
];

function Picture({ slide }: { slide: Slide }) {
  return (
    <div className="photo-wrap">
      {slide.image && <img src={slide.image} alt="" style={{ objectPosition: slide.imagePosition || "center" }} />}
      <div className="photo-shade" />
      <div className="photo-mark">MMS</div>
      <div className="photo-caption">MY MEDICAL SANCTUARY</div>
    </div>
  );
}

function PackagePanel({ slide }: { slide: Slide }) {
  return (
    <div className="package-panel">
      <div className="package-meta"><span>{slide.packageName}</span><strong>{slide.packagePrice}</strong></div>
      <h2>{slide.packageTag}</h2>
      {slide.body && <p className="package-body">{slide.body}</p>}
      <div className="package-grid">
        {(slide.packagePoints || []).map((p, i) => <div key={p}><i>0{i + 1}</i><span>{p}</span></div>)}
      </div>
      <small>Package details shown for presentation purposes. Final entitlements remain subject to the approved MMS programme terms.</small>
    </div>
  );
}

function Presentation({ deck, onExit }: { deck: DeckKey; onExit: () => void }) {
  const slides = deck === "partner" ? partner : patient;
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);
  const slide = slides[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) setIndex(i => Math.min(slides.length - 1, i + 1));
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) setIndex(i => Math.max(0, i - 1));
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, onExit]);

  const pct = ((index + 1) / slides.length) * 100;

  return (
    <main className={`mms-stage v2 ${deck}`}>
      <header className="mms-topbar">
        <button className="brand" onClick={onExit}><b>MMS</b><span>MY MEDICAL SANCTUARY</span></button>
        <div className="decklabel">{deck === "partner" ? "PARTNER EXPERIENCE" : "PATIENT EXPERIENCE"}</div>
        <button className="ghost" onClick={() => setNotes(v => !v)}>{notes ? "Hide notes" : "Presenter notes"}</button>
      </header>

      <aside className="chapter-rail">
        {slides.map((s, i) => <button key={`${s.title}-${i}`} className={i === index ? "active" : ""} onClick={() => setIndex(i)} title={s.title}><span>{String(i + 1).padStart(2, "0")}</span></button>)}
      </aside>

      <section key={`${deck}-${index}`} className={`editorial-slide kind-${slide.kind || "editorial"}`}>
        <Picture slide={slide} />
        <div className="story-panel">
          <div className="story-inner">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
            {slide.body && slide.kind !== "package" && <p className="bodycopy">{slide.body}</p>}
            {slide.bullets && <div className="story-list">{slide.bullets.map((b, i) => <div key={b}><i>{String(i + 1).padStart(2, "0")}</i><span>{b}</span></div>)}</div>}
            {slide.kind === "package" && <PackagePanel slide={slide} />}
            {slide.quote && <blockquote>{slide.quote}</blockquote>}
            {slide.kind === "closing" && <div className="cta-row"><button>Begin the conversation</button><button className="outline">Speak with MMS</button></div>}
          </div>
        </div>
      </section>

      {notes && <div className="notes"><b>Presenter note</b><p>{slide.kind === "treatment" ? "Explain the clinical context in plain language. Do not imply that every patient needs or qualifies for this service." : slide.kind === "package" ? "Present the package as a level of relationship and continuity. Avoid discount-led selling." : "Use this screen as a conversation prompt. Keep the spoken explanation human and concise."}</p></div>}

      <footer className="mms-footer">
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
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
  const intro = useMemo(() => ({ title: "Private MMS Presentation", subtitle: "Two rich, cinematic stories. One healthcare platform." }), []);

  if (!unlocked) return (
    <main className="mms-stage gate-v2">
      <div className="gate-photo"><img src={IMG.consult} alt=""/><div /></div>
      <section className="gate-card-v2">
        <p className="eyebrow">PRIVATE PRESENTATION</p><div className="gate-logo">MMS</div><h1>{intro.title}</h1><p>{intro.subtitle}</p>
        <form onSubmit={(e) => { e.preventDefault(); if (password === "MMS2026") { setUnlocked(true); setError(false); } else setError(true); }}>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter access password" aria-label="Presentation password" />
          <button>Enter experience →</button>
        </form>
        {error && <small>Incorrect password. Preview password: MMS2026</small>}
        <div className="disclaimer">Preview access only · replace password before production</div>
      </section>
    </main>
  );

  if (deck) return <Presentation deck={deck} onExit={() => setDeck(null)} />;

  return (
    <main className="mms-stage selector-v2">
      <header className="selector-brand"><div className="gate-logo">MMS</div><p>MY MEDICAL SANCTUARY</p><span>Preventive Care. Personalised Longevity.</span></header>
      <section className="deck-choice partner-choice" onClick={() => setDeck("partner")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setDeck("partner") }>
        <img src={IMG.executive} alt=""/><div className="choice-shade"/><div className="choice-copy"><p>01 / PARTNER EXPERIENCE</p><h2>Build a meaningful business around better health.</h2><span>24 chapters · opportunity · treatments · memberships · income · Partner Hub · trust</span><b>Enter partner story →</b></div>
      </section>
      <section className="deck-choice patient-choice" onClick={() => setDeck("patient")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setDeck("patient") }>
        <img src={IMG.consult} alt=""/><div className="choice-shade"/><div className="choice-copy"><p>02 / PATIENT EXPERIENCE</p><h2>A longer, calmer view of your health.</h2><span>24 chapters · prevention · treatments · packages · continuity · safety · digital care</span><b>Enter patient story →</b></div>
      </section>
    </main>
  );
}
