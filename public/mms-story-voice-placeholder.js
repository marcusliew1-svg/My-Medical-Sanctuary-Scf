(() => {
  let handled = false;
  function disablePlaceholderVoice(){
    if(handled) return;
    const btn = document.querySelector('.cinema-toolbar [data-action="voice"]');
    if(!btn) return;
    if((btn.textContent || '').toLowerCase().includes('voice on')) btn.click();
    btn.setAttribute('title','Placeholder browser narration disabled until fixed rendered voice is installed');
    handled = true;
  }
  new MutationObserver(disablePlaceholderVoice).observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(disablePlaceholderVoice,500));
})();