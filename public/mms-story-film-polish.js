(() => {
  let activeKey = '';
  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const sceneKey = () => `${document.querySelector('.story-count')?.textContent || ''}|${document.querySelector('.story-chapter')?.textContent || ''}`;

  function stage(el, delay) {
    if (!el) return;
    el.classList.add('film-reveal-pending');
    timers.push(setTimeout(() => el.classList.add('film-reveal-live'), delay));
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
    stage(chapter, 250);
    stage(title, 900);
    stage(lead, 2100);
    stage(body, 3500);
    stage(beats, 3900);
    stage(treatments, 4300);
    stage(pack, 4300);
    stage(quote, 5200);
    stage(cta, 6200);

    const introLike = /PROLOGUE|EPILOGUE/.test(chapter?.textContent || '');
    scene.classList.toggle('film-title-card', introLike);
  }

  const observer = new MutationObserver(stageScene);
  observer.observe(document.documentElement, {subtree:true, childList:true, characterData:true});
  window.addEventListener('load', () => setTimeout(stageScene, 350));
})();