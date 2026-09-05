(() => {
  const patientDeep = {
    "START WITH UNDERSTANDING": {
      heading: "What the first medical review is trying to answer",
      points: [
        "What are you trying to improve — prevention, energy, metabolic health, recovery, healthy ageing, kidney health or something else?",
        "Which symptoms, medicines, past diagnoses, family history and lifestyle factors materially change the picture?",
        "Which screening or tests are genuinely useful now — and which would add cost without changing a decision?",
        "What should be managed within MMS, what should be referred, and what should simply be monitored?"
      ],
      note: "The purpose is to create clarity before treatment."
    },
    "DISCOVER": {
      heading: "A useful baseline is selective, not indiscriminate",
      points: [
        "Screening should be chosen around age, sex, history, symptoms and risk rather than a one-size-fits-all panel.",
        "Results become more useful when interpreted together: trends in blood pressure, body composition, glucose, lipids, liver, kidney and other relevant markers can tell a different story than any single result.",
        "Imaging and advanced screening should answer a clinical question. A test that does not change a decision may not improve care.",
        "When something needs specialist attention, the right next step may be referral rather than adding another wellness intervention."
      ],
      note: "Assessment first. Interpretation second. Action only where justified."
    },
    "RESTORE": {
      heading: "Supportive therapies are not a substitute for fundamentals",
      points: [
        "IV therapy can be appropriate for selected hydration or nutrient-support situations, but the indication and formulation should be clinically justified.",
        "NAD+ is widely promoted in longevity care, yet patient expectations should be calibrated to the available evidence rather than marketing claims.",
        "Antioxidant and recovery strategies make more sense when sleep, nutrition, stress, hydration, activity and medical conditions are considered at the same time.",
        "Patients should know what a therapy is intended to support, what it is not proven to do, and what side effects or contraindications matter."
      ],
      note: "Support the person — not just the infusion."
    },
    "OPTIMISE": {
      heading: "Optimisation should still be medicine",
      points: [
        "Weight and metabolic programmes should look beyond appearance to glucose control, cardiovascular risk, body composition, muscle preservation, nutrition and sustainable habits.",
        "Where GLP-1 or other prescription therapies are considered, indication, contraindications, side effects, monitoring and long-term strategy matter more than rapid weight loss.",
        "Hormone symptoms are non-specific. Laboratory context, medical history and risk assessment come before any hormone intervention.",
        "Peptide programmes deserve the same discipline: product quality, legal status, indication and evidence should be clear before use."
      ],
      note: "Optimise what matters. Avoid treating every number."
    },
    "REGENERATE": {
      heading: "Advanced therapies need a higher evidence threshold",
      points: [
        "PRP and PRGF use components derived from the patient's own blood and may have selected applications depending on indication and clinician expertise.",
        "Exosome-related products vary widely in sourcing, manufacturing, evidence and regulatory status. The word 'exosome' alone does not establish quality or clinical value.",
        "MSC or stem-cell interventions are not one treatment. Cell source, preparation, indication, dose, manufacturing controls and jurisdiction all matter.",
        "NK-cell and other immune-cell services are advanced medical concepts that require careful evidence, specialist input, laboratory quality and regulatory review."
      ],
      note: "The more advanced the therapy, the stronger the need for governance, consent and specialist review."
    },
    "RENAL": {
      heading: "Dialysis is a system of care, not a machine session",
      points: [
        "Safety depends on water quality, infection-control systems, trained staff, reliable equipment and clear escalation pathways.",
        "Clinical continuity includes vascular access care, fluid balance, blood pressure, anaemia management, medication review and nutrition support.",
        "Patients benefit when the centre understands their longitudinal history rather than treating each dialysis session as an isolated event.",
        "MMS SS2 remains a planned centre subject to the relevant licensing, fit-out and operational approvals."
      ],
      note: "Consistency and clinical discipline are the product."
    },
    "ASCEND": {
      heading: "Who Ascend is designed for",
      points: [
        "People who want a structured entry into preventive health without immediately committing to the highest-touch programme.",
        "Patients who value an organised baseline, doctor review and a clearer plan for what deserves attention next.",
        "A relationship that can support continuity rather than a one-off health-screening event.",
        "Headline price: RM8,888. Detailed benefits, credits, validity and entitlements follow the current approved commercial schedule."
      ],
      note: "Think foundation, not discount bundle."
    },
    "EVOLVE": {
      heading: "Who Evolve is designed for",
      points: [
        "People with several optimisation goals who want a more active relationship around metabolic health, recovery, executive wellness or healthy ageing.",
        "Patients who expect more frequent review and greater room for coordinated programmes over time.",
        "Useful when health priorities are interconnected and require adjustment rather than a single intervention.",
        "Headline price: RM28,888. Detailed benefits, credits, validity and entitlements follow the current approved commercial schedule."
      ],
      note: "More continuity. More coordination. Still suitability-first."
    },
    "ETERNA": {
      heading: "Who Eterna is designed for",
      points: [
        "Patients seeking a broader, longer-horizon longevity relationship with higher-touch monitoring and coordination.",
        "Suitable for people managing multiple preventive, metabolic, recovery or healthy-ageing priorities over time.",
        "The value should come from continuity, organisation and the quality of decisions — not from consuming the maximum number of procedures.",
        "Headline price: RM78,888. Detailed benefits, credits, validity and entitlements follow the current approved commercial schedule."
      ],
      note: "A deeper relationship around health management."
    },
    "PINNACLE": {
      heading: "Who Pinnacle is designed for",
      points: [
        "Patients who want the highest-touch MMS relationship with greater discretion, coordination and personalised health management.",
        "Potentially relevant for executives, families or cross-border patients who value a single point of coordination across several health priorities.",
        "Premium access may improve convenience and continuity, but it never changes medical suitability or evidence standards.",
        "Headline price: RM128,888. Detailed benefits, credits, validity and entitlements follow the current approved commercial schedule."
      ],
      note: "Concierge service around medicine — never concierge medicine without standards."
    }
  };

  const partnerDeep = {
    "THE ROLE": {
      heading: "What a good MMS partner actually does",
      points: [
        "Starts a responsible conversation around prevention, longevity and the client's health priorities.",
        "Introduces MMS and helps the client understand the journey without diagnosing or prescribing.",
        "Registers the lead properly so ownership, follow-up and commercial attribution are clear.",
        "Hands clinical questions to qualified professionals and stays involved in the relationship without crossing the clinical boundary."
      ],
      note: "The partner is a trusted introducer and relationship manager — not a substitute clinician."
    },
    "MEMBERSHIP": {
      heading: "How to explain the four pathways",
      points: [
        "Ascend: a structured preventive-health entry point at RM8,888.",
        "Evolve: deeper optimisation and continuity at RM28,888.",
        "Eterna: a more comprehensive longevity relationship at RM78,888.",
        "Pinnacle: the highest-touch concierge relationship at RM128,888. Detailed benefits and entitlements remain subject to the current approved commercial schedule."
      ],
      note: "Sell the level of relationship, not a promise to consume specific treatments."
    },
    "ECONOMICS": {
      heading: "Where partner economics should come from",
      points: [
        "Approved introductions that become properly attributed patient relationships.",
        "Membership conversions or programme enrolments that meet the approved commercial rules.",
        "Disciplined follow-up that improves conversion quality instead of relying on pressure selling.",
        "Approved renewals and long-term client relationships — not recruitment of other partners as the primary source of income."
      ],
      note: "No guaranteed earnings. The value is in building a durable, compliant client book."
    },
    "CLIENT BOOK": {
      heading: "Why the client book matters more than one transaction",
      points: [
        "A well-managed client relationship can create future reviews, renewals and referrals without restarting from zero every month.",
        "CRM discipline protects attribution and prevents leads from disappearing into WhatsApp threads or personal spreadsheets.",
        "A trusted book of clients becomes commercially valuable because the partner understands context, history and the right moment to follow up.",
        "Clinical details remain private. Partners should only see commercial milestones necessary to manage the relationship."
      ],
      note: "Trust compounds when the system remembers the relationship."
    },
    "OPERATING SYSTEM": {
      heading: "What the Partner Hub is intended to solve",
      points: [
        "Lead registration and clear commercial ownership.",
        "Pipeline visibility from enquiry to consultation, approved conversion, payment and renewal.",
        "Approved materials, training and message discipline so partners do not invent medical claims.",
        "Commission visibility and auditability without exposing private medical information."
      ],
      note: "Professional infrastructure makes responsible growth easier."
    },
    "RULES": {
      heading: "Four non-negotiable boundaries",
      points: [
        "Never promise a cure, reversal, guaranteed result or guaranteed treatment suitability.",
        "Never diagnose, prescribe or answer clinical questions beyond your professional qualification.",
        "Never use patient clinical information for marketing or partner attribution.",
        "Never improvise unsupported claims. Use approved MMS materials and escalate questions when unsure."
      ],
      note: "The easiest way to destroy trust is to let sales outrun medicine."
    },
    "CAREER": {
      heading: "What long-term progression should reward",
      points: [
        "Consistent conversion quality rather than one-off volume spikes.",
        "Compliant communication and protection of the MMS brand.",
        "Strong CRM habits, follow-up discipline and renewal performance.",
        "Ability to develop channels, mentor responsibly and contribute to long-term patient relationships."
      ],
      note: "Growth should follow contribution and accountability — not downline recruitment."
    }
  };

  let last = '';
  function deck(){ return (document.querySelector('.story-deck-label')?.textContent || '').toUpperCase().includes('PARTNER') ? 'partner' : 'patient'; }
  function sceneText(){ return `${document.querySelector('.story-chapter')?.textContent || ''} ${document.querySelector('.story-copy-wrap h1')?.textContent || ''}`.toUpperCase(); }
  function match(map,text){ for(const [k,v] of Object.entries(map)) if(text.includes(k)) return v; return null; }
  function render(){
    const root = document.querySelector('.story-copy-wrap');
    if(!root) return;
    const key = `${deck()}|${sceneText()}`;
    if(key===last) return; last=key;
    document.querySelectorAll('.scene-deep-dive').forEach(n=>n.remove());
    const data = match(deck()==='partner'?partnerDeep:patientDeep,sceneText());
    if(!data) return;
    const box=document.createElement('section'); box.className='scene-deep-dive';
    box.innerHTML=`<p>DEEPER CONTEXT</p><h4>${data.heading}</h4><div>${data.points.map(x=>`<span>${x}</span>`).join('')}</div><em>${data.note}</em>`;
    root.appendChild(box);
  }
  new MutationObserver(()=>requestAnimationFrame(render)).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(render,350));
})();