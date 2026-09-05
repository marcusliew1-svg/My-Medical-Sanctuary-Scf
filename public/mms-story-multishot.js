(() => {
  const shots = [
    ["QUIET CHANGE",[
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["WHAT IF",[
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["MEET MMS",[
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["START WITH UNDERSTANDING",[
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["DISCOVER",[
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["RESTORE",[
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["OPTIMISE",[
      "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["REGENERATE",[
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1581093458791-9d42e3c54b0b?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["RENAL",[
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["ASCEND",[
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["EVOLVE",[
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["ETERNA",[
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["PINNACLE",[
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["CLIENT BOOK",[
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2200&q=88"
    ]],
    ["OPERATING SYSTEM",[
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2200&q=88",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=88"
    ]]
  ];

  let last='';
  function sceneText(){return `${document.querySelector('.story-chapter')?.textContent||''} ${document.querySelector('.story-copy-wrap h1')?.textContent||''}`.toUpperCase();}
  function findSet(text){for(const [needle,arr] of shots) if(text.includes(needle)) return arr; return null;}
  function render(){
    const scene=document.querySelector('.story-scene'); if(!scene) return;
    const text=sceneText(); if(!text||text===last)return; last=text;
    document.querySelectorAll('.multi-shot-sequence').forEach(n=>n.remove());
    const arr=findSet(text); if(!arr)return;
    const wrap=document.createElement('div'); wrap.className='multi-shot-sequence';
    arr.forEach((url,i)=>{const shot=document.createElement('div');shot.className='multi-shot';shot.style.backgroundImage=`url(${url})`;shot.style.setProperty('--shot',String(i));shot.style.setProperty('--count',String(arr.length));wrap.appendChild(shot);});
    scene.prepend(wrap);
  }
  new MutationObserver(()=>requestAnimationFrame(render)).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.addEventListener('load',()=>setTimeout(render,450));
})();