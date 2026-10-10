const panel=document.getElementById('toolOptions');
const canvas=document.getElementById('canvas');
const tools=[...document.querySelectorAll('[data-tool]')];
if(panel&&canvas&&tools.length){
  panel.classList.add('hidden');
  const closePanel=()=>panel.classList.add('hidden');
  const addClose=()=>{
    if(panel.classList.contains('hidden')||panel.querySelector('.optionsClose'))return;
    const b=document.createElement('button');
    b.type='button';
    b.className='optionsClose';
    b.setAttribute('aria-label','Закрыть параметры');
    b.innerHTML='<i data-lucide="x"></i>';
    b.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      closePanel();
    });
    panel.prepend(b);
    window.lucide?.createIcons();
  };
  new MutationObserver(addClose).observe(panel,{childList:true});
  let timer=0;
  let pressed=null;
  let startX=0;
  let startY=0;
  let ignoreNextClick=false;

  tools.forEach(b=>{
    b.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      clearTimeout(timer);
      pressed=b;
      startX=e.clientX;
      startY=e.clientY;
      ignoreNextClick=false;
      timer=setTimeout(()=>{
        if(pressed!==b)return;
        ignoreNextClick=true;
        b.click();
        panel.classList.remove('hidden');
        addClose();
      },450);
    });
    b.addEventListener('pointermove',e=>{
      if(pressed!==b)return;
      if(Math.hypot(e.clientX-startX,e.clientY-startY)>10){
        clearTimeout(timer);
        pressed=null;
      }
    });
    const release=()=>{
      clearTimeout(timer);
      pressed=null;
    };
    b.addEventListener('pointerup',release);
    b.addEventListener('pointercancel',release);
    b.addEventListener('pointerleave',release);
    b.addEventListener('click',e=>{
      if(ignoreNextClick&&e.isTrusted){
        ignoreNextClick=false;
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if(e.isTrusted)closePanel();
    },true);
  });

  document.addEventListener('pointerdown',e=>{
    if(panel.classList.contains('hidden'))return;
    if(panel.contains(e.target)||e.target.closest?.('[data-tool]'))return;
    closePanel();
  },true);
  canvas.addEventListener('pointerdown',closePanel,true);
}
