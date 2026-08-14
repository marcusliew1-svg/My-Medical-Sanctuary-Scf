import Image from "next/image";
import Link from "next/link";

const scenarios = [
  {
    question: "I’m always tired. Where should I start?",
    answer: "Low energy can come from sleep, anaemia, thyroid issues, glucose problems, medicines, stress and many other causes. I would start by helping you organise the pattern of your symptoms and the basic checks to discuss with a qualified professional.",
    steps: [
      { label: "Understand fatigue first", href: "/health-concerns/unexplained-fatigue-low-energy" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "Read about NAD+", href: "/treatments/nad-plus" },
    ],
    handoff: "Persistent or worsening fatigue deserves medical assessment rather than assuming an infusion is the answer.",
  },
  {
    question: "My knee hurts. Should I do PRP?",
    answer: "PRP can be discussed for selected musculoskeletal problems, but knee pain has different causes and the diagnosis matters. I would first help you understand what should be assessed, then compare PRP, PRGF and other options as research topics.",
    steps: [
      { label: "Knee & joint guide", href: "/health-concerns/knee-osteoarthritis-joint-pain" },
      { label: "PRP explained", href: "/treatments/prp" },
      { label: "PRGF explained", href: "/treatments/prgf" },
    ],
    handoff: "A clinician should confirm the diagnosis and whether an injection-based procedure is appropriate.",
  },
  {
    question: "I want to lose weight. What can MMS offer?",
    answer: "A useful weight-management plan looks beyond kilograms. Blood pressure, glucose, liver health, sleep, eating pattern, activity, medicines and body composition can all matter. Prescription treatment is only one possible part of that picture.",
    steps: [
      { label: "Weight & metabolic guide", href: "/health-concerns/weight-gain-metabolic-health" },
      { label: "Medical weight management", href: "/treatments/medical-weight-management" },
      { label: "Prediabetes research", href: "/health-concerns/prediabetes-insulin-resistance" },
    ],
    handoff: "A qualified prescriber decides whether any medication is indicated and how it should be monitored.",
  },
  {
    question: "Can I do a blood test to check for cancer?",
    answer: "There are established screening programmes for particular cancers, and newer multi-cancer blood tests are being studied. A blood signal is not the same as a cancer diagnosis, and new tests should not automatically replace standard screening.",
    steps: [
      { label: "Cancer-risk guide", href: "/health-concerns/cancer-risk-early-detection" },
      { label: "MCED explained", href: "/treatments/mced" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
    ],
    handoff: "Screening choices should be based on age, sex, family history, personal risk and professional guidance.",
  },
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
                <h2 className="mt-2 font-serif text-4xl leading-tight">Start with the question you actually have.</h2>
                <p className="mt-3 text-sm leading-6 text-ivory/68">Ling can organise general information, show you what to research next and prepare you for a better doctor discussion.</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-gold-light/20 bg-white/5 p-5 text-sm leading-6 text-ivory/72">
              <strong className="text-gold-light">Boundary:</strong> Ling does not diagnose, prescribe or decide which treatment is right for you. Personal medical decisions remain with qualified professionals.
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">Guided research examples</p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">See how a question becomes a safer research pathway.</h2>
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
                    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a9c8ba]">Ling can help frame it</p>
                    <p className="mt-3 text-sm leading-7 text-ivory/76">{scenario.answer}</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {scenario.steps.map((step) => (
                        <Link key={step.href} href={step.href} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-ivory transition hover:border-gold-light/40 hover:bg-white/10">
                          {step.label} →
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-[#dfe9e3] px-4 py-3 text-xs leading-5 text-navy">
                      <strong className="text-deep-green">Human handoff:</strong> {scenario.handoff}
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
