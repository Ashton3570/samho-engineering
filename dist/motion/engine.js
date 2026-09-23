(() => {
'use strict';
const paths=["M1008.5297 207.1061 C847.0076 14.6116 578.6352 -49.6766 347.4259 48.7397 C116.2166 147.1561 -23.4884 385.1460 3.2791 635.0000 L277.0000 635.0000 L277.0000 510.0000 L127.2348 510.0000 C152.5328 335.0210 278.2752 191.2348 448.3206 142.8389 C618.3661 94.4430 800.9766 150.4701 914.6203 285.9055 Z", "M861.0000 510.0000 L1138.0973 510.0000 C1167.7495 760.4378 1029.6784 1000.6899 798.3660 1101.1534 C567.0536 1201.6168 297.2323 1138.5201 134.4562 945.9006 L228.2733 866.6190 C342.9494 1002.3199 526.9260 1057.5237 697.3679 1007.3751 C867.8099 957.2265 992.5740 811.1828 1015.4855 635.0000 L861.0000 635.0000 Z", "M354.0000 289.0000 L468.0000 289.0000 L468.0000 520.0000 L683.0000 520.0000 L683.0000 289.0000 L799.0000 289.0000 L799.0000 870.0000 L683.0000 870.0000 L683.0000 635.0000 L468.0000 635.0000 L468.0000 870.0000 L354.0000 870.0000 Z", "M183.3200 767.4600 C183.3200 800.8184 161.8401 830.3830 130.1143 840.6914 C98.3886 850.9997 63.6333 839.7070 44.0257 812.7195 C24.4181 785.7319 24.4181 749.1881 44.0257 722.2005 C63.6333 695.2130 98.3886 683.9203 130.1143 694.2286 C161.8401 704.5370 183.3200 734.1016 183.3200 767.4600 Z", "M1113.0900 378.8200 C1113.0900 412.1784 1091.6101 441.7430 1059.8843 452.0514 C1028.1586 462.3597 993.4033 451.0670 973.7957 424.0795 C954.1881 397.0919 954.1881 360.5481 973.7957 333.5605 C993.4033 306.5730 1028.1586 295.2803 1059.8843 305.5886 C1091.6101 315.8970 1113.0900 345.4616 1113.0900 378.8200 Z"];
const NS='http://www.w3.org/2000/svg', BLUE='#1e2083', PHOTO='../assets/hero/product-collection-blue-v3-1920.webp';
const types={
 '01':{kr:'SansKR',kw:600,ks:32,kt:-1.1,en:'Manrope',ew:600,es:11.5,et:2.5},
 '02':{kr:'SansKR',kw:300,ks:30,kt:2.4,en:'Montserrat',ew:400,es:10.5,et:2.7},
 '03':{kr:'SerifKR',kw:500,ks:32,kt:.48,en:'Cormorant',ew:500,es:18,et:2.5},
 '04':{kr:'SansKR',kw:500,ks:30,kt:1.05,en:'Cormorant',ew:500,es:22,et:1.8},
 '05':{kr:'BatangKR',kw:700,ks:33,kt:.33,en:'Manrope',ew:600,es:10,et:2.2},
 '06':{kr:'SansKR',kw:500,ks:20,kt:2.4,en:'Manrope',ew:500,es:25,et:1.75}
};
const variants=[
{id:'01',group:'A',name:'원호의 만남',en:'ORBIT & ALIGN',desc:'두 원호가 서로 반대 방향으로 회전하고, 중심과 두 점이 제자리에 모여 로고가 됩니다.',tags:'회전 · 정렬 · 여유로운 감속',poster:1550,recommended:true},
{id:'02',group:'A',name:'빛이 남긴 형태',en:'LIGHT SCAN',desc:'가느다란 빛이 왼쪽에서 오른쪽으로 지나가며, 은은한 윤곽을 삼호의 블루로 바꿉니다.',tags:'빛의 이동 · 수평 스캔',poster:1580},
{id:'03',group:'A',name:'중심으로 모이다',en:'CONCENTRIC IMPRESSION',desc:'서로 다른 깊이의 윤곽이 하나로 포개지고, 중심에서 번지는 색이 로고를 완성합니다.',tags:'동심원 · 겹침 · 중심 확산',poster:1700},
{id:'04',group:'A',name:'정확한 결합',en:'PRECISION ASSEMBLY',desc:'로고의 다섯 요소가 각각의 방향에서 이동해 정밀하게 맞물립니다. 가이드 선은 조용히 사라집니다.',tags:'분해와 조립 · 직선 이동',poster:1350},
{id:'05',group:'B',name:'블루 시그니처',en:'BLUE SIGNATURE',desc:'짙은 블루 화면 위에 흰 브랜드가 자리합니다. 두 패널이 열리며 밝은 제품 화면으로 이어집니다.',tags:'블루 전면 · 큰 영문 · 패널 전환',poster:3050},
{id:'06',group:'B',name:'제품의 무대',en:'PRODUCT REVEAL',desc:'실제 선택한 제품 이미지가 세 개의 넓은 창을 통해 드러납니다. 상호명이 사진 위에 단정하게 놓입니다.',tags:'제품 중심 · 사진 연결 · 낮은 전환감',poster:2950,recommended:true},
{id:'07',group:'B',name:'이름의 리듬',en:'TYPOGRAPHIC OVERTURE',desc:'SAMHO 다섯 글자가 간격을 좁히며 하나의 이름으로 정렬됩니다. 작은 심벌과 한글이 뒤를 잇습니다.',tags:'영문 중심 · 편집 디자인 · 수평 리듬',poster:3050},
{id:'08',group:'B',name:'원을 열다',en:'CIRCULAR WINDOW',desc:'밝은 공간에 둥근 제품 사진 창이 열립니다. 원이 화면 밖으로 확장되며 홈페이지의 사진과 연결됩니다.',tags:'원형 사진 · 공간 확장 · 부드러운 연결',poster:2650}
];
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const p=(t,a,b)=>ease((t-a)/(b-a));
const lerp=(a,b,k)=>a+(b-a)*k;
const path=(d,attrs='')=>`<path d="${d}" ${attrs}/>`;
const logo=(color=BLUE)=>`<g fill="${color}">${paths.map(d=>path(d)).join('')}</g>`;
const shape=(cx,cy,d,inner)=>`<g transform="translate(${cx-d/2} ${cy-d/2}) scale(${d/1260}) translate(54 54)">${inner}</g>`;
const exactLogo=(cx,cy,d,color)=>shape(cx,cy,d,logo(color));
const txt=(x,y,str,size,color=BLUE,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${str}</text>`;
function lockup(x,y,k,alpha,type='01',white=false,anchor='middle'){
 const s=types[type],c=white?'#fff':BLUE,e=white?'#d1d7ff':'#67718d';
 return `<g opacity="${alpha}">${txt(x,y,'삼호엔지니어링',s.ks*k,c,`text-anchor="${anchor}" font-family="${s.kr}" font-weight="${s.kw}" letter-spacing="${s.kt*k}"`)}${type==='05'?`<path d="M${x-11*k} ${y+17*k}h${22*k}" stroke="${e}" stroke-width="${k*.6}"/>`:''}${txt(x,y+(type==='05'?49:38)*k,'SAMHO ENGINEERING',s.es*k,e,`text-anchor="${anchor}" font-family="${s.en}" font-weight="${s.ew}" letter-spacing="${s.et*k}"`)}</g>`;
}
let serial=0;
class Scene{
 constructor(host,id='01',type='01'){
  this.host=host;this.id=id;this.type=type;this.uid='motion'+(++serial);this.time=0;
  host.innerHTML=`<div class="hero-preview" aria-hidden="true"><div class="hero-top"><img class="hero-logo" src="../assets/samho-logo-indigo.svg" alt=""><img class="hero-word" src="../assets/samho-wordmark.svg" alt=""><div class="hero-nav"><span>회사소개</span><span>제품소개</span><span>생산·품질</span><span>자료실</span></div></div><img class="hero-photo" src="${PHOTO}" alt=""><div class="hero-text"><small>SAMHO ENGINEERING · SINCE 1979</small><h3>작은 부품 하나에,<br>오랜 기술을<br>담습니다.</h3><p>베어링 부품 전문 제조.<br>TRB·DGBB 케이지, 실드, 레이스웨이</p><span>생산 제품 보기 ↗</span></div></div><svg class="stage-svg" xmlns="${NS}" aria-hidden="true"></svg>`;
  this.svg=host.querySelector('svg');this.hero=host.querySelector('.hero-preview');
  this.observer=new ResizeObserver(()=>this.render(this.time));this.observer.observe(host);
 }
 set(id,type){this.id=id;this.type=type;this.render(0)}
 render(t){
  this.time=clamp(t/4500)*4500;
  const W=1000,box=this.host.getBoundingClientRect();if(!box.width||!box.height)return;
  const H=W*box.height/box.width,mobile=H>850,cx=W/2,cy=H*(mobile?.4:.41),base=Math.min(W*(mobile?.56:.32),H*.48),k=mobile?1.85:Math.min(1.25,H/430);
  const uid=this.uid,ids=n=>uid+'-'+n;
  const reveal=p(t,3500,4500),exit=p(t,3570,4260);
  const photo=(clip='',opacity=1)=>`<image href="${PHOTO}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" opacity="${opacity}" ${clip?`clip-path="url(#${clip})"`:''}/>`;
  let defs='',s='';
  const white=`<rect width="${W}" height="${H}" fill="#fff"/>`;
  if(Number(this.id)<=4){
   s=white;const settle=p(t,550,2750),scale=lerp(1.62,1,settle),d=base*scale;
   let inner='';
   if(this.id==='01'){
    const a=p(t,250,2410),h=p(t,1000,2580),dots=p(t,1260,2750);
    inner=`<g opacity="${p(t,0,300)}" fill="${BLUE}"><g transform="rotate(${(1-a)*-100} 576 576)">${path(paths[0])}</g><g transform="rotate(${(1-a)*100} 576 576)">${path(paths[1])}</g><g opacity="${h}" transform="translate(0 ${(1-h)*160})">${path(paths[2])}</g><g opacity="${dots}" transform="rotate(${(1-dots)*-120} 576 576)">${path(paths[3])+path(paths[4])}</g></g>`;
    const ringO=.15*(1-p(t,1850,2600));s+=`<circle cx="${cx}" cy="${cy}" r="${d*.57}" fill="none" stroke="#969ec6" stroke-width=".7" stroke-dasharray="2 14" opacity="${ringO}"/>`;
   }else if(this.id==='02'){
    const scan=p(t,350,2700),pos=-70+1300*scan;
    defs+=`<clipPath id="${ids('scan')}"><rect x="-54" y="-54" width="${Math.max(0,pos+54)}" height="1260"/></clipPath><linearGradient id="${ids('light')}"><stop stop-color="#768bff" stop-opacity="0"/><stop offset=".8" stop-color="#afbfff" stop-opacity=".48"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    inner=`<g fill="#edf0f8" opacity="${p(t,0,450)*(1-p(t,2350,2750))}">${paths.map(d=>path(d)).join('')}</g><g clip-path="url(#${ids('scan')})">${logo()}</g><g opacity="${p(t,200,500)*(1-p(t,2400,2750))}"><rect x="${pos-130}" y="-130" width="140" height="1420" fill="url(#${ids('light')})"/><path d="M${pos} -50V1206" stroke="#657aff" stroke-width="3"/></g>`;
    s+=`<path d="M${cx-d*.6} ${cy+d*.62}h${d*1.2}" stroke="#e8edf8" stroke-width="1" opacity="${1-p(t,2300,2750)}"/>`;
   }else if(this.id==='03'){
    const converge=p(t,350,2360),fill=p(t,1510,2750);
    defs+=`<clipPath id="${ids('ink')}"><circle cx="576" cy="576" r="${fill*950}"/></clipPath>`;
    [1,2,3].forEach((n)=>{const z=1+(1-converge)*n*.14;inner+=`<g transform="translate(576 576) scale(${z}) translate(-576 -576)" fill="none" stroke="${BLUE}" stroke-width="${3+n}" opacity="${(.19-n*.035)*p(t,0,420)*(1-fill)}">${paths.map(d=>path(d)).join('')}</g>`});
    inner+=`<g fill="none" stroke="${BLUE}" stroke-width="3" opacity="${p(t,150,800)*(1-fill)}">${paths.map(d=>path(d)).join('')}</g><g clip-path="url(#${ids('ink')})">${logo()}</g>`;
    s+=`<circle cx="${cx}" cy="${cy}" r="${d*(.12+fill*.48)}" fill="none" stroke="#9bb6ff" stroke-width=".8" opacity="${.38*(1-fill)}"/>`;
   }else{
    const moves=[[-380,-210],[380,210],[0,300],[-430,180],[430,-180]];
    paths.forEach((dd,i)=>{const a=p(t,250+i*120,2220+i*125);inner+=`<g fill="${BLUE}" opacity="${p(t,i*95,400+i*95)}" transform="translate(${moves[i][0]*(1-a)} ${moves[i][1]*(1-a)})">${path(dd)}</g>`});
    const guide=p(t,0,400)*(1-p(t,2200,2730));s+=`<g stroke="#c9d1e5" stroke-width=".65" fill="none" opacity="${guide}"><path d="M0 ${cy}H1000M500 0V${H}" stroke-dasharray="5 9"/><rect x="${cx-d/2}" y="${cy-d/2}" width="${d}" height="${d}"/><path d="M${cx-d/2-13} ${cy-d/2}h26m-13 -13v26M${cx+d/2-13} ${cy+d/2}h26m-13 -13v26"/></g>`;
   }
   s+=`<g opacity="${1-exit}">${shape(cx,cy,d,inner)}${lockup(cx,cy+base/2+48*k,k,p(t,2750,3100),this.type)}</g>`;
   this.svg.style.opacity=1-reveal;
  }else if(this.id==='05'){
   const open=p(t,3450,4500),sp=mobile?W*.81:W*.62,bY=H*(mobile?.43:.49),f=p(t,450,1880);
   s=`<g><rect x="${-W*.5*open}" width="${W/2+.5}" height="${H}" fill="#222583"/><rect x="${W/2+W*.5*open}" width="${W/2+.5}" height="${H}" fill="#222583"/></g>`;
   defs+=`<clipPath id="${ids('title')}"><rect x="0" y="${bY-sp*.21}" width="1000" height="${sp*.25}"/></clipPath>`;
   s+=`<g opacity="${1-p(t,3200,3820)}"><circle cx="${W*.94}" cy="${H*.18}" r="${Math.min(W*.42,H*.51)}" stroke="#646cc1" stroke-width="${mobile?40:28}" opacity=".18" fill="none"/>${exactLogo(W*.1,H*.15,mobile?95:58,'white')}<g clip-path="url(#${ids('title')})" transform="translate(0 ${(1-f)*sp*.23})" opacity="${f}">${txt(W*.5,bY,'SAMHO',sp*.225,'#fff',`font-family="Manrope" font-weight="650" letter-spacing="${lerp(22,1,f)}" text-anchor="middle"`)}</g><path d="M${W*.5-sp*.37} ${bY+sp*.07}h${sp*.74*p(t,1500,2600)}" stroke="#929ad7" stroke-width="1"/>${lockup(W/2,bY+sp*.18,k*.98,p(t,2400,3050),this.type,true)}</g>`;
   this.svg.style.opacity=1;
  }else if(this.id==='06'){
   const strip=p(t,100,1800),photoO=p(t,50,420),name=p(t,2350,3000);
   defs+=`<clipPath id="${ids('strips')}">${[0,1,2].map(i=>{const a=p(t,150+i*240,1510+i*240);return `<rect x="${i%2?(1-a)*W:0}" y="${i*H/3}" width="${W*a}" height="${H/3+.8}"/>`}).join('')}</clipPath>`;
   s=`<rect width="1000" height="${H}" fill="#dce6f5"/>${photo(ids('strips'),photoO)}<rect width="1000" height="${H}" fill="#10295f" opacity="${.07*strip}"/>`;
   const x=mobile?W*.11:W*.075,y=mobile?H*.62:H*.58,cardW=mobile?W*.78:W*.44,cardH=mobile?Math.min(H*.22,270):H*.31;
   s+=`<g opacity="${name*(1-exit)}" transform="translate(0 ${(1-name)*25})"><rect x="${x-24}" y="${y-35}" width="${cardW}" height="${cardH}" rx="2" fill="#fffffff2"/><path d="M${x-24} ${y-35}v${cardH}" stroke="#1e2083" stroke-width="4"/>${exactLogo(x+(mobile?62:47),y-35+cardH/2,mobile?120:68)}${lockup(x+cardW*.57,y-35+cardH/2-8*k,k*(mobile?.92:.79),1,this.type,false)}</g>`;
   this.svg.style.opacity=1-reveal;
  }else if(this.id==='07'){
   s=white;const bx=W*.11,baseline=H*.46,big=mobile?W*.155:Math.min(W*.15,H*.35),step=big*.86;
   defs+=`<clipPath id="${ids('letters')}"><rect x="0" y="${baseline-big*1.13}" width="1000" height="${big*1.2}"/></clipPath>`;
   let letters=`<text x="${bx}" font-size="${big}" fill="${BLUE}" font-family="Manrope" font-weight="550">`;[...'SAMHO'].forEach((letter,i)=>{const a=p(t,100+i*170,1170+i*210);letters+=`<tspan y="${baseline+(1-a)*big*1.15}" dx="${i?22*(1-a):0}" opacity="${a}">${letter}</tspan>`});letters+='</text>';
   const line=p(t,1500,2540),name=p(t,2550,3100),lx=mobile?W*.5:W*.12;
   s+=`<g opacity="${1-exit}"><g clip-path="url(#${ids('letters')})">${letters}</g><path d="M${bx} ${baseline+big*.23}h${W*.76*line}" stroke="#bac5df" stroke-width=".9"/>${exactLogo(W*.83,H*.2,mobile?92:62)}${lockup(lx,baseline+big*(mobile?.7:.77),k*.93,name,this.type,false,mobile?'middle':'start')}${txt(W*.88,H*.83,'1979 —',mobile?18:13,'#a1a9c0','text-anchor="end" font-family="Manrope" letter-spacing="2"')}</g>`;
   this.svg.style.opacity=1-reveal;
  }else{
   const grow=p(t,150,2350),portalExit=p(t,3400,4500),cx2=mobile?W*.5:W*.66,cy2=mobile?H*.30:H*.48,r=lerp(0,Math.min(W*(mobile?.36:.31),H*(mobile?.30:.4)),grow),rad=lerp(r,Math.hypot(W,H),portalExit);
   defs+=`<clipPath id="${ids('portal')}"><circle cx="${cx2}" cy="${cy2}" r="${rad}"/></clipPath><linearGradient id="${ids('wash')}" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#eaf0ff"/></linearGradient>`;
   s=`<rect width="1000" height="${H}" fill="url(#${ids('wash')})"/>${photo(ids('portal'))}<circle cx="${cx2}" cy="${cy2}" r="${rad+14}" fill="none" stroke="#cdd9f6" stroke-width=".9" opacity="${grow*(1-portalExit)}"/>`;
   const lx=mobile?W*.5:W*.2,ly=mobile?Math.min(H-100,cy2+r+280):H*.51;
   s+=`<g opacity="${p(t,2100,2880)*(1-exit)}">${exactLogo(lx,ly-(mobile?(70+types[this.type].ks*k*.9+30*k):(45+types[this.type].ks*k*.9+22*k)),mobile?140:90)}${lockup(lx,ly,k*.9,1,this.type)}</g>`;
   this.svg.style.opacity=1-p(t,3800,4500);
  }
  this.svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  this.svg.innerHTML=`<defs>${defs}</defs>${s}`;
  this.host.dataset.time=Math.round(t);this.host.dataset.variant=this.id;
  this.hero.style.opacity=Number(this.id)===5?1:reveal;
  this.hero.querySelector('.hero-text').style.opacity=p(t,3850,4480);
 }
}
window.SamhoMotion={Scene,variants};
})();
