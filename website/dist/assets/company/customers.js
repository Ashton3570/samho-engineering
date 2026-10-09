
(function(){
const D=[{"n": "전체", "full": "전체 고객사", "sub": "5개 그룹", "since": "", "prod": ["DGBB 케이지", "DGBB 실드", "TRB 케이지"], "c": ["DE", "SK", "PT", "FR", "IT", "TR", "CN", "VN", "JP", "KR", "US"], "note": "유럽, 아시아, 미주의 베어링 생산 거점에 케이지와 실드를 공급합니다. 2003년 일본 NACHI-FUJIKOSHI와의 첫 해외 거래 이후 11개국 거점으로 넓어졌습니다.", "cn": ["독일", "슬로바키아", "포르투갈", "프랑스", "이탈리아", "튀르키예", "중국", "베트남", "일본", "한국", "미국"]}, {"n": "Schaeffler", "full": "Schaeffler", "sub": "독일 베어링 그룹", "since": "2011", "prod": ["DGBB 케이지", "DGBB 실드", "TRB 케이지"], "c": ["DE", "SK", "PT", "CN", "VN", "KR"], "note": "2011년 유럽 거점(슬로바키아 키수체, 독일 엘퍼스하우젠·슈바인푸르트, 포르투갈 칼다스)에 DGBB 케이지·실드 공급을 시작했고, 2014년 중국 VW DCT용 TRB 케이지로 거래를 넓혔습니다.", "cn": ["독일", "슬로바키아", "포르투갈", "중국", "베트남", "한국"]}, {"n": "SKF", "full": "SKF", "sub": "스웨덴 베어링 그룹", "since": "2012", "prod": ["DGBB 케이지"], "c": ["FR", "IT", "US", "CN"], "note": "2012년 SKF 프랑스와 DGBB 케이지 거래를 시작했습니다.", "cn": ["프랑스", "이탈리아", "미국", "중국"]}, {"n": "Bearing Art", "full": "Bearing Art", "sub": "일진그룹", "since": "2012", "prod": ["TRB 케이지"], "c": ["KR"], "note": "일진그룹의 베어링 기업으로, 2012년부터 TRB 케이지를 거래하고 있습니다.", "cn": ["한국"]}, {"n": "NACHI-FUJIKOSHI", "full": "NACHI-FUJIKOSHI", "sub": "일본 베어링 기업", "since": "2003", "prod": ["DGBB 케이지"], "c": ["JP"], "note": "2003년 삼호의 첫 해외 거래로 시작한 고객사입니다.", "cn": ["일본"]}, {"n": "ORS", "full": "ORS", "sub": "튀르키예 베어링 기업", "since": "", "prod": [], "c": ["TR"], "note": "튀르키예의 베어링 기업과 거래하고 있습니다.", "cn": ["튀르키예"]}];
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
    $('#hudC').innerHTML='<b>'+String(x.c.length).padStart(2,'0')+'</b> '+(all?'개국 거점':x.cn.join(' · '));
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
