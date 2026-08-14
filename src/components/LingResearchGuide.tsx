import Image from "next/image";
import Link from "next/link";

const scenarios = [
  {
    question: "I’m always tired. Where should I start?",
    shortAnswer: "Feeling tired all the time is worth understanding before jumping to a treatment.",
    explanation: "Sometimes the reason is simple, such as poor sleep, stress or not eating well. Sometimes it can be linked to low iron, thyroid problems, blood-sugar issues, medicines or another health condition. Ling can help you organise when the tiredness happens, what other symptoms you have and which basic checks are worth discussing with a doctor.",
    usefulChecks: ["Sleep and daily routine", "Blood count, iron and selected blood tests", "Blood sugar, thyroid and medication review where relevant"],
    steps: [
      { label: "Understand fatigue first", href: "/health-concerns/unexplained-fatigue-low-energy" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "Read about NAD+", href: "/treatments/nad-plus" },
    ],
    treatmentContext: "NAD+ or an IV may be something you want to research, but they should not replace looking for the reason you are tired.",
    handoff: "If fatigue is persistent, worsening or comes with symptoms such as breathlessness, fainting, chest pain, unexplained weight loss or significant weakness, seek medical assessment.",
  },
  {
    question: "My knee hurts. Should I do PRP?",
    shortAnswer: "PRP may be discussed for some knee problems, but first we need to know what is actually causing the pain.",
    explanation: "Knee pain can come from wear-and-tear arthritis, tendon problems, injury, inflammation or other causes. The same injection is not right for every type of knee pain. A sensible first step is to understand where the pain is, how long it has been there, whether there was an injury and whether examination or imaging is needed.",
    usefulChecks: ["Where and when the knee hurts", "Previous injury, swelling or locking", "Clinical examination and imaging if the clinician thinks it is needed"],
    steps: [
      { label: "Knee & joint guide", href: "/health-concerns/knee-osteoarthritis-joint-pain" },
      { label: "PRP explained", href: "/treatments/prp" },
      { label: "PRGF explained", href: "/treatments/prgf" },
    ],
    treatmentContext: "PRP and PRGF use components from your own blood and may be considered in selected cases. Results and evidence differ depending on the exact knee problem.",
    handoff: "A qualified clinician should confirm the diagnosis and discuss standard treatments, expected benefit, risks and whether an injection-based option makes sense for you.",
  },
  {
    question: "I want to lose weight. What can MMS offer?",
    shortAnswer: "Good weight management is about improving health, not simply making the number on the scale smaller.",
    explanation: "Weight can be affected by food habits, activity, sleep, stress, medicines, hormones and how the body handles sugar. We would normally look at your weight history together with waist size, blood pressure and selected blood tests. That helps separate a general lifestyle goal from a medical weight problem that may need more structured treatment.",
    usefulChecks: ["Weight history and waist measurement", "Blood pressure, glucose and cholesterol", "Sleep, medicines, liver health and eating pattern where relevant"],
    steps: [
      { label: "Weight & metabolic guide", href: "/health-concerns/weight-gain-metabolic-health" },
      { label: "Medical weight management", href: "/treatments/medical-weight-management" },
      { label: "Prediabetes research", href: "/health-concerns/prediabetes-insulin-resistance" },
    ],
    treatmentContext: "Prescription weight-loss medicines can be useful for some people, but they are not automatically suitable for everyone and should sit inside a longer-term health plan.",
    handoff: "A qualified prescriber should decide whether medication is appropriate, explain side effects and monitor progress, nutrition and muscle health over time.",
  },
  {
    question: "Can I do a blood test to check for cancer?",
    shortAnswer: "Some blood tests can look for cancer-related signals, but no single blood test can simply tell you that you are clear of all cancers.",
    explanation: "Different cancers are screened for in different ways. Depending on age, sex, family history and personal risk, established screening may include scans, scopes, cervical screening, breast screening or other tests. Newer multi-cancer blood tests look for patterns that may suggest a cancer signal, but a positive result still needs further investigation and a negative result does not rule every cancer out.",
    usefulChecks: ["Age and sex-related screening schedule", "Family and personal cancer history", "Any warning symptoms that need direct medical review"],
    steps: [
      { label: "Cancer-risk guide", href: "/health-concerns/cancer-risk-early-detection" },
      { label: "MCED explained", href: "/treatments/mced" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
    ],
    treatmentContext: "MCED is a screening research topic, not a cancer diagnosis and not a replacement for established screening programmes.",
    handoff: "A doctor should help decide which screening is appropriate for your age and risk, and any concerning symptom should be assessed directly rather than waiting for a screening test.",
  },
];

const promptChips = [
  "Why am I always tired?",
  "Is my weight becoming a health issue?",
  "What should I know about menopause?",
  "My joints hurt — what should I research?",
  "How do I check my heart risk?",
  "What does a cancer blood test actually tell me?",
  "Could poor sleep affect my health?",
  "What is the difference between PRP and stem-cell treatment?",
];

export function LingResearchGuide() {
  return (
    <section className="overflow-hidden bg-navy px-4 py-20 text-ivory">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b2f2b] shadow-premium">
              <Image src="/ling-mms-guide.png" alt="Ling, MMS intelligent guide" fill className="object-cover object-[50%_18%] opacity-90" sizes="(min-width: 1024px) 34vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Ask Ling</p>
                <h2 className="mt-2 font-serif text-4xl leading-tight">Clear enough to understand. Detailed enough to be useful.</h2>
                <p className="mt-3 text-sm leading-6 text-ivory/68">Ling explains health topics in everyday language, but still gives you the reasoning, checks and next questions that make the information useful.</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-gold-light/20 bg-white/5 p-5 text-sm leading-6 text-ivory/72">
              <strong className="text-gold-light">How Ling speaks:</strong> plain English first, medical term second when useful, then what it means for the next step. No jargon for the sake of sounding clever.
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-light">Questions you could start with</p>
              <div className="mt-3 flex flex-wrap gap-2">{promptChips.map(prompt => <span key={prompt} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] leading-4 text-ivory/78">{prompt}</span>)}</div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Guided research examples</p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">Simple language should not mean shallow advice.</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-ivory/68">A useful Ling answer has layers: the simple answer first, why it matters, what may need checking, where a treatment fits, and when a professional needs to take over.</p>
            <div className="mt-8 grid gap-5">
              {scenarios.map((scenario, index) => (
                <article key={scenario.question} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[.055]">
                  <div className="border-b border-white/10 p-6 md:p-7">
                    <div className="flex items-start gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ivory text-xs font-bold text-deep-green">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-light">You ask</p>
                        <h3 className="mt-2 font-serif text-2xl md:text-3xl">“{scenario.question}”</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:p-7">
                    <div className="rounded-xl bg-white/[.07] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a9c8ba]">Ling — first answer</p>
                      <p className="mt-2 text-base font-semibold leading-7 text-ivory">{scenario.shortAnswer}</p>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a9c8ba]">What that means</p>
                        <p className="mt-2 text-sm leading-7 text-ivory/76">{scenario.explanation}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[.035] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-light">What may be worth checking</p>
                        <div className="mt-3 grid gap-2">{scenario.usefulChecks.map(check => <div key={check} className="flex gap-2 text-xs leading-5 text-ivory/72"><span className="text-[#a9c8ba]">✓</span><span>{check}</span></div>)}</div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-gold-light/15 bg-[#122e34] px-4 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-light">Where treatment fits</p>
                      <p className="mt-2 text-xs leading-6 text-ivory/75">{scenario.treatmentContext}</p>
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {scenario.steps.map((step) => (
                        <Link key={step.href} href={step.href} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-ivory transition hover:border-gold-light/40 hover:bg-white/10">
                          {step.label} →
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-[#dfe9e3] px-4 py-3 text-xs leading-5 text-navy">
                      <strong className="text-deep-green">When a professional takes over:</strong> {scenario.handoff}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ling" className="rounded-full bg-ivory px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-0.5">Explore Ling →</Link>
              <Link href="/online-doctor" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-ivory transition hover:border-gold-light/50">Speak with a doctor</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
