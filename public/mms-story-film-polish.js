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
    scene.classList.remove('hierarchy-image','hierarchy-graphic','hierarchy-copy','hierarchy-quiet','hierarchy-premium','hierarchy-clinical');

    if (/PROLOGUE|EPILOGUE|THE QUIET CHANGE|YOUR PATH|CLIENT BOOK|CAREER/.test(chapter)) {
      scene.classList.add('hierarchy-image');
    }
    if (/DISCOVER|REGENERATE|THE OPERATING SYSTEM|THE PLATFORM|THE ECONOMICS/.test(chapter)) {
      scene.classList.add('hierarchy-graphic');
    }
    if (/START WITH UNDERSTANDING|CONTINUITY|THE RULES/.test(chapter)) {
      scene.classList.add('hierarchy-copy');
    }
    if (/REGENERATE|CONTINUITY|THE RULES|EPILOGUE/.test(chapter)) {
      scene.classList.add('hierarchy-quiet');
    }
    if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) {
      scene.classList.add('hierarchy-premium');
    }
    if (/DISCOVER|RESTORE|OPTIMISE|REGENERATE|CONTINUITY/.test(chapter)) {
      scene.classList.add('hierarchy-clinical');
    }
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
    const quote = scene.querySelector('.story-quote');
    const cta = scene.querySelector('.story-cta');
    const chapterUpper = chapterText(scene);

    applyHierarchy(scene, chapterUpper);

    const imageFirst = scene.classList.contains('hierarchy-image');
    const graphicFirst = scene.classList.contains('hierarchy-graphic');
    const quiet = scene.classList.contains('hierarchy-quiet');

    stage(chapter, imageFirst ? 650 : 250);
    stage(title, imageFirst ? 1500 : 850);
    stage(lead, imageFirst ? 3000 : 1900);
    stage(body, quiet ? 4300 : 3300);
    stage(beats, graphicFirst ? 3300 : 3800);
    stage(treatments, graphicFirst ? 3600 : 4400);
    stage(pack, 3900);
    stage(quote, quiet ? 5700 : 5000);
    stage(cta, 6400);

    const introLike = /PROLOGUE|EPILOGUE/.test(chapterUpper);
    scene.classList.toggle('film-title-card', introLike);
  }

  const observer = new MutationObserver(stageScene);
  observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
  window.addEventListener('load', () => setTimeout(stageScene, 350));
})();