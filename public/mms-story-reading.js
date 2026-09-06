(() => {
  const patient = {
    'THE QUIET CHANGE': [
      ['WHAT CHANGES FIRST','Health often shifts through small signals: lower energy, poorer sleep, slower recovery, weight change, blood pressure, glucose, lipids and stress load.'],
      ['WHY TRENDS MATTER','A single result is a snapshot. Repeated measurements, history and clinical context help reveal direction, not just a number.'],
      ['THE MMS IDEA','Preventive care means asking useful questions earlier, before a person is forced to react to a major event.']
    ],
    'WHAT IF': [
      ['START WITH DISCOVERY','MMS begins with priorities, history, symptoms, existing reports and risk factors before discussing interventions.'],
      ['BUILD A BASELINE','Screening and diagnostic choices should be proportionate to age, family history, symptoms, current guidelines and physician judgement.'],
      ['THEN PERSONALISE','The next step may be lifestyle change, monitoring, medication review, referral, a supportive therapy — or simply reassurance and follow-up.']
    ],
    'MEET MMS': [
      ['BANGSAR','Planned as the wellness and longevity flagship: consultation, preventive screening, personalised wellness pathways and relationship-led continuity.'],
      ['SS2','Planned as a dedicated renal and dialysis centre, subject to licensing, fit-out and operating approvals.'],
      ['JOHOR','Planned future advanced medical and laboratory hub, extending MMS capability into higher-complexity services as approvals and infrastructure develop.'],
      ['DIGITAL CONTINUITY','My Sanctuary, Ling and Health Intelligence are designed to help patients organise appointments, questions, reports, reminders and long-term health context.']
    ],
    'START WITH UNDERSTANDING': [
      ['ASSESS','Listen to the patient, understand goals, review history, symptoms, medication, prior reports and relevant risks.'],
      ['PERSONALISE','Qualified professionals determine which questions need screening, further investigation, treatment, monitoring or referral.'],
      ['CARE','MMS coordinates the journey while medical decisions remain with appropriately qualified professionals.'],
      ['CONTINUE','Follow-up matters: results should connect to future reviews, not disappear into a one-off visit.']
    ],
    'DISCOVER': [
      ['EXECUTIVE & PREVENTIVE SCREENING','A structured baseline may include blood tests, cardiovascular risk review, metabolic markers, body composition and targeted screening according to clinical need.'],
      ['ULTRASOUND & DIAGNOSTICS','Imaging should answer a question. It can add context to symptoms, examination findings or laboratory results and guide follow-up.'],
      ['METABOLIC & CARDIOVASCULAR REVIEW','Weight, waist, glucose, lipids, blood pressure and body composition are more useful when considered together and tracked over time.'],
      ['CANCER SCREENING','Screening depends on age, sex, family history, risk and accepted guidance. Normal results are not guarantees; abnormal results require responsible follow-up.']
    ],
    'RESTORE': [
      ['IV THERAPY','Clinician-supervised infusions may be considered for selected hydration or nutrient-support purposes where medically appropriate.'],
      ['NAD+','NAD+ is widely marketed in longevity care. MMS should set expectations carefully and review evidence, dosing, contraindications and suitability before use.'],
      ['ANTIOXIDANT SUPPORT','Supportive therapies should never be framed as universal detoxification or as a replacement for diagnosis, nutrition or established medical care.'],
      ['RECOVERY SYSTEMS','Sleep, hydration, nutrition, movement and stress remain foundational. Procedures should support a wider plan, not become the whole plan.']
    ],
    'OPTIMISE': [
      ['METABOLIC & WEIGHT HEALTH','Lifestyle, body composition, glucose regulation, cardiovascular risk and medication options can be reviewed together under medical supervision.'],
      ['HORMONE HEALTH','Symptoms alone are not enough. Hormone care requires relevant laboratory testing, diagnosis, contraindication review and benefit-risk discussion.'],
      ['PEPTIDE PROGRAMMES','Any peptide-based pathway requires careful product, evidence, regulatory and clinical review. Not every product or indication is appropriate.'],
      ['SLEEP & STRESS','Sleep quality and chronic stress influence appetite, recovery, performance, mood and metabolic health and therefore belong in a structured longevity plan.']
    ],
    'REGENERATE': [
      ['PRP / PRGF','Autologous platelet-based approaches use components prepared from the patient’s own blood and may be considered in selected musculoskeletal or aesthetic contexts.'],
      ['EXOSOME-RELATED SERVICES','Evidence, manufacturing quality, sourcing, indication and jurisdiction matter. These should never be presented as miracle products.'],
      ['MSC / CELLULAR THERAPIES','Stem-cell related interventions vary substantially by cell source, indication and legal framework and require specialist review and regulatory discipline.'],
      ['NK / ADVANCED CELLULAR CARE','Advanced immune-cell concepts require careful evaluation of evidence, manufacturing controls, indication, safety and jurisdiction before any pathway is considered.']
    ],
    'CONTINUITY': [
      ['WHY RENAL CARE IS DIFFERENT','Dialysis is not a one-off procedure. It depends on scheduled care, infection control, vascular access management, monitoring and a dependable clinical team.'],
      ['MMS SS2','The SS2 centre is planned specifically around renal and dialysis continuity, subject to CKAPS/KKM licensing, renovation, staffing and operating approvals.'],
      ['LONG-TERM VIEW','Kidney health also belongs inside broader cardiovascular, metabolic and medication review because risks often overlap.']
    ],
    'YOUR PATH': [
      ['ASCEND','Discovery-first foundation for patients who want structured preventive care, screening coordination and a clear starting roadmap.'],
      ['EVOLVE','Deeper coordination for people actively working on energy, metabolic health, weight, lifestyle and multiple wellness goals.'],
      ['ETERNA','Longer-horizon preventive and longevity relationship with broader monitoring, review and coordination.'],
      ['PINNACLE','Highest-touch private relationship for executives, founders and families requiring discretion, coordination and complex multi-priority health management.']
    ],
    'ASCEND': [
      ['WHO IT SUITS','Individuals beginning a structured wellness journey who want screening, coordination and professional review.'],
      ['FIRST 30 DAYS','Discovery discussion · baseline screening pathway · professional review planning · personalised wellness roadmap.'],
      ['COORDINATION','Health Relationship Manager support for discovery, appointment guidance and follow-up reminders.'],
      ['PRINCIPLE','Membership creates continuity and access structure. It never guarantees that a particular treatment is clinically suitable.']
    ],
    'EVOLVE': [
      ['WHO IT SUITS','Members seeking closer coordination for energy, weight, metabolic health and lifestyle optimisation.'],
      ['FIRST 30 DAYS','Discovery and goals mapping · screening and lifestyle review · suitability assessment · quarterly coordination plan.'],
      ['COORDINATION','Structured check-ins, service navigation, review preparation and follow-up across multiple wellness priorities.'],
      ['PRINCIPLE','The value is in a deeper relationship and more organised care — not unrestricted procedures.']
    ],
    'ETERNA': [
      ['WHO IT SUITS','Members planning for preventive care, personalised longevity and long-term wellness oversight.'],
      ['FIRST 30 DAYS','Expanded discovery · preventive health planning · professional review coordination · long-term roadmap setup.'],
      ['COORDINATION','Priority scheduling, longitudinal review planning and broader support across multiple health priorities.'],
      ['PRINCIPLE','Clinical decisions remain independent of membership value and continue to depend on evidence and suitability.']
    ],
    'PINNACLE': [
      ['WHO IT SUITS','Executives, founders and families seeking a highly coordinated private preventive-care relationship.'],
      ['FIRST 30 DAYS','Private discovery session · clinical suitability review · bespoke coordination plan · executive wellness roadmap.'],
      ['COORDINATION','Dedicated HRM coordination, priority appointment support and personalised planning across a more complex journey.'],
      ['PRINCIPLE','Premium access improves coordination and discretion; it does not override medical judgement.']
    ],
    'BEYOND THE CLINIC': [
      ['MY SANCTUARY','Designed as the patient relationship layer for appointments, membership, health journey organisation, medicine review and future health-passport functions.'],
      ['LING','A digital guide intended to help patients prepare questions, understand next steps and stay organised — not diagnose or replace a clinician.'],
      ['HEALTH INTELLIGENCE','The aim is to make useful trends easier to see over time by organising information around the patient rather than isolated visits.'],
      ['PRIVACY','Clinical information should remain permissioned and private. Technology supports the relationship; qualified professionals remain responsible for care.']
    ]
  };

  const partner = {
    'THE NOISE': [
      ['THE MARKET PROBLEM','Patients see clinics, supplements, social media claims, wellness trends and conflicting advice. More information has not necessarily created more confidence.'],
      ['WHY TRUST MATTERS','A credible introduction can be more valuable than another advertisement when the client is deciding who to speak to about health.'],
      ['THE PARTNER ADVANTAGE','The strongest partners are not the loudest. They already have trusted relationships and know how to protect them.']
    ],
    'THE ROLE': [
      ['EDUCATE','Explain the MMS journey, the locations, memberships and care model using approved information.'],
      ['QUALIFY','Understand the client’s objective and whether an MMS consultation is a sensible next step — without diagnosing.'],
      ['HAND OVER','Clinical questions, treatment suitability and medical recommendations are handed to qualified professionals.'],
      ['FOLLOW THROUGH','A professional partner stays organised through appointment, enrolment, follow-up and renewal milestones.']
    ],
    'THE PLATFORM': [
      ['PHYSICAL NETWORK','Bangsar wellness/longevity flagship · SS2 renal and dialysis centre · Johor future advanced medical and laboratory hub.'],
      ['DIGITAL LAYER','My Sanctuary, Ling and Health Intelligence are designed to create continuity beyond the consultation room.'],
      ['MEMBERSHIP LAYER','Ascend, Evolve, Eterna and Pinnacle create four levels of ongoing relationship rather than a one-time treatment transaction.'],
      ['PARTNER LAYER','Approved partners introduce and support clients commercially while medical decision-making remains independent.']
    ],
    'WHY CLIENTS CARE': [
      ['CLARITY','Clients want someone to help them understand where to start and what happens next.'],
      ['SAFETY','They need confidence that suitability, evidence and professional review come before aggressive selling.'],
      ['CONTINUITY','They increasingly value a relationship that remembers prior discussions, follows up and coordinates future care.'],
      ['DISCRETION','Executives, founders and families often value privacy and professional handling as much as treatment access.']
    ],
    'WHAT YOU REPRESENT': [
      ['A HEALTH JOURNEY','You represent discovery, assessment, personalised planning, care and continuity — not a single procedure.'],
      ['A STANDARD','No cure promises, no guaranteed outcomes, no unsupported claims and no medical advice unless qualified.'],
      ['A NETWORK','Your client relationship connects into clinicians, locations, memberships, digital tools and follow-up systems.']
    ],
    'THE MEMBERSHIP PATH': [
      ['ASCEND · RM8,888','Entry point into structured preventive care and organised health review.'],
      ['EVOLVE · RM28,888','Broader optimisation relationship for clients with multiple active wellness goals.'],
      ['ETERNA · RM78,888','Longer-horizon preventive and longevity relationship with deeper continuity.'],
      ['PINNACLE · RM128,888','Highest-touch private relationship for clients requiring personalised coordination and discretion.']
    ],
    'THE ECONOMICS': [
      ['THE COMMERCIAL LOGIC','A good partner business is built on quality introductions, successful enrolment, renewal and long-term client value — not indiscriminate lead volume.'],
      ['COMMISSIONS','Partner compensation should follow the approved commission schedule and only be recognised when the defined commercial milestone is achieved.'],
      ['RENEWALS','A well-managed client relationship can create recurring value when the client continues with MMS because the experience remains useful.'],
      ['NO MLM POSITIONING','The model should be presented as accountable healthcare business development and relationship management, not recruitment-led income.']
    ],
    'THE CLIENT BOOK': [
      ['REGISTER','Leads should be registered with timestamped attribution so ownership and follow-up are clear.'],
      ['PROGRESS','Track consultation, commercial status, membership/enrolment, follow-up and renewal milestones.'],
      ['COMPOUND','A small number of well-served clients who renew and refer can become more valuable than a large unmanaged contact list.'],
      ['PROTECT','Trust is the asset. Poor claims, pressure-selling or mishandling private information can destroy it quickly.']
    ],
    'THE OPERATING SYSTEM': [
      ['PARTNER HUB','Lead registration · pipeline · appointments · consultation status · enrolment status · renewal tracking · commission stages.'],
      ['ENABLEMENT','Approved presentations, scripts, FAQs, training, compliance guidance and campaign materials should sit in one controlled system.'],
      ['VISIBILITY','Partners should be able to see commercial progress and what action is required next without chasing multiple people.'],
      ['PRIVACY WALL','Partners may see commercial milestones. They should not see diagnoses, laboratory results, doctor notes or treatment-suitability decisions.']
    ],
    'THE RULES': [
      ['NO CURE PROMISES','Never claim MMS or a therapy can cure, reverse or guarantee an outcome unless such wording is specifically lawful, approved and clinically supported.'],
      ['NO DIAGNOSIS BY SALES','Partners introduce, explain and coordinate. Qualified professionals assess and decide.'],
      ['USE APPROVED MATERIAL','Treatments, memberships, pricing and claims should be communicated only through current approved materials.'],
      ['ESCALATE CLINICAL QUESTIONS','When a client asks whether a treatment is right for them, the correct answer is to arrange professional review.']
    ],
    'WHO WINS': [
      ['TRUSTED ADVISORS','Strong communication, discretion, reputation and the ability to simplify without exaggerating.'],
      ['RELATIONSHIP BUILDERS','People who follow up, remember context and treat the client book as a long-term asset.'],
      ['PROCESS DISCIPLINE','People who register leads, use approved content, keep notes and manage milestones consistently.'],
      ['JUDGEMENT','Knowing when to stop selling and hand the conversation to a doctor is part of professional selling in healthcare.']
    ],
    'CAREER': [
      ['STAGE 1 · INTRODUCE','Learn the platform, qualify responsibly and build a small book of well-served clients.'],
      ['STAGE 2 · DEEPEN','Build renewals, referral quality and stronger relationships in chosen client segments.'],
      ['STAGE 3 · DEVELOP CHANNELS','Create professional referral relationships with aligned communities, advisers and organisations where permitted.'],
      ['STAGE 4 · LEAD RESPONSIBLY','Mentor newer partners around quality, process and compliance rather than pure recruitment volume.']
    ]
  };

  const keyFor = (chapter, map) => Object.keys(map).find(k => chapter.includes(k));

  function render() {
    const scene = document.querySelector('.story-scene');
    const wrap = scene?.querySelector('.story-copy-wrap');
    if (!scene || !wrap) return;
    const chapter = (scene.querySelector('.story-chapter')?.textContent || '').toUpperCase();
    const deck = (scene.querySelector('.story-deck-label')?.textContent || '').toUpperCase();
    const map = deck.includes('PARTNER') ? partner : patient;
    const key = keyFor(chapter, map);
    const existing = wrap.querySelector('.story-reading-panel');
    if (!key) { existing?.remove(); return; }
    if (existing?.dataset.key === `${deck}|${key}`) return;
    existing?.remove();
    const panel = document.createElement('section');
    panel.className = 'story-reading-panel';
    panel.dataset.key = `${deck}|${key}`;
    panel.innerHTML = map[key].map(([title, text], i) => `<article><span>${String(i+1).padStart(2,'0')}</span><div><h4>${title}</h4><p>${text}</p></div></article>`).join('');
    const anchor = wrap.querySelector('.story-quote, .story-cta');
    if (anchor) wrap.insertBefore(panel, anchor); else wrap.appendChild(panel);
  }

  new MutationObserver(render).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(render,300));
})();