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
    scene.classList.remove(
      'hierarchy-image','hierarchy-graphic','hierarchy-copy','hierarchy-quiet','hierarchy-premium','hierarchy-clinical',
      'copy-headline','copy-lean','copy-detail','copy-package'
    );

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

    /* Film text modes: narration carries explanation; screen carries only what must be read. */
    if (/PROLOGUE|EPILOGUE|THE QUIET CHANGE|WHAT IF|MEET MMS|YOUR PATH|BEYOND THE CLINIC|THE NOISE|CAREER/.test(chapter)) {
      scene.classList.add('copy-headline');
    } else if (/START WITH UNDERSTANDING|THE ROLE|WHY CLIENTS CARE|WHAT PARTNERS REPRESENT|CLIENT BOOK|GROWTH/.test(chapter)) {
      scene.classList.add('copy-lean');
    } else if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) {
      scene.classList.add('copy-package');
    } else {
      scene.classList.add('copy-detail');
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
    const headlineOnly = scene.classList.contains('copy-headline');
    const lean = scene.classList.contains('copy-lean');
    const packageMode = scene.classList.contains('copy-package');

    stage(chapter, imageFirst ? 650 : 250);
    stage(title, imageFirst ? 1500 : 850);
    stage(lead, imageFirst ? 3000 : 1900);

    if (!headlineOnly && !packageMode) stage(body, quiet ? 4300 : 3300);
    if (!headlineOnly && !lean && !packageMode) stage(beats, graphicFirst ? 3300 : 3800);
    if (!headlineOnly) stage(treatments, graphicFirst ? 3600 : 4400);
    if (packageMode) stage(pack, 3300);
    else stage(pack, 3900);
    if (!headlineOnly || /PROLOGUE|EPILOGUE/.test(chapterUpper)) stage(quote, quiet ? 5700 : 5000);
    stage(cta, packageMode ? 5400 : 6400);

    const introLike = /PROLOGUE|EPILOGUE/.test(chapterUpper);
    scene.classList.toggle('film-title-card', introLike);
  }

  const observer = new MutationObserver(stageScene);
  observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
  window.addEventListener('load', () => setTimeout(stageScene, 350));
})();