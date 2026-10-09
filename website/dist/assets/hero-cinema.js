(() => {
 'use strict';
 const hero=document.querySelector('[data-cinema]');if(!hero)return;
 const slides=[...hero.querySelectorAll('[data-slide]')];
 const period=4000,fade=1000,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,started=false,onScreen=true,heroVisible=false,openingDone=false,request=0;
 let cycleTimer=0,deadline=0,remaining=period,retireTimer=0,warmTimer=0,pageActive=true;
 const motions=new Map(),pending=new Map();
 function ready(i){
  const slide=slides[i],template=slide.querySelector('template');
  if(template){slide.append(template.content.cloneNode(true));template.remove();}
  const image=slide.querySelector('img');
  if(!pending.has(i)){
   // Wait for picture source selection before decoding; an early decode can fetch the fallback too.
   const loaded=image.complete?Promise.resolve(image.naturalWidth>0):new Promise(resolve=>{
    image.addEventListener('load',()=>resolve(true),{once:true});
    image.addEventListener('error',()=>resolve(false),{once:true});
   });
   pending.set(i,loaded.then(ok=>ok?image.decode().then(()=>true):false).catch(()=>image.naturalWidth>0).then(ok=>{if(!ok)pending.delete(i);return ok;}));
  }
  return pending.get(i);
 }
 const initialReady=ready(0);
 function zoom(i,lead=0){
  motions.get(i)?.cancel();if(reduced.matches)return;
  motions.set(i,slides[i].querySelector('img').animate([{transform:'scale(1)'},{transform:`scale(${slides[i].dataset.zoom})`}],{duration:period+fade+lead+200,easing:'linear',fill:'forwards'}));
 }
 function running(){return started&&heroVisible&&!reduced.matches&&onScreen&&pageActive&&!document.hidden;}
 function warmNext(){
  clearTimeout(warmTimer);
  // Prepare one photograph ahead, after the current image has decoded.
  if(onScreen&&pageActive&&!document.hidden&&!reduced.matches)warmTimer=setTimeout(()=>ready((current+1)%slides.length),600);
 }
 function stopClock(){
  if(cycleTimer){remaining=Math.max(0,deadline-performance.now());clearTimeout(cycleTimer);cycleTimer=0;}
 }
 function sync(){
  const run=running();hero.dataset.playing=String(run);
  for(const motion of motions.values())run?motion.play():motion.pause();
  if(!run||!openingDone)stopClock();
  else if(!cycleTimer){deadline=performance.now()+remaining;cycleTimer=setTimeout(()=>{cycleTimer=0;remaining=0;show(current+1);},remaining);}
  if(run)warmNext();else clearTimeout(warmTimer);
 }
 async function show(i){
  i=(i+slides.length)%slides.length;const id=++request;
  if(i===current){sync();return;}
  stopClock();const loaded=await ready(i);if(id!==request)return;
  // Loading in the background must not switch the visible slide on return.
  if(!loaded||!onScreen||!pageActive||document.hidden){remaining=period;sync();return;}
  clearTimeout(retireTimer);const previous=current;current=i;remaining=period;
  for(const [n,motion] of motions){if(n!==previous){motion.cancel();motions.delete(n);}}
  slides.forEach((slide,n)=>{slide.classList.toggle('is-leaving',n===previous);slide.classList.toggle('is-active',n===current);slide.setAttribute('aria-hidden',String(n!==current));});
  hero.dataset.current=String(current+1);zoom(current);
  retireTimer=setTimeout(()=>{slides[previous].classList.remove('is-leaving');motions.get(previous)?.cancel();motions.delete(previous);},reduced.matches?0:fade+100);
  sync();
 }
 async function start(){if(started)return;await initialReady;if(started)return;started=true;hero.dataset.current=String(current+1);zoom(current,openingDone?0:1200);sync();}
 initialReady.then(warmNext);
 // Complete the product button's white fill before a same-tab navigation.
 const productLink=hero.querySelector('.cinema-link.secondary');
 let productNavigating=false,productTimer=0;
 productLink?.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||productLink.target==='_blank')return;
  event.preventDefault();if(productNavigating)return;productNavigating=true;
  productLink.classList.add('is-navigating');productLink.setAttribute('aria-busy','true');
  productTimer=setTimeout(()=>location.assign(productLink.href),reduced.matches?0:400);
 });
 window.addEventListener('pageshow',()=>{
  pageActive=true;clearTimeout(productTimer);productNavigating=false;
  productLink?.classList.remove('is-navigating');productLink?.removeAttribute('aria-busy');sync();
 });
 window.addEventListener('pagehide',()=>{pageActive=false;request++;sync();});
 hero.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));hero.querySelector('[data-next]').addEventListener('click',()=>show(current+1));
 hero.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}});
 new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting&&entries[0].intersectionRatio>.1;sync();},{threshold:.1}).observe(hero);
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{stopClock();for(const motion of motions.values())motion.cancel();motions.clear();zoom(current);remaining=period;sync();});
 const opening=document.querySelector('#logo-opening');
 function openingProgress(){
  openingDone=!opening||opening.dataset.state==='complete';
  if(openingDone||opening.dataset.heroVisible==='true'||Number(opening?.dataset.time)>=4300){heroVisible=true;start();}
  if(openingDone)sync();
 }
 document.addEventListener('samho:opening-visible',openingProgress);
 document.addEventListener('samho:opening-complete',openingProgress);
 openingProgress();
})();
