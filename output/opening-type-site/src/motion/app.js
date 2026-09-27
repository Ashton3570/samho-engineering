(() => {
'use strict';
const {Scene,variants}=window.SamhoMotion;
for(const v of variants){
 const card=document.createElement('article');card.className='card';
 card.innerHTML=`<button class="poster-button" data-open="${v.id}" aria-label="${v.id}번 ${v.name} 재생"><div class="poster" data-poster="${v.id}"></div><span class="poster-badge ${v.id==='05'?'light':''}">${v.id} / ${v.group==='A'?'LOGO FORMATION':'NEW DIRECTION'}</span><span class="poster-play" aria-hidden="true">▷</span></button><div class="card-copy"><div class="card-title"><h3>${v.id}. ${v.name}</h3><span class="english">${v.en}</span></div><p>${v.desc}</p><div class="card-footer"><span class="tags">${v.tags}</span><button data-open="${v.id}">4.5초 재생 ↗</button></div></div>`;
 document.getElementById('cards-'+v.group.toLowerCase()).append(card);
 const thumb=new Scene(card.querySelector('.poster'),v.id,'01');thumb.render(v.poster);
}
const dialog=document.querySelector('#viewer'),stage=document.querySelector('#stage'),timeline=document.querySelector('#timeline'),clock=document.querySelector('#clock'),status=document.querySelector('#state'),type=document.querySelector('#type');
const scene=new Scene(stage),switches=document.querySelector('#switches');
let selected='01',time=0,raf=0,playing=false,start=0,opener=null;
for(const v of variants){const b=document.createElement('button');b.textContent=v.id;b.dataset.select=v.id;b.setAttribute('aria-label',v.id+' '+v.name);b.setAttribute('aria-pressed','false');switches.append(b)}
function render(ms){time=Math.max(0,Math.min(4500,ms));scene.render(time);timeline.value=Math.round(time);clock.textContent=(time/1000).toFixed(2)+' / 4.50초';document.querySelector('#pause').disabled=!playing;}
function stop(){cancelAnimationFrame(raf);raf=0;playing=false;document.querySelector('#pause').disabled=true;}
function seek(ms){stop();render(ms);status.textContent=time>=4500?'히어로 연결 완료':'멈춘 장면 · 슬라이더로 비교하세요';}
function play(){stop();playing=true;start=performance.now();render(0);status.textContent='4.5초 재생 중';function tick(now){const ms=now-start;if(ms>=4500){stop();render(4500);status.textContent='재생 완료 · 히어로 연결';return}render(ms);raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick)}
function select(id,autoplay){selected=id;const v=variants.find(v=>v.id===id);scene.set(id,type.value);document.querySelector('#viewer-title').textContent=v.name;document.querySelector('#viewer-id').textContent=id+' / '+(v.group==='A'?'LOGO FORMATION':'NEW DIRECTION');document.querySelector('#scene-description').textContent=v.desc;switches.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===id)));stage.setAttribute('aria-label',id+'번 '+v.name+' 오프닝');autoplay?play():seek(v.poster)}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{opener=b;dialog.showModal();document.body.style.overflow='hidden';select(b.dataset.open,true)}));
switches.addEventListener('click',e=>{const b=e.target.closest('[data-select]');if(b)select(b.dataset.select,true)});
document.querySelector('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{stop();document.body.style.overflow='';opener?.focus()});
document.querySelector('#play').addEventListener('click',play);document.querySelector('#pause').addEventListener('click',()=>{stop();status.textContent='일시정지 · 슬라이더로 비교하세요'});
document.querySelector('#keyframe').addEventListener('click',()=>seek(variants.find(v=>v.id===selected).poster));timeline.addEventListener('input',()=>seek(Number(timeline.value)));
type.addEventListener('change',()=>{scene.type=type.value;seek(3200);status.textContent='서체 완성 장면 · 재생하면 처음부터 확인합니다'});
document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>{stage.classList.toggle('mobile',b.dataset.device==='mobile');document.querySelectorAll('[data-device]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));seek(3200)}));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing){stop();status.textContent='일시정지 · 다시 재생할 수 있습니다'}});
Promise.allSettled([...document.fonts].map(f=>f.load())).then(()=>{if(dialog.open&&!playing)render(time)});
})();
