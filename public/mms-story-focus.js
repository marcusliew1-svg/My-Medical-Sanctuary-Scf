(() => {
  let treatmentTimer = null;
  let packageTimer = null;
  let lastKey = '';

  function clearAll(){
    if(treatmentTimer) clearInterval(treatmentTimer);
    if(packageTimer) clearInterval(packageTimer);
    treatmentTimer = packageTimer = null;
  }

  function sceneKey(){
    return `${document.querySelector('.story-count')?.textContent||''}|${document.querySelector('.story-chapter')?.textContent||''}`;
  }

  function activateTreatmentFocus(){
    const grid = document.querySelector('.treatment-grid');
    if(!grid) return;
    const cards = [...grid.querySelectorAll('article')];
    if(cards.length < 2) return;
    grid.classList.add('focus-mode');
    let active = 0;
    const show = () => cards.forEach((card,i)=>card.classList.toggle('is-active', i===active));
    show();
    treatmentTimer = setInterval(()=>{ active = (active+1)%cards.length; show(); }, 4200);
  }

  function activatePackageFocus(){
    const panel = document.querySelector('.package-panel');
    if(!panel) return;
    const items = [...panel.querySelectorAll('li')];
    if(items.length < 2) return;
    panel.classList.add('focus-mode');
    let active = 0;
    const show = () => items.forEach((li,i)=>li.classList.toggle('is-active', i===active));
    show();
    packageTimer = setInterval(()=>{ active = (active+1)%items.length; show(); }, 3100);
  }

  function addKeyFact(){
    const scene = document.querySelector('.story-scene');
    if(!scene || scene.querySelector('.scene-keyfact')) return;
    const chapter = document.querySelector('.story-chapter')?.textContent || '';
    const facts = [
      ['DISCOVER','Understand before you intervene.'],
      ['RESTORE','Support is not a substitute for diagnosis.'],
      ['OPTIMISE','Patterns matter more than isolated numbers.'],
      ['REGENERATE','Advanced therapies require stronger evidence and governance.'],
      ['CONTINUITY','Better care is built over time.'],
      ['ASCEND','Start with structure.'],
      ['EVOLVE','Go deeper into optimisation.'],
      ['ETERNA','Build a longer-horizon relationship.'],
      ['PINNACLE','Concierge-level coordination, never clinical shortcuts.'],
      ['ECONOMICS','Value creation first. Commission second.'],
      ['CLIENT BOOK','Trust compounds.'],
      ['RULES','Sales never outruns medicine.']
    ];
    const match = facts.find(([k])=>chapter.includes(k));
    if(!match) return;
    const el = document.createElement('div');
    el.className = 'scene-keyfact';
    el.innerHTML = `<small>KEY IDEA</small><strong>${match[1]}</strong>`;
    scene.appendChild(el);
  }

  function run(){
    if(!document.querySelector('.story-scene')) { clearAll(); lastKey=''; return; }
    const key = sceneKey();
    if(key===lastKey) return;
    lastKey = key;
    clearAll();
    setTimeout(()=>{ activateTreatmentFocus(); activatePackageFocus(); addKeyFact(); }, 700);
  }

  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(run,500));
})();