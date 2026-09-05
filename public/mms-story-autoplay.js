(() => {
  const MUSIC = "https://heygen-product.s3-accelerate.amazonaws.com/astral_generated_music/0c383469558546baa4391e026c7eb0ac.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3FLD4S3AS7WYJKBK%2F20260905%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260905T063524Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=51152415f9896fb49032cea9fe69ff92b9c1f24c989bba3dad68115d0010d046";
  let playing = true;
  let muted = false;
  let voiceOn = true;
  let captionsOn = true;
  let timer = null, tick = null, narrationTimer = null, musicTimer = null, endRiseTimer = null;
  let sceneStarted = 0, sceneDuration = 14000, lastSceneKey = "", audio = null, ui = null;

  const q = (s) => document.querySelector(s);
  const sceneKey = () => `${q('.story-count')?.textContent || ''}|${q('.story-chapter')?.textContent || ''}`;
  const chapterName = () => (q('.story-chapter')?.textContent || '').toUpperCase();
  const narrationText = () => {
    const scene = q('.story-scene');
    if (scene?.dataset?.narration) return scene.dataset.narration;
    const root = q('.story-copy-wrap'); if (!root) return '';
    const copy = root.cloneNode(true); copy.querySelectorAll('button').forEach(el => el.remove());
    return (copy.textContent || '').replace(/\s+/g, ' ').trim();
  };

  function soundProfile() {
    const chapter = chapterName();
    if (/PROLOGUE/.test(chapter)) return { opening: 2600, ending: 1800, rate: .88, pitch: 1.0, bed: .17, duck: .05, rise: .16, tail: 1500 };
    if (/EPILOGUE/.test(chapter)) return { opening: 2400, ending: 2800, rate: .86, pitch: 1.0, bed: .16, duck: .04, rise: .18, tail: 2300 };
    if (/THE QUIET CHANGE|WHAT IF|YOUR PATH|CLIENT BOOK|CAREER/.test(chapter)) return { opening: 2100, ending: 1700, rate: .9, pitch: 1.0, bed: .14, duck: .045, rise: .135, tail: 1100 };
    if (/REGENERATE|CONTINUITY|THE RULES/.test(chapter)) return { opening: 2200, ending: 2000, rate: .87, pitch: .99, bed: .10, duck: .03, rise: .09, tail: 1400 };
    if (/DISCOVER|START WITH UNDERSTANDING|RESTORE|OPTIMISE/.test(chapter)) return { opening: 1700, ending: 1500, rate: .91, pitch: 1.0, bed: .115, duck: .04, rise: .105, tail: 900 };
    if (/ASCEND|EVOLVE|ETERNA|PINNACLE/.test(chapter)) return { opening: 2200, ending: 2000, rate: .89, pitch: 1.0, bed: .15, duck: .045, rise: .15, tail: 1300 };
    if (/THE NOISE|THE ECONOMICS|THE OPERATING SYSTEM/.test(chapter)) return { opening: 1400, ending: 1200, rate: .94, pitch: 1.0, bed: .13, duck: .045, rise: .12, tail: 700 };
    return { opening: 1750, ending: 1400, rate: .91, pitch: 1.0, bed: .12, duck: .04, rise: .115, tail: 900 };
  }

  const durationFor = (text, profile) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasDense = !!q('.treatment-grid, .package-panel, .story-reading-panel');
    const wordsPerSecond = Math.max(1.65, Math.min(2.15, 1.92 / profile.rate));
    const spoken = Math.round((words / wordsPerSecond) * 1000);
    const readingAllowance = hasDense ? 4500 : 1800;
    return Math.max(15000, Math.min(hasDense ? 47000 : 39000, spoken + profile.opening + profile.ending + readingAllowance));
  };

  const nextButton = () => q('.story-controls button:last-child');
  const prevButton = () => q('.story-controls button:first-child');

  function chooseVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const asianFemaleNames = /Xiaoxiao|Xiaoyi|HsiaoChen|HsiaoYu|Ting[- ]?Ting|Mei[- ]?Jia|Sin[- ]?ji|Yating|Yaoyao|HiuGaai|HiuMaan|WanLung|Xiaohan|Xiaomeng|Xiaomo|Xiaorui|Xiaoshuang|Xiaoxuan|Xiaoyan|Xiaozhen|Google.*(中文|普通话|國語)|Microsoft.*(Xiao|Hsiao|Chinese)/i;
    const asianLocale = /^(zh|cmn)(-|$)/i;
    return voices.find(v => asianFemaleNames.test(v.name))
      || voices.find(v => asianLocale.test(v.lang) && /female|woman|女/i.test(`${v.name} ${v.voiceURI}`))
      || voices.find(v => asianLocale.test(v.lang))
      || voices.find(v => /Samantha|Karen|Serena|Aria|Jenny|Ava|Sonia|Google UK English Female/i.test(v.name))
      || voices.find(v => /^en/i.test(v.lang) && !/male|Daniel|David|Alex/i.test(v.name))
      || voices.find(v => /^en/i.test(v.lang))
      || voices[0];
  }

  function speak(text, profile) {
    if (!voiceOn || muted || !playing || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = profile.rate; utter.pitch = profile.pitch; utter.volume = 0.92;
    const selected = chooseVoice(); if (selected) utter.voice = selected;
    utter.onstart = () => fadeMusic(profile.duck, 650);
    utter.onend = () => fadeMusic(profile.rise, 1200);
    utter.onerror = () => fadeMusic(profile.rise, 800);
    window.speechSynthesis.speak(utter);
  }

  function ensureAudio() { if (audio) return; audio = new Audio(MUSIC); audio.loop = true; audio.preload = 'auto'; audio.volume = 0; }
  function sceneMusicLevel() { const n = Number(q('.story-scene')?.dataset?.musicLevel); return Number.isFinite(n) ? Math.max(0, Math.min(.22, n)) : soundProfile().bed; }
  function fadeMusic(target, duration = 700) {
    ensureAudio(); if (!audio || muted) return; if (musicTimer) clearInterval(musicTimer);
    const start = audio.volume, end = Math.max(0, Math.min(.22, target)), began = performance.now();
    musicTimer = setInterval(() => { const p = Math.min(1,(performance.now()-began)/duration), eased=p*p*(3-2*p); audio.volume=start+(end-start)*eased; if(p>=1){clearInterval(musicTimer);musicTimer=null;} },40);
  }
  function syncAudio() { ensureAudio(); if(muted){audio.volume=0;audio.pause();return;} if(playing){audio.play().catch(()=>{});fadeMusic(sceneMusicLevel(),900);} else {fadeMusic(0,300);setTimeout(()=>{if(!playing)audio.pause();},320);} }

  function ensureUI() {
    if (ui || !q('.story-scene')) return;
    ui = document.createElement('div'); ui.className='cinema-autoplay-ui';
    ui.innerHTML=`<div class="cinema-timeline"><span></span></div><div class="cinema-caption" aria-live="polite"></div><div class="cinema-toolbar"><button data-action="prev" aria-label="Previous scene">‹</button><button data-action="play" class="cinema-play" aria-label="Pause story">Ⅱ</button><button data-action="next" aria-label="Next scene">›</button><span class="cinema-divider"></span><button data-action="sound">Sound on</button><button data-action="voice">Voice on</button><button data-action="cc">CC on</button><span class="cinema-auto">AUTO STORY</span></div>`;
    document.body.appendChild(ui);
    ui.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;const action=btn.dataset.action;
      if(action==='play'){playing=!playing;btn.textContent=playing?'Ⅱ':'▶';btn.setAttribute('aria-label',playing?'Pause story':'Play story');if(playing)startScene(true);else stopTimers();syncAudio();}
      if(action==='sound'){muted=!muted;btn.textContent=muted?'Sound off':'Sound on';if(muted&&'speechSynthesis'in window)window.speechSynthesis.cancel();else if(voiceOn)setTimeout(()=>speak(narrationText(),soundProfile()),250);syncAudio();}
      if(action==='voice'){voiceOn=!voiceOn;btn.textContent=voiceOn?'Voice on':'Voice off';if(!voiceOn&&'speechSynthesis'in window){window.speechSynthesis.cancel();fadeMusic(soundProfile().bed,700);}else setTimeout(()=>speak(narrationText(),soundProfile()),250);}
      if(action==='cc'){captionsOn=!captionsOn;btn.textContent=captionsOn?'CC on':'CC off';ui.querySelector('.cinema-caption').classList.toggle('hidden',!captionsOn);}
      if(action==='next')nextButton()?.click(); if(action==='prev')prevButton()?.click();
    });
  }

  function stopTimers(){if(timer)clearTimeout(timer);if(tick)clearInterval(tick);if(narrationTimer)clearTimeout(narrationTimer);if(endRiseTimer)clearTimeout(endRiseTimer);timer=tick=narrationTimer=endRiseTimer=null;if('speechSynthesis'in window)window.speechSynthesis.cancel();document.body.classList.remove('cinema-visual-hold');}

  function startScene(resume=false){
    ensureUI(); if(!ui||!q('.story-scene'))return; stopTimers(); const text=narrationText(),profile=soundProfile(); sceneDuration=durationFor(text,profile);sceneStarted=Date.now();
    const caption=ui.querySelector('.cinema-caption');caption.textContent='';caption.classList.toggle('hidden',!captionsOn);const bar=ui.querySelector('.cinema-timeline span');bar.style.width=resume?bar.style.width:'0%';document.body.classList.add('cinema-visual-hold');
    if(playing){ensureAudio();if(!muted){audio.play().catch(()=>{});fadeMusic(profile.bed,resume?350:1100);}narrationTimer=setTimeout(()=>{document.body.classList.remove('cinema-visual-hold');if(voiceOn&&!muted)fadeMusic(profile.duck,600);speak(text,profile);window.dispatchEvent(new CustomEvent('mms:narration-start',{detail:{text,duration:Math.max(5000,sceneDuration-profile.opening-profile.ending)}}));},resume?300:profile.opening);
      endRiseTimer=setTimeout(()=>{if(!muted)fadeMusic(profile.rise,1200);},Math.max(profile.opening+1000,sceneDuration-profile.ending-profile.tail));
      tick=setInterval(()=>{const pct=Math.min(100,((Date.now()-sceneStarted)/sceneDuration)*100);bar.style.width=`${pct}%`;},100);
      timer=setTimeout(()=>{const next=nextButton();if(next&&!next.disabled)next.click();else{playing=false;const p=ui.querySelector('[data-action="play"]');if(p)p.textContent='▶';fadeMusic(0,1800);setTimeout(()=>audio?.pause(),1850);}},sceneDuration);
    }
  }

  function checkScene(){const current=sceneKey();if(!q('.story-scene')){if(ui){ui.remove();ui=null;}stopTimers();if(audio)audio.pause();lastSceneKey='';return;}ensureUI();if(current&&current!==lastSceneKey){lastSceneKey=current;window.setTimeout(()=>startScene(false),80);}}
  document.addEventListener('keydown',e=>{if(!q('.story-scene'))return;if(e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();ui?.querySelector('[data-action="play"]')?.click();}},true);
  const observer=new MutationObserver(checkScene);observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>{setTimeout(checkScene,350);if('speechSynthesis'in window){window.speechSynthesis.getVoices();window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();}});
})();