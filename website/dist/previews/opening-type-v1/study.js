(() => {
  'use strict';
  const variants = [{"id": "01", "name": "정밀한 균형", "english": "Precision", "description": "또렷한 한글과 정돈된 영문. 제조기업의 단단함을 가장 자연스럽게 담았습니다.", "fonts": "Noto Sans KR 600 · Manrope 600", "recommended": true}, {"id": "02", "name": "여유 있는 절제", "english": "Quiet Space", "description": "얇은 획과 넓은 글자 사이. 흰 공간 속에서 이름이 차분하게 드러납니다.", "fonts": "Noto Sans KR 300 · Montserrat 400", "recommended": false}, {"id": "03", "name": "클래식한 신뢰", "english": "Classic Serif", "description": "한글과 영문 모두 명조 계열. 오랜 역사를 가진 브랜드처럼 무게감 있게 표현했습니다.", "fonts": "Noto Serif KR 500 · Cormorant Garamond 500", "recommended": false}, {"id": "04", "name": "현대적인 클래식", "english": "Modern Classic", "description": "담백한 한글에 우아한 영문을 조합했습니다. 정갈함과 고급스러운 인상이 함께 남습니다.", "fonts": "Noto Sans KR 500 · Cormorant Garamond 500", "recommended": true}, {"id": "05", "name": "따뜻한 품격", "english": "Human Touch", "description": "부드러운 바탕체와 짧은 구분선. 기술을 다루는 회사의 따뜻하고 성실한 인상입니다.", "fonts": "Gowun Batang 700 · Manrope 600", "recommended": false}, {"id": "06", "name": "영문 중심의 인상", "english": "Global Presence", "description": "영문 이름의 크기와 존재감을 높였습니다. 한글은 작고 단정하게 받쳐줍니다.", "fonts": "Noto Sans KR 500 · Manrope 500", "recommended": false}];
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
