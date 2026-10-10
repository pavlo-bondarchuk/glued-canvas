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
    b.onclick=closePanel;
    panel.prepend(b);
    window.lucide?.createIcons();
  };
  new MutationObserver(addClose).observe(panel,{childList:true});
  let timer=0;
  let longPress=false;
  tools.forEach(b=>{
    b.addEventListener('pointerdown',()=>{
      longPress=false;
      clearTimeout(timer);
      timer=setTimeout(()=>{
        longPress=true;
        b.click();
        panel.classList.remove('hidden');
        addClose();
      },450);
    });
    ['pointerup','pointercancel','pointerleave'].forEach(type=>b.addEventListener(type,()=>clearTimeout(timer)));
    b.addEventListener('click',()=>{
      if(!longPress)closePanel();
      longPress=false;
    });
  });
  document.addEventListener('pointerdown',e=>{
    if(!panel.contains(e.target)&&!e.target.closest?.('[data-tool]'))closePanel();
  },true);
  canvas.addEventListener('pointerdown',closePanel,true);
}
