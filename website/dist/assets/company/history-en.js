
(function(){
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hist=$('#hist'),evs=$$('#tl .ev'),slots=$$('#yr .yd'),dT=$('#dT'),dLoc=$('#dLoc'),dSw=$('#dSw'),dProg=$('#dProg'),dIx=$('#dIx'),yb=$$('#dYrs button');
const ERA_NAME={1:"Foundation & growth",2:"Namdong Industrial Complex, Incheon",3:"Incheon · Yeongju",4:"Site-A & Site-B, Yeongju"};
const ERA_COL={1:'var(--era1)',2:'var(--era2)',3:'var(--era3)',4:'var(--era4)'};
let cur=-1,titleTimer=0;
function roll(year,dir){
  const t=String(year);
  slots.forEach((sl,i)=>{
    if(sl.dataset.d===t[i])return;sl.dataset.d=t[i];
    [...sl.children].filter(c=>c.dataset.gone).forEach(c=>c.remove());
    const old=[...sl.children];
    const n=document.createElement('span');n.textContent=t[i];
    if(RM){old.forEach(o=>o.remove());sl.appendChild(n);return;}
    n.className=dir>0?'in-b':'in-t';sl.appendChild(n);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      n.className='';
      old.forEach(o=>{o.dataset.gone=1;o.className=dir>0?'out-t':'out-b';setTimeout(()=>o.remove(),1100);});
    }));
  });
}
function go(i){
  if(i===cur||i<0)return;const dir=i>cur?1:-1;cur=i;
  const ev=evs[i],y=+ev.dataset.y,era=ev.dataset.era;
  evs.forEach((e,k)=>e.classList.toggle('on',k===i));
  roll(y,dir);$('#yr').classList.toggle('now',ev.dataset.now==='1');
  clearTimeout(titleTimer);dT.classList.add('sw');titleTimer=setTimeout(()=>{dT.textContent=ev.dataset.t;dT.classList.remove('sw');},RM?0:160);
  dLoc.textContent=ev.dataset.loc||ERA_NAME[era];dSw.style.background=ERA_COL[era];
  dProg.style.transform='scaleX('+(i/(evs.length-1))+')';
  dIx.textContent=String(i+1).padStart(2,'0')+' / '+String(evs.length).padStart(2,'0');
  yb.forEach((b,k)=>{b.classList.toggle('on',k===i);if(k===i)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
}
hist.classList.add('js');
/* active = last event whose top has crossed the reading line; one step per event in both directions */
let tick=false,measureNeeded=true,eventTops=[];
function pick(){
  tick=false;
  const offset=window.scrollY;
  if(measureNeeded){
    eventTops=evs.map(event=>event.getBoundingClientRect().top+offset);
    measureNeeded=false;
  }
  const line=offset+innerHeight*.5;let k=0;
  for(let n=0;n<eventTops.length;n++){if(eventTops[n]<=line)k=n;else break;}
  go(k);
}
function schedule(){if(!tick){tick=true;requestAnimationFrame(pick);}}
function resized(){measureNeeded=true;schedule();}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',resized,{passive:true});
addEventListener('pageshow',resized);
document.addEventListener('load',resized,true);
document.fonts?.ready.then(resized);
if('ResizeObserver' in window)new ResizeObserver(resized).observe($('#tl'));
go(0);pick();
yb.forEach(b=>b.addEventListener('click',()=>evs[+b.dataset.i].scrollIntoView({behavior:RM?'auto':'smooth',block:'center'})));
/* Native dialog keeps keyboard focus inside the photo viewer. */
const lbx=$('#lbx'),im=$('#lbxImg'),cap=$('#lbxCap');let from=null;
$('.samho-history-content').addEventListener('click',e=>{const b=e.target.closest('[data-full]');if(!b)return;from=b;im.src=b.dataset.full;im.alt=b.dataset.cap;cap.textContent=b.dataset.cap;lbx.showModal();document.body.classList.add('modal-open');$('#lbxX').focus();});
$('#lbxX').addEventListener('click',()=>lbx.close());
lbx.addEventListener('click',e=>{if(e.target===lbx||e.target===im)lbx.close();});
lbx.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(from)from.focus({preventScroll:true});});
})();