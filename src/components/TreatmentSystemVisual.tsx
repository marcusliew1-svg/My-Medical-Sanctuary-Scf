type SystemVisual = {
  title: string;
  subtitle: string;
  signal: string;
  focus: string[];
  accent: string;
};

const visualBySlug: Record<string, SystemVisual> = {
  "health-screening-ultrasound": { title: "Whole-body discovery", subtitle: "Screening & imaging", signal: "Signals before symptoms", focus: ["Blood markers", "Ultrasound", "Risk patterns"], accent: "from-[#dce9e1] via-white to-[#e7efe9]" },
  "ecg-cardiovascular-risk": { title: "Heart & circulation", subtitle: "Electrical rhythm + risk", signal: "Rhythm · pressure · lipids", focus: ["ECG", "Blood pressure", "Cardiovascular risk"], accent: "from-[#eadfd8] via-white to-[#edf1ee]" },
  "iv-wellness-antioxidant-support": { title: "Circulation & infusion", subtitle: "IV route", signal: "Fluids · ingredients · monitoring", focus: ["Sterility", "Formulation", "Suitability"], accent: "from-[#e1ebe8] via-white to-[#ece7df]" },
  "nad-plus": { title: "Cellular energy", subtitle: "Metabolic cofactor", signal: "Energy chemistry, not age reversal", focus: ["Cell metabolism", "IV route", "Evidence limits"], accent: "from-[#dfe9e3] via-white to-[#ece4dc]" },
  "medical-weight-management": { title: "Metabolic system", subtitle: "Weight + glucose + liver", signal: "Measure risk, not just kilograms", focus: ["Glucose", "Liver", "Body composition"], accent: "from-[#e7eadf] via-white to-[#e9e1d8]" },
  "hormone-therapy": { title: "Hormonal balance", subtitle: "Endocrine pathways", signal: "Symptoms + testing + diagnosis", focus: ["Menopause", "Testosterone", "Monitoring"], accent: "from-[#eadfe5] via-white to-[#e7ebe4]" },
  "peptides": { title: "Biological signalling", subtitle: "Molecule-specific", signal: "One class, many very different drugs", focus: ["Exact molecule", "Indication", "Regulatory status"], accent: "from-[#e4e1ed] via-white to-[#e7eee8]" },
  "gut-health-microbiome": { title: "Gut & microbiome", subtitle: "Digestive ecosystem", signal: "Symptoms first, test second", focus: ["Nutrition", "Bowel pattern", "Microbiome context"], accent: "from-[#e8eadf] via-white to-[#e8e0d7]" },
  "colon-cleansing": { title: "Colon & hydration", subtitle: "Wellness procedure", signal: "Not routine detoxification", focus: ["Hydration", "Electrolytes", "Bowel safety"], accent: "from-[#eee5dc] via-white to-[#e5ebe6]" },
  "hyperbaric-oxygen": { title: "Oxygen delivery", subtitle: "Pressure + oxygen", signal: "Established uses are indication-specific", focus: ["Pressure", "Oxygen", "Safety protocols"], accent: "from-[#dce9ec] via-white to-[#e8ebe2]" },
  "red-light-photobiomodulation": { title: "Light & tissue", subtitle: "Photobiomodulation", signal: "Wavelength + dose matter", focus: ["Wavelength", "Dose", "Target tissue"], accent: "from-[#f0ded9] via-white to-[#ebe7df]" },
  "prp": { title: "Platelets & healing signals", subtitle: "Autologous blood-derived", signal: "Targeted procedure", focus: ["Platelets", "Treatment site", "Condition-specific evidence"], accent: "from-[#ecdcd8] via-white to-[#e5ebe6]" },
  "prgf": { title: "Growth-factor-rich plasma", subtitle: "Autologous preparation", signal: "Protocol matters", focus: ["Blood processing", "Growth factors", "Target tissue"], accent: "from-[#e8ddd7] via-white to-[#e6ece7]" },
  "msc-stem-cell-pathways": { title: "Cell therapy", subtitle: "Regenerative medicine", signal: "Exact cell product matters", focus: ["Cell source", "Manufacturing", "Regulatory pathway"], accent: "from-[#dce7e3] via-white to-[#e7dfd6]" },
  "exosome-services": { title: "Cell-to-cell signalling", subtitle: "Extracellular vesicles", signal: "Promising science ≠ proven treatment", focus: ["Product identity", "Manufacturing", "Evidence"], accent: "from-[#e1e6ef] via-white to-[#e5ece8]" },
  "nk-cell-therapy": { title: "Immune system", subtitle: "Natural killer cells", signal: "Specialist / research-led", focus: ["Immune cells", "Cancer context", "Clinical governance"], accent: "from-[#e0e6ec] via-white to-[#e6e2dc]" },
  "mced": { title: "Cancer signal detection", subtitle: "Blood-based screening research", signal: "Signal detection ≠ diagnosis", focus: ["Blood biomarkers", "Follow-up", "Standard screening"], accent: "from-[#e8e1d8] via-white to-[#e3ebe7]" },
  "car-t": { title: "Engineered immunity", subtitle: "Specialist oncology", signal: "Personalised cell therapy", focus: ["T cells", "Cancer target", "Hospital monitoring"], accent: "from-[#dfe5ec] via-white to-[#e8dfdc]" },
};

const defaultVisual: SystemVisual = {
  title: "Clinical pathway",
  subtitle: "Assessment-led care",
  signal: "Understand before deciding",
  focus: ["Assessment", "Evidence", "Professional review"],
  accent: "from-[#dfe9e3] via-white to-[#ece6de]",
};

function Node({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-28 md:size-32" : size === "sm" ? "size-14" : "size-20";
  return <div className={`grid ${sizeClass} place-items-center rounded-full border border-deep-green/15 bg-white/90 p-3 text-center shadow-soft`}><span className="text-xs font-bold leading-4 text-deep-green">{label}</span></div>;
}

export function TreatmentSystemVisual({ slug }: { slug: string }) {
  const visual = visualBySlug[slug] ?? defaultVisual;
  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-stone-200 bg-gradient-to-br ${visual.accent} p-6 shadow-premium md:p-8`}>
      <div className="absolute -right-12 -top-12 size-44 rounded-full border border-deep-green/10 bg-white/40" />
      <div className="absolute -bottom-16 -left-10 size-52 rounded-full border border-gold/10 bg-white/30" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">Body-system view</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-navy">{visual.title}</h2>
          <p className="mt-2 text-sm font-semibold text-warm-gray">{visual.subtitle}</p>
          <div className="mt-5 inline-flex rounded-full border border-deep-green/15 bg-white/75 px-4 py-2 text-xs font-bold text-deep-green">{visual.signal}</div>
        </div>
        <div className="relative min-h-[270px]">
          <div className="absolute left-1/2 top-1/2 h-px w-[68%] -translate-x-1/2 -translate-y-1/2 bg-deep-green/15" />
          <div className="absolute left-1/2 top-1/2 h-[68%] w-px -translate-x-1/2 -translate-y-1/2 bg-deep-green/15" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Node label={visual.title} size="lg" /></div>
          <div className="absolute left-[7%] top-[10%]"><Node label={visual.focus[0]} size="sm" /></div>
          <div className="absolute right-[7%] top-[12%]"><Node label={visual.focus[1]} size="sm" /></div>
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2"><Node label={visual.focus[2]} size="sm" /></div>
        </div>
      </div>
      <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">{visual.focus.map((item,index)=><div key={item} className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-warm-gray">Focus 0{index+1}</span><p className="mt-1 text-sm font-semibold text-navy">{item}</p></div>)}</div>
    </div>
  );
}
