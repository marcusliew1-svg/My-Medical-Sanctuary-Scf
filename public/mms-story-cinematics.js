(() => {
  const sceneSets = {
    patient: {
      "THE QUIET CHANGE": { kind: "biomarkers", labels: ["ENERGY", "SLEEP", "GLUCOSE", "RECOVERY", "STRESS"], tempo: "slow" },
      "WHAT IF": { kind: "journey", labels: ["DISCOVER", "ASSESS", "REVIEW", "PERSONALISE", "CONTINUE"], tempo: "lift" },
      "MEET MMS": { kind: "network", labels: ["BANGSAR", "SS2", "JOHOR", "MY SANCTUARY", "LING", "HEALTH INTELLIGENCE"], tempo: "wide" },
      "START WITH UNDERSTANDING": { kind: "aura", labels: ["HISTORY", "SYMPTOMS", "SCREENING", "REVIEW"], tempo: "quiet" },
      "DISCOVER": { kind: "scan", labels: ["SCREENING", "ULTRASOUND", "METABOLIC", "CARDIOVASCULAR", "CANCER SCREENING"], tempo: "clinical" },
      "RESTORE": { kind: "molecules", labels: ["IV", "NAD+", "HYDRATION", "RECOVERY"], tempo: "flow" },
      "OPTIMISE": { kind: "rings", labels: ["METABOLISM", "SLEEP", "HORMONES", "STRESS", "WEIGHT"], tempo: "pulse" },
      "REGENERATE": { kind: "cells", labels: ["PRP", "PRGF", "EXOSOMES", "MSC", "NK"], tempo: "caution" },
      "CONTINUITY": { kind: "renal", labels: ["CONSISTENCY", "SAFETY", "MONITORING", "TRUST"], tempo: "steady" },
      "YOUR PATH": { kind: "tiers", labels: ["ASCEND", "EVOLVE", "ETERNA", "PINNACLE"], tempo: "reveal" },
      "ASCEND": { kind: "tier", labels: ["ASCEND", "RM8,888"], tempo: "tier" },
      "EVOLVE": { kind: "tier", labels: ["EVOLVE", "RM28,888"], tempo: "tier" },
      "ETERNA": { kind: "tier", labels: ["ETERNA", "RM78,888"], tempo: "tier" },
      "PINNACLE": { kind: "tier", labels: ["PINNACLE", "RM128,888"], tempo: "tier-signature" },
      "BEYOND THE CLINIC": { kind: "digital", labels: ["APPOINTMENTS", "REPORTS", "HEALTH PASSPORT", "LING"], tempo: "lift" },
      "EPILOGUE": { kind: "aura", labels: ["UNDERSTAND", "DECIDE", "CONTINUE"], tempo: "finale" }
    },
    partner: {
      "THE NOISE": { kind: "noise", labels: ["CLAIMS", "TRENDS", "SOCIAL MEDIA", "SUPPLEMENTS", "ADVERTISING"], tempo: "urgent" },
      "THE ROLE": { kind: "bridge", labels: ["CURIOSITY", "ASSESSMENT", "REVIEW", "CONTINUITY"], tempo: "lift" },
      "THE PLATFORM": { kind: "network", labels: ["BANGSAR", "SS2", "JOHOR", "MY SANCTUARY", "LING", "HEALTH INTELLIGENCE"], tempo: "wide" },
      "WHY CLIENTS CARE": { kind: "journey", labels: ["ENQUIRY", "SCREENING", "REVIEW", "PLAN", "FOLLOW-UP", "RENEWAL"], tempo: "human" },
      "WHAT YOU REPRESENT": { kind: "constellation", labels: ["SCREENING", "LONGEVITY", "METABOLIC", "WELLNESS", "INTELLIGENCE"], tempo: "wide" },
      "THE MEMBERSHIP PATH": { kind: "tiers", labels: ["ASCEND", "EVOLVE", "ETERNA", "PINNACLE"], tempo: "reveal" },
      "THE ECONOMICS": { kind: "funnel", labels: ["INTRODUCE", "CONVERT", "SERVE", "RENEW"], tempo: "business" },
      "THE CLIENT BOOK": { kind: "constellation", labels: ["TRUST", "FOLLOW-UP", "RENEWAL", "REFERRAL"], tempo: "compound" },
      "THE OPERATING SYSTEM": { kind: "dashboard", labels: ["LEADS", "PIPELINE", "APPOINTMENTS", "TRAINING", "COMMISSIONS"], tempo: "system" },
      "THE RULES": { kind: "shield", labels: ["NO CURE CLAIMS", "NO GUARANTEES", "NO DIAGNOSIS BY SALES", "PRIVACY"], tempo: "caution" },
      "WHO WINS": { kind: "growth", labels: ["TRUST", "DISCIPLINE", "FOLLOW-UP", "REPUTATION"], tempo: "human" },
      "CAREER": { kind: "growth", labels: ["CLIENT BOOK", "RENEWALS", "CHANNELS", "LEADERSHIP"], tempo: "lift" },
      "EPILOGUE": { kind: "aura", labels: ["HEALTH", "TRUST", "REPUTATION"], tempo: "finale" }
    }
  };

  const qs = (s) => document.querySelector(s);
  let lastKey = "";

  function currentDeck() {
    const label = (qs('.story-deck-label')?.textContent || '').toUpperCase();
    return label.includes('PARTNER') ? 'partner' : 'patient';
  }

  function currentSceneText() {
    return `${qs('.story-chapter')?.textContent || ''} ${qs('.story-copy-wrap h1')?.textContent || ''}`.toUpperCase();
  }

  function findConfig(deck, text) {
    const entries = Object.entries(sceneSets[deck] || {});
    for (const [needle, cfg] of entries) if (text.includes(needle)) return cfg;
    return null;
  }

  function svgFor(kind) {
    if (kind === 'biomarkers' || kind === 'rings') return `<svg viewBox="0 0 600 600" aria-hidden="true"><g class="rings"><circle cx="300" cy="300" r="210"/><circle cx="300" cy="300" r="155"/><circle cx="300" cy="300" r="98"/></g><path class="pulse" d="M70 320 L150 320 L188 250 L230 375 L274 292 L320 320 L390 320 L424 275 L454 344 L520 320"/></svg>`;
    if (kind === 'cells' || kind === 'molecules') return `<svg viewBox="0 0 600 600" aria-hidden="true"><g class="cells"><circle cx="180" cy="205" r="64"/><circle cx="365" cy="155" r="42"/><circle cx="405" cy="360" r="86"/><circle cx="205" cy="410" r="35"/></g><g class="links"><path d="M225 220 C300 190 320 180 352 165"/><path d="M390 196 C420 245 425 285 414 318"/><path d="M330 374 C280 400 255 410 240 415"/></g></svg>`;
    if (kind === 'network' || kind === 'constellation' || kind === 'digital') return `<svg viewBox="0 0 600 600" aria-hidden="true"><g class="links"><path d="M110 310 C190 210 260 210 300 300"/><path d="M300 300 C360 185 455 190 500 270"/><path d="M300 300 C355 395 430 420 510 390"/><path d="M300 300 C220 400 155 415 90 380"/></g><g class="nodes"><circle cx="110" cy="310" r="10"/><circle cx="300" cy="300" r="18"/><circle cx="500" cy="270" r="10"/><circle cx="510" cy="390" r="10"/><circle cx="90" cy="380" r="10"/></g></svg>`;
    if (kind === 'journey' || kind === 'bridge' || kind === 'funnel' || kind === 'growth') return `<svg viewBox="0 0 700 380" aria-hidden="true"><path class="journey-line" d="M60 220 C160 80 260 310 350 175 C430 55 535 280 640 120"/><circle class="j1" cx="60" cy="220" r="8"/><circle class="j2" cx="205" cy="172" r="8"/><circle class="j3" cx="350" cy="175" r="8"/><circle class="j4" cx="500" cy="175" r="8"/><circle class="j5" cx="640" cy="120" r="8"/></svg>`;
    if (kind === 'shield') return `<svg viewBox="0 0 600 600" aria-hidden="true"><path class="shield" d="M300 70 L485 140 V286 C485 405 405 498 300 545 C195 498 115 405 115 286 V140 Z"/><path class="check" d="M205 305 L272 370 L405 225"/></svg>`;
    if (kind === 'renal') return `<svg viewBox="0 0 600 600" aria-hidden="true"><path class="renal-path" d="M238 145 C150 165 135 285 170 350 C205 415 260 405 278 355 C300 294 273 245 238 145 Z"/><path class="renal-path" d="M362 145 C450 165 465 285 430 350 C395 415 340 405 322 355 C300 294 327 245 362 145 Z"/><path class="renal-line" d="M275 345 C280 420 250 465 220 500 M325 345 C320 420 350 465 380 500"/></svg>`;
    if (kind === 'tiers' || kind === 'tier') return `<div class="cinema-doors"><i></i><i></i><i></i><i></i></div>`;
    if (kind === 'dashboard') return `<div class="cinema-dashboard"><i></i><i></i><i></i><i></i><i></i><span></span></div>`;
    if (kind === 'scan') return `<div class="cinema-scan"><i></i><span></span><span></span><span></span></div>`;
    if (kind === 'noise') return `<div class="cinema-noise-cloud"><i></i><i></i><i></i><i></i><i></i></div>`;
    return `<div class="cinema-aura"></div>`;
  }

  function buildLayer(cfg) {
    const layer = document.createElement('div');
    layer.className = `scene-cinema-layer kind-${cfg.kind} tempo-${cfg.tempo || 'default'}`;
    layer.innerHTML = `<div class="cinema-graphic">${svgFor(cfg.kind)}</div><div class="cinema-labels">${cfg.labels.map((l,i)=>`<span style="--i:${i}">${l}</span>`).join('')}</div><div class="cinema-flare"></div>`;
    return layer;
  }

  function update() {
    const scene = qs('.story-scene');
    if (!scene) return;
    const deck = currentDeck();
    const text = currentSceneText();
    const key = `${deck}|${text}`;
    if (key === lastKey) return;
    lastKey = key;
    document.querySelectorAll('.scene-cinema-layer').forEach(n=>n.remove());
    scene.removeAttribute('data-cinema-tempo');
    const cfg = findConfig(deck,text);
    if (!cfg) return;
    scene.dataset.cinemaTempo = cfg.tempo || 'default';
    const layer = buildLayer(cfg);
    scene.appendChild(layer);
  }

  const obs = new MutationObserver(()=>requestAnimationFrame(update));
  obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(update,400));
})();