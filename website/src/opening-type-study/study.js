(() => {
  'use strict';
  const variants = {{VARIANTS}};
  const all = [{id:'00',name:'현재 버전',fonts:'기존 시스템 고딕'}, ...variants];
  const dialog=document.querySelector('#preview-dialog'), frame=document.querySelector('#preview-frame');
  const device=document.querySelector('#preview-device'), status=document.querySelector('#preview-state');
  let selected='01', mode='hold', ready=false, opener=null;
  function command(action) {
    mode=action;
    frame.contentWindow?.postMessage({type:'samho-type-command',variant:selected,action},location.origin);
    status.textContent=action==='play'?'4.5초 재생 중 · 히어로까지 연결됩니다.':'완성 장면 · '+all.find(v=>v.id===selected).fonts;
  }
  function choose(id) {
    if(!all.some(v=>v.id===id))return;
    selected=id;
    document.querySelector('#preview-number').textContent=id==='00'?'CURRENT VERSION':'TYPE '+id;
    document.querySelector('#preview-title').textContent=all.find(v=>v.id===id).name;
    document.querySelectorAll('[data-switch]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.switch===id)));
  }
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;choose(button.dataset.open);mode=button.dataset.play==='true'?'play':'hold';
    dialog.showModal();document.body.style.overflow='hidden';
    if(ready)requestAnimationFrame(()=>command(mode));
    else status.textContent='서체를 준비하고 있습니다…';
  }));
  document.querySelectorAll('[data-switch]').forEach(button=>button.addEventListener('click',()=>{choose(button.dataset.switch);command('hold');}));
  document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{
    device.classList.toggle('mobile',button.dataset.device==='mobile');
    document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    requestAnimationFrame(()=>command('hold'));
  }));
  document.querySelector('#close-preview').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{command('hold');document.body.style.overflow='';opener?.focus();});
  document.querySelector('#play-preview').addEventListener('click',()=>command('play'));
  document.querySelector('#hold-preview').addEventListener('click',()=>command('hold'));
  addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
    if(event.data?.type==='samho-type-ready'){ready=true;if(dialog.open)command(mode);}
    if(event.data?.type==='samho-type-complete'&&dialog.open){
      status.textContent='재생 완료 · 완성 장면으로 돌아가 비교할 수 있습니다.';
      if(mode==='play')document.querySelector('#play-preview').focus({preventScroll:true});
    }
  });
})();
