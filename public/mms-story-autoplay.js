(() => {
  const MUSIC = "https://heygen-product.s3-accelerate.amazonaws.com/astral_generated_music/0c383469558546baa4391e026c7eb0ac.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3FLD4S3AS7WYJKBK%2F20260905%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260905T063524Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=51152415f9896fb49032cea9fe69ff92b9c1f24c989bba3dad68115d0010d046";
  let playing = true;
  let muted = false;
  let voiceOn = true;
  let captionsOn = true;
  let timer = null;
  let tick = null;
  let sceneStarted = 0;
  let sceneDuration = 14000;
  let lastSceneKey = "";
  let audio = null;
  let ui = null;

  const q = (s) => document.querySelector(s);
  const sceneKey = () => `${q('.story-count')?.textContent || ''}|${q('.story-chapter')?.textContent || ''}`;
  const narrationText = () => {
    const scene = q('.story-scene');
    if (scene?.dataset?.narration) return scene.dataset.narration;
    const root = q('.story-copy-wrap');
    if (!root) return '';
    const copy = root.cloneNode(true);
    copy.querySelectorAll('button').forEach(el => el.remove());
    return (copy.textContent || '').replace(/\s+/g, ' ').trim();
  };
  const durationFor = (text) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasDense = !!q('.treatment-grid, .package-panel');
    const base = Math.round((words / 2.25) * 1000 + 4200);
    return Math.max(12000, Math.min(hasDense ? 36000 : 30000, base));
  };
  const nextButton = () => q('.story-controls button:last-child');
  const prevButton = () => q('.story-controls button:first-child');

  function chooseVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    return voices.find(v => /Daniel|Serena|Samantha|Karen|Aria|Google UK English/i.test(v.name)) || voices.find(v => /^en/i.test(v.lang)) || voices[0];
  }

  function speak(text) {
    if (!voiceOn || muted || !playing || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.88;
    utter.pitch = 0.96;
    utter.volume = 0.9;
    const selected = chooseVoice();
    if (selected) utter.voice = selected;
    window.speechSynthesis.speak(utter);
  }

  function ensureAudio() {
    if (audio) return;
    audio = new Audio(MUSIC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.12;
  }

  function sceneMusicLevel() {
    const raw = q('.story-scene')?.dataset?.musicLevel;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, Math.min(.22, n)) : .12;
  }

  function syncAudio() {
    ensureAudio();
    audio.volume = muted ? 0 : sceneMusicLevel();
    if (playing && !muted) audio.play().catch(() => {});
    else audio.pause();
  }

  function ensureUI() {
    if (ui || !q('.story-scene')) return;
    ui = document.createElement('div');
    ui.className = 'cinema-autoplay-ui';
    ui.innerHTML = `
      <div class="cinema-timeline"><span></span></div>
      <div class="cinema-caption" aria-live="polite"></div>
      <div class="cinema-toolbar">
        <button data-action="prev" aria-label="Previous scene">‹</button>
        <button data-action="play" class="cinema-play" aria-label="Pause story">Ⅱ</button>
        <button data-action="next" aria-label="Next scene">›</button>
        <span class="cinema-divider"></span>
        <button data-action="sound">Sound on</button>
        <button data-action="voice">Voice on</button>
        <button data-action="cc">CC on</button>
        <span class="cinema-auto">AUTO STORY</span>
      </div>`;
    document.body.appendChild(ui);
    ui.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === 'play') { playing = !playing; btn.textContent = playing ? 'Ⅱ' : '▶'; btn.setAttribute('aria-label', playing ? 'Pause story' : 'Play story'); if (playing) startScene(true); else stopTimers(); syncAudio(); }
      if (action === 'sound') { muted = !muted; btn.textContent = muted ? 'Sound off' : 'Sound on'; if (muted && 'speechSynthesis' in window) window.speechSynthesis.cancel(); else if (voiceOn) speak(narrationText()); syncAudio(); }
      if (action === 'voice') { voiceOn = !voiceOn; btn.textContent = voiceOn ? 'Voice on' : 'Voice off'; if (!voiceOn && 'speechSynthesis' in window) window.speechSynthesis.cancel(); else speak(narrationText()); }
      if (action === 'cc') { captionsOn = !captionsOn; btn.textContent = captionsOn ? 'CC on' : 'CC off'; ui.querySelector('.cinema-caption').classList.toggle('hidden', !captionsOn); }
      if (action === 'next') nextButton()?.click();
      if (action === 'prev') prevButton()?.click();
    });
  }

  function stopTimers() {
    if (timer) clearTimeout(timer);
    if (tick) clearInterval(tick);
    timer = tick = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function startScene(resume = false) {
    ensureUI();
    if (!ui || !q('.story-scene')) return;
    stopTimers();
    const text = narrationText();
    sceneDuration = durationFor(text);
    sceneStarted = Date.now();
    const caption = ui.querySelector('.cinema-caption');
    caption.textContent = text;
    caption.classList.toggle('hidden', !captionsOn);
    const bar = ui.querySelector('.cinema-timeline span');
    bar.style.width = resume ? bar.style.width : '0%';
    if (playing) {
      speak(text);
      syncAudio();
      tick = setInterval(() => {
        const elapsed = Date.now() - sceneStarted;
        const pct = Math.min(100, (elapsed / sceneDuration) * 100);
        bar.style.width = `${pct}%`;
      }, 100);
      timer = setTimeout(() => {
        const next = nextButton();
        if (next && !next.disabled) next.click();
        else { playing = false; const p = ui.querySelector('[data-action="play"]'); if (p) p.textContent = '▶'; syncAudio(); }
      }, sceneDuration);
    }
  }

  function checkScene() {
    const current = sceneKey();
    if (!q('.story-scene')) {
      if (ui) { ui.remove(); ui = null; }
      stopTimers();
      if (audio) audio.pause();
      lastSceneKey = '';
      return;
    }
    ensureUI();
    if (current && current !== lastSceneKey) {
      lastSceneKey = current;
      window.setTimeout(() => startScene(false), 80);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!q('.story-scene')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      e.stopImmediatePropagation();
      const p = ui?.querySelector('[data-action="play"]');
      p?.click();
    }
  }, true);

  const observer = new MutationObserver(checkScene);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.addEventListener('load', () => { setTimeout(checkScene, 350); if ('speechSynthesis' in window) window.speechSynthesis.getVoices(); });
})();