(() => {
  const treatmentDetails = {
    "Executive & Preventive Screening": ["WHAT IT IS", "A structured review of relevant health risks using age, history, symptoms and clinical judgement.", "WHY IT MAY MATTER", "The goal is not to test everything. It is to identify what deserves attention and create a useful baseline for future comparison."],
    "Ultrasound & Diagnostics": ["WHAT IT IS", "Imaging and diagnostic tools used selectively to answer specific clinical questions and add context to symptoms, examinations and laboratory findings.", "WHY IT MAY MATTER", "A well-chosen investigation can reduce guesswork and help the doctor decide whether follow-up, monitoring or referral is needed."],
    "Metabolic & Cardiovascular Review": ["WHAT IT IS", "A joined-up review of weight, glucose, lipids, blood pressure, body composition and other relevant markers.", "WHY IT MAY MATTER", "Metabolic risk rarely sits in one number. Patterns and trends can matter more than a single result."],
    "Cancer Screening": ["WHAT IT IS", "Screening pathways considered according to age, sex, family history, risk profile and prevailing clinical guidance.", "WHY IT MAY MATTER", "The focus is appropriate screening and responsible follow-up, not fear-based testing or false reassurance."],
    "IV Therapy": ["WHAT IT IS", "Clinician-supervised infusions used for selected hydration or nutrient-support purposes where medically appropriate.", "WHY IT MAY MATTER", "They may have a role for specific needs, but should not replace diagnosis, nutrition or standard medical care."],
    "NAD+": ["WHAT IT IS", "NAD+ infusions are used in some longevity settings and are often promoted for energy and cellular support.", "WHY IT MAY MATTER", "Evidence, expectations, dosing and individual suitability should be discussed openly before use."],
    "Antioxidant Support": ["WHAT IT IS", "Selected antioxidant therapies that may be considered under medical supervision as part of a broader plan.", "WHY IT MAY MATTER", "They should never be presented as universal detoxification or as a substitute for diagnosis and proven medical treatment."],
    "Recovery Support": ["WHAT IT IS", "A broader review of hydration, sleep, nutrition, stress, movement and recovery alongside any procedure-based care.", "WHY IT MAY MATTER", "A premium longevity programme should improve the system around the patient, not simply add more interventions."],
    "Metabolic & Weight Health": ["WHAT IT IS", "A medical review of lifestyle, body composition, metabolic markers and appropriate medication options where indicated.", "WHY IT MAY MATTER", "The aim is sustainable metabolic health, not simply a lower number on the scale."],
    "Hormone Health": ["WHAT IT IS", "A review of symptoms, medical history and relevant laboratory results to determine whether further endocrine or hormone assessment is justified.", "WHY IT MAY MATTER", "Treatment depends on diagnosis, contraindications, risk and individual goals — not symptoms alone."],
    "Peptide Programmes": ["WHAT IT IS", "Selected peptide-based therapies sometimes used in wellness or performance settings.", "WHY IT MAY MATTER", "Product quality, indication, evidence and regulatory status must be reviewed carefully. Not every peptide is appropriate or lawful in every setting."],
    "Sleep & Stress": ["WHAT IT IS", "Structured attention to sleep quality, stress load, recovery patterns and related lifestyle factors.", "WHY IT MAY MATTER", "Poor sleep and chronic stress can influence appetite, energy, performance, mood and metabolic health."],
    "PRP / PRGF": ["WHAT IT IS", "Autologous platelet-based approaches prepared from a patient's own blood.", "WHY IT MAY MATTER", "They may be considered in selected musculoskeletal or aesthetic contexts after proper assessment, depending on indication and clinician judgement."],
    "Exosome-related Services": ["WHAT IT IS", "Products marketed around extracellular vesicles or exosome-related applications.", "WHY IT MAY MATTER", "Evidence, manufacturing quality, jurisdiction and indication matter. MMS should proceed only where medically and legally appropriate."],
    "MSC / Cellular Therapies": ["WHAT IT IS", "Stem-cell related interventions that vary significantly by cell type, source, indication and jurisdiction.", "WHY IT MAY MATTER", "These are not routine wellness add-ons. They require specialist review, credible sourcing and regulatory discipline."],
    "NK / Advanced Cellular Care": ["WHAT IT IS", "Cellular approaches involving natural killer cells or other advanced immune-cell concepts.", "WHY IT MAY MATTER", "Suitability, evidence, manufacturing controls, indication and regulation must be evaluated before any pathway is considered."]
  };

  const packageDetails = {
    "ASCEND": ["Designed as the structured entry point into MMS preventive care", "Supports screening, review and continuity rather than one-off visits", "Health Reserve Credits can align spending with the care journey", "Suitable for people who want a disciplined starting point", "All services remain subject to clinical suitability and current approved terms"],
    "EVOLVE": ["Designed for patients with several health priorities", "Broader room for optimisation and ongoing care planning", "More frequent review can support adjustment over time", "Suitable for executives and patients seeking deeper continuity", "No package guarantees treatment eligibility"],
    "ETERNA": ["Designed as a broader, longer-horizon longevity relationship", "Supports multiple health priorities over time", "More room for monitoring, coordination and structured follow-up", "Intended for patients who want high-touch preventive and longevity planning", "Clinical decisions remain independent of package value"],
    "PINNACLE": ["Highest-touch MMS membership positioning", "Designed around discretion, coordination and continuity", "Suitable for complex or multi-priority health journeys", "Can support executive, family and cross-border coordination where available", "Premium access never overrides medical judgement"]
  };

  function enrichTreatments() {
    document.querySelectorAll('.treatment-grid article').forEach(card => {
      if (card.dataset.enriched === '1') return;
      const name = card.querySelector('h3')?.textContent?.trim();
      const detail = name && treatmentDetails[name];
      if (!detail) return;
      const existing = card.querySelector('p');
      if (existing) existing.remove();
      const frag = document.createDocumentFragment();
      const b1 = document.createElement('b'); b1.textContent = detail[0];
      const p1 = document.createElement('p'); p1.textContent = detail[1];
      const b2 = document.createElement('b'); b2.textContent = detail[2];
      const p2 = document.createElement('p'); p2.textContent = detail[3];
      frag.append(b1,p1,b2,p2); card.appendChild(frag); card.dataset.enriched = '1';
    });
  }

  function enrichPackages() {
    document.querySelectorAll('.package-panel').forEach(panel => {
      if (panel.dataset.enriched === '1') return;
      const name = panel.querySelector('span')?.textContent?.trim();
      const detail = name && packageDetails[name];
      if (!detail) return;
      const ul = panel.querySelector('ul');
      if (ul) ul.innerHTML = '';
      detail.forEach(d => { const li = document.createElement('li'); li.textContent = d; ul?.appendChild(li); });
      panel.dataset.enriched = '1';
    });
  }

  function addFilmLabels() {
    const scene = document.querySelector('.story-scene');
    if (!scene || scene.querySelector('.substance-ribbon')) return;
    const ribbon = document.createElement('div');
    ribbon.className = 'substance-ribbon';
    ribbon.innerHTML = '<span>PHYSICIAN-GUIDED</span><span>SUITABILITY-FIRST</span><span>EVIDENCE-AWARE</span><span>CONTINUITY-FOCUSED</span>';
    scene.appendChild(ribbon);
  }

  function run(){ enrichTreatments(); enrichPackages(); addFilmLabels(); }
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(run,250));
})();