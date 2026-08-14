import Link from "next/link";

type Goal = {
  title: string;
  subtitle: string;
  signal: string;
  concernHref: string;
  treatmentLinks: { label: string; href: string }[];
  accent: string;
};

const goals: Goal[] = [
  {
    title: "Energy",
    subtitle: "Fatigue, low energy & recovery",
    signal: "Start by asking why energy is low.",
    concernHref: "/health-concerns/unexplained-fatigue-low-energy",
    treatmentLinks: [
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "NAD+", href: "/treatments/nad-plus" },
      { label: "IV wellness", href: "/treatments/iv-wellness-antioxidant-support" },
    ],
    accent: "from-[#e2ece6] via-white to-[#eee6dc]",
  },
  {
    title: "Weight",
    subtitle: "Metabolic health & body composition",
    signal: "Look beyond kilograms to glucose, liver, sleep and risk.",
    concernHref: "/health-concerns/weight-gain-metabolic-health",
    treatmentLinks: [
      { label: "Medical weight management", href: "/treatments/medical-weight-management" },
      { label: "Hormone review", href: "/treatments/hormone-therapy" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
    ],
    accent: "from-[#e7eadf] via-white to-[#eadfd8]",
  },
  {
    title: "Joints",
    subtitle: "Knee pain, mobility & recovery",
    signal: "Confirm the diagnosis before discussing regenerative options.",
    concernHref: "/health-concerns/knee-osteoarthritis-joint-pain",
    treatmentLinks: [
      { label: "PRP", href: "/treatments/prp" },
      { label: "PRGF", href: "/treatments/prgf" },
      { label: "Red light", href: "/treatments/red-light-photobiomodulation" },
    ],
    accent: "from-[#eee2db] via-white to-[#e3ebe7]",
  },
  {
    title: "Sexual health",
    subtitle: "Libido, erectile function & hormones",
    signal: "Symptoms can have vascular, metabolic, hormonal and medication causes.",
    concernHref: "/health-concerns/erectile-dysfunction-mens-health",
    treatmentLinks: [
      { label: "Hormone review", href: "/treatments/hormone-therapy" },
      { label: "Metabolic management", href: "/treatments/medical-weight-management" },
      { label: "Cardiovascular review", href: "/treatments/ecg-cardiovascular-risk" },
    ],
    accent: "from-[#eadfe5] via-white to-[#e4ece7]",
  },
  {
    title: "Gut",
    subtitle: "Bloating, bowel change & digestive health",
    signal: "Symptoms and red flags come before microbiome labels.",
    concernHref: "/health-concerns/digestive-gut-symptoms",
    treatmentLinks: [
      { label: "Gut health review", href: "/treatments/gut-health-microbiome" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "Colon cleansing", href: "/treatments/colon-cleansing" },
    ],
    accent: "from-[#e8eadf] via-white to-[#eee4d9]",
  },
  {
    title: "Sleep",
    subtitle: "Stress, snoring & recovery",
    signal: "Sleep quality can be a medical issue, not just a wellness problem.",
    concernHref: "/health-concerns/poor-sleep-stress-recovery",
    treatmentLinks: [
      { label: "Health discovery", href: "/health-discovery" },
      { label: "Red light", href: "/treatments/red-light-photobiomodulation" },
      { label: "NAD+", href: "/treatments/nad-plus" },
    ],
    accent: "from-[#e1e6ef] via-white to-[#e9e4dc]",
  },
  {
    title: "Healthy ageing",
    subtitle: "Prevention, resilience & long-term health",
    signal: "Healthy ageing starts with risk detection and proven basics.",
    concernHref: "/health-discovery",
    treatmentLinks: [
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "Metabolic management", href: "/treatments/medical-weight-management" },
      { label: "Treatment research", href: "/treatments/research" },
    ],
    accent: "from-[#dfe9e3] via-white to-[#e8dfd6]",
  },
  {
    title: "Cancer screening",
    subtitle: "Risk, established screening & emerging MCED",
    signal: "Screening is not diagnosis, and new tests do not replace standard programmes.",
    concernHref: "/health-concerns/cancer-risk-early-detection",
    treatmentLinks: [
      { label: "MCED", href: "/treatments/mced" },
      { label: "Health screening", href: "/treatments/health-screening-ultrasound" },
      { label: "Blood-cancer specialist education", href: "/health-concerns/blood-cancer-car-t-specialist-care" },
    ],
    accent: "from-[#e8e1d8] via-white to-[#e2e9e6]",
  },
];

export function HealthGoalExplorer() {
  return (
    <section className="bg-[#f4f1eb] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Explore by what matters to you</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-navy md:text-6xl">People rarely start with a medical term.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-warm-gray">Choose a health goal or concern to see the kinds of topics people commonly research. These links are for education and discussion only; they do not mean the listed treatment is suitable or recommended for you.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {goals.map((goal, index) => (
            <article key={goal.title} className={`group overflow-hidden rounded-[1.7rem] border border-stone-200 bg-gradient-to-br ${goal.accent} p-6 shadow-soft`}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-deep-green text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-lg text-deep-green transition group-hover:translate-x-1">↗</span>
              </div>
              <h3 className="mt-5 font-serif text-3xl text-navy">{goal.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-warm-gray">{goal.subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-navy">{goal.signal}</p>

              <Link href={goal.concernHref} className="mt-5 inline-flex text-sm font-bold text-deep-green">Explore the concern →</Link>

              <div className="mt-5 border-t border-deep-green/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Topics people may ask about</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {goal.treatmentLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-full border border-deep-green/15 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-deep-green transition hover:border-deep-green">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#d8b9ad] bg-[#f7ece8] px-5 py-4 text-xs leading-5 text-navy">
          <strong>Medical boundary:</strong> symptoms can have many causes. The explorer is a research aid, not a diagnosis tool or treatment recommendation. Seek qualified medical assessment, especially for persistent, severe or worsening symptoms.
        </div>
      </div>
    </section>
  );
}
