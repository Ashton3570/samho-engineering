(() => {
 'use strict';
 const hero=document.querySelector('[data-cinema]');if(!hero)return;
 const slides=[...hero.querySelectorAll('[data-slide]')],dots=[...hero.querySelectorAll('.cinema-dot')];
 const pause=hero.querySelector('[data-pause]'),caption=hero.querySelector('.cinema-caption');
 const period=4000,fade=1000,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,elapsed=0,last=0,frame=0,started=false,userPaused=false,onScreen=true,heroVisible=false,openingDone=false,request=0,retireTimer=0,loading=false;
 const motions=new Map();
 const ready=i=>slides[i].querySelector('img').decode().catch(()=>{});
 const initialReady=ready(0); // Decode while the logo opening is still playing.
 function zoom(i,lead=0){
  motions.get(i)?.cancel();if(reduced.matches)return;
  const m=slides[i].querySelector('img').animate([{transform:'scale(1)'},{transform:`scale(${slides[i].dataset.zoom})`}],{duration:period+fade+lead+200,easing:'linear',fill:'forwards'});
  motions.set(i,m);
 }
 function running(){return started&&heroVisible&&!userPaused&&!reduced.matches&&onScreen&&!document.hidden;}
 function sync(){
  const run=running();hero.dataset.playing=String(run);
  for(const m of motions.values())run?m.play():m.pause();
  cancelAnimationFrame(frame);last=0;if(run)frame=requestAnimationFrame(tick);
 }
 async function show(i){
  i=(i+slides.length)%slides.length;const id=++request;
  if(i===current){loading=false;return;}
  loading=true;await ready(i);if(id!==request)return;loading=false;
  if(!slides[i].querySelector('img').naturalWidth){elapsed=0;return;}
  clearTimeout(retireTimer);const previous=current;current=i;elapsed=0;last=0;
  for(const [n,m] of motions){if(n!==previous){m.cancel();motions.delete(n);}}
  slides.forEach((s,n)=>{s.classList.toggle('is-leaving',n===previous);s.classList.toggle('is-active',n===current);s.setAttribute('aria-hidden',String(n!==current));});
  dots.forEach((d,n)=>{d.setAttribute('aria-pressed',String(n===current));d.querySelector('.dot-track>span').style.transform='scaleX(0)';});
  caption.textContent=slides[current].dataset.name;hero.dataset.current=String(current+1);zoom(current);
  retireTimer=setTimeout(()=>{slides[previous].classList.remove('is-leaving');motions.get(previous)?.cancel();motions.delete(previous);},reduced.matches?0:fade+100);
  sync();
 }
 function tick(now){
  if(!running())return;
  if(last&&openingDone)elapsed+=Math.min(now-last,100);last=now;
  dots[current].querySelector('.dot-track>span').style.transform=`scaleX(${Math.min(elapsed/period,1)})`;
  if(elapsed>=period&&!loading)show(current+1);
  frame=requestAnimationFrame(tick);
 }
 async function start(){if(started)return;await initialReady;if(started)return;started=true;hero.dataset.current=String(current+1);zoom(current,openingDone?0:1200);sync();}
 dots.forEach((d,i)=>d.addEventListener('click',()=>show(i)));
 hero.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));hero.querySelector('[data-next]').addEventListener('click',()=>show(current+1));
 pause.addEventListener('click',()=>{userPaused=!userPaused;pause.setAttribute('aria-pressed',String(userPaused));pause.setAttribute('aria-label',userPaused?'사진 자동 전환 재생':'사진 자동 전환 일시정지');pause.innerHTML=`<span aria-hidden="true">${userPaused?'▶':'Ⅱ'}</span>`;sync();});
 hero.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
 new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;sync();},{threshold:.15}).observe(hero);
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{for(const m of motions.values())m.cancel();motions.clear();zoom(current);elapsed=0;pause.hidden=reduced.matches;sync();});pause.hidden=reduced.matches;
 const opening=document.querySelector('#logo-opening');
 function openingProgress(){
  openingDone=!opening||opening.dataset.state==='complete';
  // The photo is already visible during the final 1.2s of the opening.
  if(openingDone||Number(opening?.dataset.time)>=3300){heroVisible=true;start();}
  if(openingDone){watch.disconnect();sync();}
 }
 const watch=new MutationObserver(openingProgress);
 if(opening&&opening.dataset.state!=='complete')watch.observe(opening,{attributes:true,attributeFilter:['data-state','data-time']});
 openingProgress();
})();
