
(function(){
const D=[{"n": "All", "full": "All customers", "sub": "5 groups", "since": "", "prod": ["DGBB Cage", "DGBB Shield", "TRB Cage"], "c": ["DE", "SK", "PT", "FR", "IT", "TR", "CN", "VN", "JP", "KR", "US"], "note": "We supply cages and shields to bearing manufacturing sites in Europe, Asia and the Americas. Since our first overseas business with NACHI-FUJIKOSHI, Japan, in 2003, our reach has grown to sites in 11 countries.", "cn": ["Germany", "Slovakia", "Portugal", "France", "Italy", "Türkiye", "China", "Vietnam", "Japan", "South Korea", "United States"]}, {"n": "Schaeffler", "full": "Schaeffler", "sub": "German bearing group", "since": "2011", "prod": ["DGBB Cage", "DGBB Shield", "TRB Cage"], "c": ["DE", "SK", "PT", "CN", "VN", "KR"], "note": "We began supplying DGBB cages and shields to Schaeffler sites in Kysuce, Slovakia; Elfershausen and Schweinfurt, Germany; and Caldas, Portugal in 2011. In 2014, we expanded the relationship to TRB cages for VW DCT applications in China.", "cn": ["Germany", "Slovakia", "Portugal", "China", "Vietnam", "South Korea"]}, {"n": "SKF", "full": "SKF", "sub": "Swedish bearing group", "since": "2012", "prod": ["DGBB Cage"], "c": ["FR", "IT", "US", "CN"], "note": "We began supplying DGBB cages to SKF France in 2012.", "cn": ["France", "Italy", "United States", "China"]}, {"n": "Bearing Art", "full": "Bearing Art", "sub": "Iljin Group", "since": "2012", "prod": ["TRB Cage"], "c": ["KR"], "note": "A bearing manufacturer in the Iljin Group, supplied with TRB cages since 2012.", "cn": ["South Korea"]}, {"n": "NACHI-FUJIKOSHI", "full": "NACHI-FUJIKOSHI", "sub": "Japanese bearing manufacturer", "since": "2003", "prod": ["DGBB Cage"], "c": ["JP"], "note": "Our first overseas customer relationship began with NACHI-FUJIKOSHI in 2003.", "cn": ["Japan"]}, {"n": "ORS", "full": "ORS", "sub": "Turkish bearing manufacturer", "since": "", "prod": [], "c": ["TR"], "note": "We do business with this bearing manufacturer in Türkiye.", "cn": ["Türkiye"]}];
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const map=$('#map'),arcs=$$('.arc',map),pins=$$('.pin',map),home=$('.home',map);
const tiles=$$('#tiles .tile'),tilesBox=$('#tiles'),detail=$('#detail');
const DUR=5200;tilesBox.style.setProperty('--dur',DUR+'ms');
const section=$('.samho-customers-content');
let cur=-1,timer=null,auto=!RM,onScreen=false,pageActive=true,detailTimer=0,barMotion=null;
function show(i){
  if(i===cur)return;cur=i;const x=D[i],all=i===0;
  tiles.forEach((t,k)=>{t.setAttribute('aria-selected',String(k===i));t.tabIndex=k===i?0:-1;});detail.setAttribute('aria-labelledby','customer-tab-'+i);
  arcs.forEach(a=>a.classList.toggle('off',!x.c.includes(a.dataset.c)));
  pins.forEach(p=>{const on=x.c.includes(p.dataset.c);p.classList.toggle('off',!on);p.classList.toggle('on',on&&!all);});
  $('#hudN').classList.add('sw');detail.classList.add('sw');
  clearTimeout(detailTimer);detailTimer=setTimeout(()=>{
    $('#hudK').textContent=all?'ALL CUSTOMERS':(x.since?'SINCE '+x.since:'CUSTOMER');
    $('#hudN').textContent=x.full;
    $('#hudC').innerHTML='<b>'+String(x.c.length).padStart(2,'0')+'</b> '+(all?"countries":x.cn.join(' · '));
    $('#dNote').textContent=x.note;
    $('#dProd').innerHTML=x.prod.length?x.prod.map(p=>'<span class="pd">'+p+'</span>').join(''):'<span class="none">—</span>';
    $('#dCt').innerHTML=x.c.map((k,j)=>'<span class="ct"><b>'+k+'</b>'+x.cn[j]+'</span>').join('');
    $('#hudN').classList.remove('sw');detail.classList.remove('sw');
  },RM?0:180);
  if(matchMedia('(max-width:760px)').matches){const t=tiles[i];tilesBox.scrollTo({left:t.offsetLeft-16,behavior:RM?'auto':'smooth'});}
}
function running(){return auto&&onScreen&&pageActive&&!document.hidden;}
function tick(){clearTimeout(timer);if(!running())return;restartBar();timer=setTimeout(()=>{show((cur+1)%D.length);tick();},DUR);}
function restartBar(){barMotion?.cancel();barMotion=tiles[cur].querySelector('.t-p').animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:DUR,fill:'forwards'});}
function stopAuto(){auto=false;clearTimeout(timer);barMotion?.cancel();tilesBox.classList.remove('auto');}
tiles.forEach((t,i)=>t.addEventListener('click',()=>{stopAuto();show(i);}));
tilesBox.addEventListener('focusin',stopAuto);
tilesBox.addEventListener('pointerdown',stopAuto);
tilesBox.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();stopAuto();const n=(cur+(e.key==='ArrowRight'?1:-1)+D.length)%D.length;show(n);tiles[n].focus();});
pins.forEach(p=>p.addEventListener('click',()=>{const k=D.findIndex((x,i)=>i>0&&x.c.includes(p.dataset.c));if(k>0){stopAuto();show(k);}}));
show(0);
if(!auto)tilesBox.classList.remove('auto');
/* start cycling only while the section is on screen */
function sync(){
 const visible=onScreen&&pageActive&&!document.hidden;
 section.classList.toggle('is-animating',visible);
 if(running())tick();else {clearTimeout(timer);barMotion?.pause();}
}
new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;sync();},{threshold:0}).observe($('.stage'));
document.addEventListener('visibilitychange',sync);
addEventListener('pagehide',()=>{pageActive=false;sync();});
addEventListener('pageshow',()=>{pageActive=true;sync();});
})();
