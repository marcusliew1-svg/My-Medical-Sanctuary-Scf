(() => {
  let activeKey = '';
  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const sceneKey = () => `${document.querySelector('.story-count')?.textContent || ''}|${document.querySelector('.story-chapter')?.textContent || ''}`;
  const chapterText = (scene) => (scene.querySelector('.story-chapter')?.textContent || '').toUpperCase();

  function stage(el, delay) {
    if (!el) return;
    el.classList.add('film-reveal-pending');
    timers.push(setTimeout(() => el.classList.add('film-reveal-live'), delay));
  }

  function applyHierarchy(scene, chapter) {
    scene.classList.remove('hierarchy-image','hierarchy-graphic','hierarchy-copy','hierarchy-quiet','hierarchy-premium','hierarchy-clinical','copy-headline','copy-lean','copy-detail','copy-package');
    if (/PROLOGUE|EPILOGUE|THE QUIET CHANGE|YOUR PATH|CLIENT BOOK|CAREER/.test(chapter)) scene.classList.add('hierarchy-image');
    if (/DISCOVER|REGENERATE|THE OPERATING SYSTEM|THE PLATFORM|THE ECONOMICS/.test(chapter)) scene.classList.add('hierarchy-graphic');
    if (/START WITH UNDERSTANDING|CONTINUITY|THE RULES/.test(chapter)) scene.classList.add('hierarchy-copy');
    if (/REGENERATE|CONTINUITY|THE RULES|EPILOGUE/.test(chapter)) scene.classList.add('hierarchy-quiet');
    if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) scene.classList.add('hierarchy-premium');
    if (/DISCOVER|RESTORE|OPTIMISE|REGENERATE|CONTINUITY/.test(chapter)) scene.classList.add('hierarchy-clinical');

    if (/PROLOGUE|EPILOGUE|THE QUIET CHANGE|WHAT IF|MEET MMS|YOUR PATH|BEYOND THE CLINIC|THE NOISE|CAREER/.test(chapter)) scene.classList.add('copy-headline');
    else if (/START WITH UNDERSTANDING|THE ROLE|WHY CLIENTS CARE|WHAT YOU REPRESENT|CLIENT BOOK|WHO WINS|GROWTH/.test(chapter)) scene.classList.add('copy-lean');
    else if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) scene.classList.add('copy-package');
    else scene.classList.add('copy-detail');
  }

  function stageScene() {
    const scene = document.querySelector('.story-scene');
    if (!scene) return;
    const key = sceneKey();
    if (!key || key === activeKey) return;
    activeKey = key;
    clearTimers();
    scene.querySelectorAll('.film-reveal-pending,.film-reveal-live').forEach(el => el.classList.remove('film-reveal-pending','film-reveal-live'));

    const chapter = scene.querySelector('.story-chapter');
    const title = scene.querySelector('.story-copy-wrap h1');
    const lead = scene.querySelector('.story-lead');
    const body = scene.querySelector('.story-body');
    const beats = scene.querySelector('.story-beats');
    const treatments = scene.querySelector('.treatment-grid');
    const pack = scene.querySelector('.package-panel');
    const reading = scene.querySelector('.story-reading-panel');
    const quote = scene.querySelector('.story-quote');
    const cta = scene.querySelector('.story-cta');
    const chapterUpper = chapterText(scene);

    applyHierarchy(scene, chapterUpper);
    const imageFirst = scene.classList.contains('hierarchy-image');
    const graphicFirst = scene.classList.contains('hierarchy-graphic');
    const quiet = scene.classList.contains('hierarchy-quiet');

    stage(chapter, imageFirst ? 500 : 220);
    stage(title, imageFirst ? 1150 : 720);
    stage(lead, imageFirst ? 2050 : 1450);
    stage(body, quiet ? 3000 : 2350);
    stage(beats, graphicFirst ? 2450 : 2900);
    stage(treatments, graphicFirst ? 2700 : 3150);
    stage(pack, 2750);
    stage(reading, 3100);
    stage(quote, quiet ? 4100 : 3700);
    stage(cta, 4550);

    scene.classList.toggle('film-title-card', /PROLOGUE|EPILOGUE/.test(chapterUpper));
  }

  const observer = new MutationObserver(()=>requestAnimationFrame(stageScene));
  observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
  window.addEventListener('load', () => setTimeout(stageScene, 350));
})();