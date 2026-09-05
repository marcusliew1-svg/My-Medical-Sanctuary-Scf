(() => {
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const splitSentences = (text) => (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(s => s.trim()).filter(s => s.length > 8);
  const weight = (sentence) => Math.max(1, sentence.split(/\s+/).filter(Boolean).length);

  function showSentence(caption, text) {
    caption.classList.remove('caption-pulse');
    void caption.offsetWidth;
    caption.textContent = text;
    caption.classList.add('sentence-mode', 'caption-pulse');
  }

  function schedule(text, duration) {
    clear();
    const caption = document.querySelector('.cinema-caption');
    if (!caption) return;
    const parts = splitSentences(text);
    if (!parts.length) return;
    const totalWeight = parts.reduce((sum, s) => sum + weight(s), 0);
    const usable = Math.max(4500, duration || 16000);
    let cursor = 0;
    parts.forEach((sentence, index) => {
      const delay = Math.round(cursor * usable);
      timers.push(setTimeout(() => showSentence(caption, sentence), delay));
      cursor += weight(sentence) / totalWeight;
    });
  }

  window.addEventListener('mms:narration-start', (event) => {
    const detail = event.detail || {};
    schedule(detail.text || '', detail.duration || 16000);
  });

  const observer = new MutationObserver(() => {
    if (!document.querySelector('.story-scene')) clear();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();