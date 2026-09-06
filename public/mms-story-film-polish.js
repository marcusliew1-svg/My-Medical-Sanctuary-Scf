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
      'copy-headline','copy-lean','copy-detail','copy-package',
      'scene-emotional','scene-hybrid','scene-information'
    );

    // Three deliberately different presentation modes.
    // Emotional = cinematic brand-film scenes with restrained copy.
    if (/PROLOGUE|EPILOGUE|THE QUIET CHANGE|WHAT IF/.test(chapter)) {
      scene.classList.add('scene-emotional','hierarchy-image','copy-headline');
    }
    // Information-forward = the deck behaves like a premium explanatory presentation.
    else if (/YOUR PATH|ASCEND|EVOLVE|ETERNA|PINNACLE|THE MEMBERSHIP PATH|THE ECONOMICS|THE CLIENT BOOK|THE OPERATING SYSTEM|THE RULES|CAREER/.test(chapter)) {
      scene.classList.add('scene-information','hierarchy-graphic');
      if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) scene.classList.add('hierarchy-premium','copy-package');
      else scene.classList.add('copy-detail');
    }
    // Hybrid = cinematic medical storytelling plus immediate, readable substance.
    else {
      scene.classList.add('scene-hybrid','copy-detail');
      if (/DISCOVER|REGENERATE|THE PLATFORM/.test(chapter)) scene.classList.add('hierarchy-graphic');
      else if (/START WITH UNDERSTANDING|CONTINUITY|WHY CLIENTS CARE|WHAT YOU REPRESENT|THE ROLE|WHO WINS/.test(chapter)) scene.classList.add('hierarchy-copy');
      else scene.classList.add('hierarchy-image');
    }

    if (/REGENERATE|CONTINUITY|THE RULES|EPILOGUE/.test(chapter)) scene.classList.add('hierarchy-quiet');
    if (/DISCOVER|RESTORE|OPTIMISE|REGENERATE|CONTINUITY/.test(chapter)) scene.classList.add('hierarchy-clinical');
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
    const emotional = scene.classList.contains('scene-emotional');
    const information = scene.classList.contains('scene-information');
    const quiet = scene.classList.contains('hierarchy-quiet');

    if (emotional) {
      stage(chapter, 420); stage(title, 900); stage(lead, 1550); stage(body, 2250); stage(quote, 3000); stage(cta, 3800);
    } else if (information) {
      // Information is available early; viewers should not wait through a long cinematic reveal.
      stage(chapter, 150); stage(title, 320); stage(lead, 560); stage(reading, 760); stage(pack, 820); stage(treatments, 900); stage(beats, 980); stage(body, 1100); stage(quote, 1350); stage(cta, 1600);
    } else {
      stage(chapter, 180); stage(title, 460); stage(lead, 820); stage(reading, 1150); stage(treatments, 1300); stage(beats, 1450); stage(body, 1580); stage(pack, 1700); stage(quote, quiet ? 2200 : 1950); stage(cta, 2450);
    }

    scene.classList.toggle('film-title-card', /PROLOGUE|EPILOGUE/.test(chapterUpper));
  }

  const observer = new MutationObserver(()=>requestAnimationFrame(stageScene));
  observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
  window.addEventListener('load', () => setTimeout(stageScene, 350));
})();