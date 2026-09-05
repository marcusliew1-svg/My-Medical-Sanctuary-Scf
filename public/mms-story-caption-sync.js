(() => {
  let timer=null;
  let lastScene='';
  function clear(){if(timer)clearInterval(timer);timer=null;}
  function key(){return `${document.querySelector('.story-count')?.textContent||''}|${document.querySelector('.story-chapter')?.textContent||''}`;}
  function sentences(){
    const root=document.querySelector('.story-copy-wrap');
    if(!root)return[];
    const clone=root.cloneNode(true);
    clone.querySelectorAll('button,.scene-deepdive,.cinema-visual').forEach(el=>el.remove());
    const text=(clone.textContent||'').replace(/\s+/g,' ').trim();
    return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(s=>s.trim()).filter(s=>s.length>8);
  }
  function run(){
    const current=key();
    if(!document.querySelector('.story-scene')){clear();lastScene='';return;}
    if(!current||current===lastScene)return;
    lastScene=current;clear();
    setTimeout(()=>{
      const caption=document.querySelector('.cinema-caption');
      if(!caption)return;
      const parts=sentences();
      if(!parts.length)return;
      let i=0;
      caption.textContent=parts[0];
      caption.classList.add('sentence-mode');
      timer=setInterval(()=>{
        i++;
        if(i>=parts.length){clear();return;}
        caption.classList.remove('caption-pulse');
        void caption.offsetWidth;
        caption.textContent=parts[i];
        caption.classList.add('caption-pulse');
      },3600);
    },1200);
  }
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(run,900));
})();