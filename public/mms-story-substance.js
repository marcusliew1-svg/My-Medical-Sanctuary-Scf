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
    "ASCEND": ["Discovery-first membership pathway — start with clarity", "Designed for individuals beginning a structured wellness journey", "First 30 days: discovery discussion, baseline screening pathway, professional review planning and a personalised wellness roadmap", "Health Relationship Manager coordination supports appointments, discovery and follow-up reminders", "All services remain subject to clinical suitability and current approved terms"],
    "EVOLVE": ["Personalised coordination pathway — optimise your potential", "Designed for members focused on energy, weight, metabolic health and lifestyle optimisation", "First 30 days: goals mapping, screening and lifestyle review, suitability assessment and a quarterly coordination plan", "Structured check-ins, service navigation and review preparation support continuity", "No package guarantees treatment eligibility"],
    "ETERNA": ["Long-term preventive care pathway — protect your future", "Designed for members planning personalised longevity and longer-horizon preventive oversight", "First 30 days: expanded discovery, preventive health planning, professional review coordination and long-term roadmap setup", "Priority coordination supports review scheduling and longitudinal wellness planning", "Clinical decisions remain independent of package value"],
    "PINNACLE": ["By invitation and suitability assessment — private, highly coordinated care", "Designed for executives, founders and families seeking a highly coordinated preventive-care relationship", "First 30 days: private discovery session, clinical suitability review, bespoke coordination plan and executive wellness roadmap", "Dedicated coordination and priority appointment support are central to the relationship", "Premium access never overrides medical judgement"]
  };

  const chapterPanels = {
    patient: {
      "01 · THE QUIET CHANGE": [["WHY EARLY MATTERS", "Reactive behaviour, fragmented care and poor follow-up can allow small changes to become invisible patterns. MMS is designed to keep those patterns visible earlier."], ["WHAT WE TRACK", "Energy, sleep and recovery sit alongside metabolic markers, body composition, cardiovascular risk and screening status — not as isolated wellness trends."], ["THE PRINCIPLE", "Physician-guided. Suitability-first. Evidence-aware. Continuity-focused."]],
      "02 · WHAT IF": [["ASSESS", "Listen, screen and create a useful baseline rather than ordering every possible test."], ["PERSONALISE", "Shape the next step around findings, goals, risk and suitability."], ["CONTINUE", "Keep appointments, reviews, reminders and long-term preventive health visible after the visit."]],
      "03 · MEET MMS": [["BANGSAR", "Planned Wellness & Longevity Flagship for GP-led screening, preventive care and approved wellness/longevity services."], ["SS2", "Planned Renal / Dialysis Centre focused on continuity, safety and chronic-care support, subject to licensing and operational approvals."], ["JOHOR", "Planned Advanced Medical & Laboratory Hub intended to extend specialist, laboratory and advanced medical capability as approved."]],
      "04 · START WITH UNDERSTANDING": [["START FROM THE CONCERN", "Healthy ageing, energy and recovery, metabolic health, sleep and stress, hormone health, cancer screening, regenerative recovery and kidney health all begin with context."], ["PROFESSIONAL REVIEW", "History, symptoms, medicines, lifestyle, screening and relevant results are brought together before personalised recommendations are discussed."], ["HUMAN-LED", "Ling can help patients prepare better questions. Health Relationship Managers coordinate the journey. Qualified professionals remain responsible for medical judgement."]],
      "09 · CONTINUITY": [["DIALYSIS IS A SYSTEM OF CARE", "Consistent clinical oversight, infection control, vascular-access care, fluid management, medication review and nutrition are part of the pathway — not just the machine session."], ["WHY SS2 MATTERS", "A dedicated renal environment is intended to support consistency, monitoring and trusted long-term relationships."], ["STATUS", "MMS SS2 remains planned and subject to licensing, fit-out and operational approvals."]],
      "10 · YOUR PATH": [["ASCEND", "Preventive-health foundation and discovery-first pathway."], ["EVOLVE + ETERNA", "Deeper optimisation and long-term preventive-care coordination for members who want greater continuity."], ["PINNACLE", "Private, highly coordinated care for executives, founders and families, by invitation and suitability assessment."]],
      "15 · BEYOND THE CLINIC": [["MY SANCTUARY", "Designed around appointments, membership, invoices, reports, the health journey, medicine review, reminders and a future Health Passport."], ["LING", "A digital health guide for education, preparation and continuity — not a substitute for a clinician."], ["HEALTH INTELLIGENCE", "A future longitudinal view can bring together metabolic health, cardiovascular risk, sleep/recovery, body composition, hormone health and screening status over time."]]
    },
    partner: {
      "02 · THE ROLE": [["EDUCATE & QUALIFY", "Understand the client's goals, readiness and practical needs without diagnosing or making treatment promises."], ["COORDINATE & FOLLOW UP", "Use the system for bookings, lead attribution, pipeline discipline, follow-up and renewal timing."], ["PROTECT TRUST", "When a question becomes clinical, hand it to a qualified professional. Reputation is part of the business model."]],
      "03 · THE PLATFORM": [["PHYSICAL NETWORK", "Bangsar, SS2 and Johor are positioned as one MMS care network, each with a distinct approved or planned role."], ["DIGITAL CONTINUITY", "My Sanctuary, Ling and Health Intelligence are designed to help organise the patient's journey beyond a single appointment."], ["PARTNER LAYER", "The partner introduces and supports the relationship. It does not sit inside the clinical decision-making layer."]],
      "04 · WHY CLIENTS CARE": [["A BETTER ENTRY POINT", "Enquiry and screening should listen first and create a safe path into qualified review."], ["A PERSONALISED PLAN", "Goals, suitability and longer-term needs shape the next step instead of pushing a procedure."], ["FOLLOW-UP, RENEWAL & REFERRAL", "Continuity creates more value for the patient and a more durable relationship for the partner."]],
      "07 · THE ECONOMICS": [["FIRST CONVERSION", "Reward successful client onboarding rather than activity for activity's sake."], ["QUALITY + DISCIPLINE", "Quality referrals, proper CRM usage and professional follow-up are part of the commercial model."], ["LONG-TERM VALUE", "Renewals and referrals can create compounding relationship value. Earnings are never guaranteed and must not depend on recruitment chains."]],
      "08 · THE CLIENT BOOK": [["REGISTER", "Lead registration and timestamped attribution protect relationship ownership and reduce internal disputes."], ["FOLLOW", "Commercial status, consultation progress and renewal timing help partners know when responsible follow-up is appropriate."], ["COMPOUND", "A well-served client book can create renewal and referral value over time — if trust is protected."]],
      "09 · THE OPERATING SYSTEM": [["PARTNER HUB", "Lead registration, attribution, pipeline, appointments, training, approved materials, renewals and commission stages belong in one operating system."], ["AI + CONTENT", "Scripts, FAQs, training support, multilingual drafts and approved education materials can make good behaviour easier to repeat."], ["PRIVACY WALL", "Partners may see commercial milestones. They must not see diagnoses, laboratory results, doctor notes or treatment suitability."]],
      "10 · THE RULES": [["NO MEDICAL CLAIMS", "No cure promises, prevention guarantees, guaranteed outcomes or unsupported claims."], ["NO DIAGNOSIS BY SALES", "Use safe language such as may support, subject to suitability and guided by qualified review."], ["CONFIDENTIALITY", "Patient information must be handled professionally; clinical data stays separated from the sales layer."]],
      "11 · WHO WINS": [["TRUSTED ADVISOR", "Professional communication and credible relationships matter more than aggressive selling."], ["CRM DISCIPLINE", "Consistent lead management, follow-up and renewal work turn relationships into a repeatable business process."], ["LONG-TERM THINKING", "The strongest partners protect their reputation, understand the journey and know when to bring in a clinician."]],
      "12 · CAREER": [["BUILD A BOOK", "Progress from individual introductions to a durable portfolio of trusted client relationships."], ["DEVELOP CHANNELS", "Longer-term contribution can include referral channels, account development and responsible mentoring."], ["EARN PROGRESSION", "Advancement should reflect performance, compliance, CRM discipline, client care and long-term contribution — not recruitment volume."]]
    }
  };

  function currentDeck(){
    const label = (document.querySelector('.story-deck-label')?.textContent || '').toUpperCase();
    return label.includes('PARTNER') ? 'partner' : 'patient';
  }

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

  function addReadingPanel(){
    const scene = document.querySelector('.story-scene');
    const wrap = scene?.querySelector('.story-copy-wrap');
    if (!scene || !wrap) return;
    scene.querySelectorAll('.story-reading-panel').forEach(n => n.remove());
    const chapter = scene.querySelector('.story-chapter')?.textContent?.trim();
    const items = chapter && chapterPanels[currentDeck()]?.[chapter];
    if (!items) return;
    const panel = document.createElement('div');
    panel.className = 'story-reading-panel';
    panel.innerHTML = items.map(([title,text]) => `<article><b>${title}</b><p>${text}</p></article>`).join('');
    const anchor = wrap.querySelector('.story-quote,.story-cta');
    if (anchor) wrap.insertBefore(panel, anchor); else wrap.appendChild(panel);
  }

  function addFilmLabels() {
    const scene = document.querySelector('.story-scene');
    if (!scene || scene.querySelector('.substance-ribbon')) return;
    const ribbon = document.createElement('div');
    ribbon.className = 'substance-ribbon';
    ribbon.innerHTML = '<span>PHYSICIAN-GUIDED</span><span>SUITABILITY-FIRST</span><span>EVIDENCE-AWARE</span><span>CONTINUITY-FOCUSED</span>';
    scene.appendChild(ribbon);
  }

  function run(){ enrichTreatments(); enrichPackages(); addReadingPanel(); addFilmLabels(); }
  new MutationObserver(()=>requestAnimationFrame(run)).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(run,250));
})();