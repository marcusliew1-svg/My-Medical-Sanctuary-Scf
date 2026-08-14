type SessionStep = {
  title: string;
  text: string;
};

type SessionVisual = {
  title: string;
  intro: string;
  setting: string;
  steps: SessionStep[];
  note: string;
};

const sessionBySlug: Record<string, SessionVisual> = {
  "health-screening-ultrasound": {
    title: "What a screening visit may look like",
    intro: "The exact sequence depends on age, history and the tests actually selected by the clinician.",
    setting: "Assessment room + diagnostics",
    steps: [
      { title: "History", text: "Symptoms, family history, medicines, previous results and health goals are reviewed." },
      { title: "Measurements", text: "Relevant vital signs, body measurements and blood tests may be collected." },
      { title: "Imaging", text: "Ultrasound or other tests are performed only where clinically appropriate." },
      { title: "Review", text: "A clinician explains findings and whether anything needs follow-up." },
    ],
    note: "Screening is not a guarantee that every condition will be detected. Test choice should be risk-based rather than package-driven.",
  },
  "ecg-cardiovascular-risk-review": {
    title: "What an ECG review may look like",
    intro: "An ECG is usually quick and painless, but it is only one part of cardiovascular assessment.",
    setting: "Consultation + ECG room",
    steps: [
      { title: "Preparation", text: "The chest, wrists or ankles are prepared for electrode placement." },
      { title: "Recording", text: "The machine records the heart's electrical activity for a short period." },
      { title: "Risk context", text: "Blood pressure, cholesterol, symptoms and other risk factors are reviewed." },
      { title: "Next step", text: "Abnormal or concerning findings may require further tests or specialist care." },
    ],
    note: "A normal resting ECG does not rule out every heart problem, especially symptoms that occur only during exercise or intermittently.",
  },
  "iv-wellness-antioxidant-support": {
    title: "What an IV session may look like",
    intro: "IV therapy should start with a reason for treatment and a formulation that has been reviewed for the individual patient.",
    setting: "Supervised infusion area",
    steps: [
      { title: "Suitability check", text: "Medical history, medicines, allergies and the intended formulation are reviewed." },
      { title: "IV access", text: "A trained professional inserts a cannula into a suitable vein using sterile technique." },
      { title: "Infusion", text: "The prescribed fluid or ingredients are administered over a controlled period with monitoring." },
      { title: "Post-session", text: "The IV is removed and any symptoms or reactions are reviewed before discharge." },
    ],
    note: "The duration, ingredients and monitoring requirements vary. Wellness infusions should not be described as universally beneficial or as a substitute for diagnosis.",
  },
  "nad-plus": {
    title: "What an NAD+ discussion or infusion may look like",
    intro: "Where IV NAD+ is considered, the focus should be on the exact product, formulation, dose and rationale rather than broad anti-ageing claims.",
    setting: "Consultation + supervised infusion",
    steps: [
      { title: "Clarify the goal", text: "The clinician reviews why NAD+ is being considered and whether symptoms need investigation first." },
      { title: "Product review", text: "The formulation, source, sterile preparation and route are checked." },
      { title: "Administration", text: "If appropriate, the infusion is given under supervision at a controlled rate." },
      { title: "Response review", text: "Tolerance and any symptoms are reviewed without assuming benefit from a single session." },
    ],
    note: "This visual describes a possible clinic workflow, not proof that IV NAD+ improves ageing, energy or performance outcomes.",
  },
  "hyperbaric-oxygen": {
    title: "What a hyperbaric oxygen session may look like",
    intro: "Pressure safety and indication-specific screening come before the chamber session itself.",
    setting: "Hyperbaric treatment room",
    steps: [
      { title: "Safety screen", text: "Ear, sinus, lung, medication and fire-safety considerations are reviewed." },
      { title: "Compression", text: "The chamber pressure is gradually increased while the patient equalises ear pressure." },
      { title: "Treatment period", text: "Oxygen is breathed for the prescribed period under staff supervision." },
      { title: "Decompression", text: "Pressure is gradually returned to normal and symptoms are checked afterward." },
    ],
    note: "HBOT protocols vary by indication. General wellness sessions should not be presented as equivalent to established hospital indications.",
  },
  "red-light-photobiomodulation": {
    title: "What a red-light session may look like",
    intro: "The useful questions are which device, wavelength, dose and target tissue are being used.",
    setting: "Device treatment area",
    steps: [
      { title: "Define target", text: "The intended body area and clinical or wellness goal are identified." },
      { title: "Device setup", text: "The appropriate wavelength, distance and exposure time are selected." },
      { title: "Light exposure", text: "The target area is exposed according to the chosen protocol, with protection where required." },
      { title: "Review", text: "Response is assessed over time rather than assuming more sessions are always better." },
    ],
    note: "Evidence differs substantially by condition and device. A protocol for one use cannot automatically be generalised to another.",
  },
  "prp": {
    title: "What a PRP procedure may look like",
    intro: "PRP is a targeted autologous procedure: the patient's own blood is processed and the platelet-rich portion is used at a specific site.",
    setting: "Procedure room",
    steps: [
      { title: "Confirm target", text: "The diagnosis, treatment site and alternatives are reviewed first." },
      { title: "Blood draw", text: "A small blood sample is collected from the patient." },
      { title: "Preparation", text: "The sample is processed to create the selected platelet-rich fraction." },
      { title: "Targeted use", text: "The preparation is administered to the intended site using the appropriate clinical technique." },
    ],
    note: "Preparation methods differ and outcomes depend on the indication. PRP should not be described as guaranteed regeneration.",
  },
  "prgf": {
    title: "What a PRGF procedure may look like",
    intro: "PRGF is also blood-derived, but the exact processing system and plasma fraction are important parts of the procedure.",
    setting: "Procedure room",
    steps: [
      { title: "Assess", text: "The clinician confirms the diagnosis, target tissue and reason for using PRGF." },
      { title: "Collect", text: "Blood is drawn using the protocol required by the selected system." },
      { title: "Process", text: "The sample is processed to obtain the desired plasma fraction." },
      { title: "Apply", text: "The preparation is used at the intended treatment site under the relevant clinical protocol." },
    ],
    note: "PRGF and PRP are related but not interchangeable terms. Evidence should match the exact preparation and intended use.",
  },
  "gut-health-microbiome-support": {
    title: "What a gut-health review may look like",
    intro: "The most useful starting point is usually symptom pattern, diet and medical history rather than immediately ordering a microbiome test.",
    setting: "Consultation + nutrition review",
    steps: [
      { title: "Symptom map", text: "Bloating, pain, bowel changes, triggers and duration are reviewed." },
      { title: "History", text: "Diet, medicines, travel, infections and family history are considered." },
      { title: "Targeted tests", text: "Medical or microbiome testing is selected only if it can answer a useful question." },
      { title: "Plan", text: "Nutrition, medical follow-up or specialist referral is tailored to the findings." },
    ],
    note: "Commercial stool or microbiome results do not by themselves diagnose the cause of symptoms or dictate a validated treatment plan.",
  },
  "colon-cleansing": {
    title: "What a colonic irrigation session may involve",
    intro: "This is a wellness procedure, not routine medical detoxification. Screening for contraindications matters before proceeding.",
    setting: "Dedicated treatment room",
    steps: [
      { title: "Screen", text: "Medical history, bowel symptoms, hydration status and contraindications are reviewed." },
      { title: "Prepare", text: "The procedure and hygiene process are explained, including what discomfort to expect." },
      { title: "Irrigation", text: "Water is introduced into and removed from the colon using the selected device and protocol." },
      { title: "Aftercare", text: "Hydration, symptoms and any concerning reactions are reviewed after the session." },
    ],
    note: "Potential complications include dehydration, electrolyte disturbance and bowel injury. It should not be marketed as necessary for routine detoxification.",
  },
};

const genericSession: SessionVisual = {
  title: "What the clinical pathway may look like",
  intro: "The exact process depends on the treatment, indication, product and location.",
  setting: "Qualified clinical setting",
  steps: [
    { title: "Assessment", text: "A qualified professional reviews the diagnosis, goal, history and alternatives." },
    { title: "Suitability", text: "Contraindications, product or device details and evidence are checked." },
    { title: "Procedure", text: "The treatment is delivered using the appropriate clinical protocol if indicated." },
    { title: "Follow-up", text: "Response, side effects and next steps are reviewed rather than assuming benefit." },
  ],
  note: "This is a general educational pathway only. Specialist and advanced therapies may involve substantially more complex hospital, regulatory and manufacturing steps.",
};

export function TreatmentSessionVisual({ slug }: { slug: string }) {
  const session = sessionBySlug[slug] ?? genericSession;
  return (
    <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-premium">
      <div className="grid gap-6 bg-[#f2f6f3] p-7 md:grid-cols-[.8fr_1.2fr] md:p-9">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-deep-green">What happens during the visit?</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-navy">{session.title}</h2>
          <p className="mt-4 text-sm leading-6 text-warm-gray">{session.intro}</p>
          <div className="mt-5 inline-flex rounded-full border border-deep-green/15 bg-white px-4 py-2 text-xs font-bold text-deep-green">{session.setting}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {session.steps.map((step, index) => (
            <article key={step.title} className="relative rounded-[1.35rem] border border-stone-200 bg-white p-5 shadow-soft">
              <span className="grid size-9 place-items-center rounded-full bg-deep-green text-[11px] font-bold text-white">0{index + 1}</span>
              <h3 className="mt-4 font-serif text-2xl text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-warm-gray">{step.text}</p>
              {index < session.steps.length - 1 ? <span className="absolute -right-2.5 top-7 z-10 hidden size-5 place-items-center rounded-full bg-[#d7c9a7] text-[10px] text-navy lg:grid">→</span> : null}
            </article>
          ))}
        </div>
      </div>
      <div className="border-t border-stone-200 bg-ivory px-7 py-5 md:px-9">
        <p className="text-xs leading-5 text-warm-gray"><span className="font-bold text-navy">Important:</span> {session.note}</p>
      </div>
    </div>
  );
}
