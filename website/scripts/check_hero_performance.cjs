// Exercise the real carousel with virtual time: no browser/GPU timing assumptions.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/hero-cinema.js'),'utf8');
function harness({openingComplete=true,reduced=false}={}){
 let now=0,next=0,raf=0;const timers=new Map(),listeners=new Map(),docEvents=new Map();
 const media={matches:reduced,addEventListener(_,f){this.change=f;}};
 const opening={dataset:{state:openingComplete?'complete':'forming'}};
 const document={hidden:false,querySelector:s=>s==='[data-cinema]'?hero:opening,addEventListener:(n,f)=>docEvents.set(n,f)};
 const button=()=>({addEventListener(n,f){this[n]=f;}});
 const prev=button(),nextButton=button(),motions=[];
 const slides=Array.from({length:4},(_,n)=>{
  let loaded=n===0;const classes=new Set(n===0?['is-active']:[]);
  const image={complete:true,naturalWidth:2560,decode:()=>Promise.resolve(),animate(){const m={state:'running',play(){this.state='running';},pause(){this.state='paused';},cancel(){this.state='cancelled';}};motions.push(m);return m;}};
  const template={content:{cloneNode:()=>({})},remove(){loaded=true;}};
  return {dataset:{zoom:'1.1'},classList:{toggle(c,v){v?classes.add(c):classes.delete(c);},remove:c=>classes.delete(c)},setAttribute(){},append(){},querySelector:s=>s==='template'?(loaded?null:template):image,get loaded(){return loaded;}};
 });
 const hero={dataset:{},querySelectorAll:()=>slides,querySelector:s=>s==='[data-prev]'?prev:s==='[data-next]'?nextButton:null,addEventListener(){}};
 let intersect;
 const context={document,window:{addEventListener:(n,f)=>listeners.set(n,f)},matchMedia:()=>media,performance:{now:()=>now},Map,Promise,
  setTimeout(f,ms){const id=++next;timers.set(id,{at:now+ms,f});return id;},clearTimeout:id=>timers.delete(id),
  requestAnimationFrame(){raf++;throw Error('Idle carousel should not schedule animation frames');},
  IntersectionObserver:class{constructor(f){intersect=f;}observe(){}},location:{assign(){}}};
 vm.runInNewContext(source,context);
 async function flush(){for(let i=0;i<12;i++)await Promise.resolve();}
 async function advance(ms){const until=now+ms;await flush();for(;;){const due=[...timers].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;timers.delete(due[0]);now=due[1].at;due[1].f();await flush();}now=until;await flush();}
 return {hero,slides,motions,media,opening,advance,flush,prev,next:nextButton,raf:()=>raf,
  visible(v){intersect([{isIntersecting:v,intersectionRatio:v?1:0}]);},hidden(v){document.hidden=v;docEvents.get('visibilitychange')();},event:n=>docEvents.get(n)?.(),page:n=>listeners.get(n)?.()};
}
(async()=>{
 const h=harness();await h.flush();assert.equal(h.hero.dataset.current,'1');assert.equal(h.slides.filter(s=>s.loaded).length,1);
 await h.advance(600);assert.equal(h.slides.filter(s=>s.loaded).length,2,'only next photo preloaded');
 await h.advance(3399);assert.equal(h.hero.dataset.current,'1');await h.advance(1);assert.equal(h.hero.dataset.current,'2','exact 4 second transition');
 await h.advance(1100);assert.equal(h.motions.filter(m=>m.state==='running').length,1,'old layer animation retired');
 h.visible(false);await h.advance(10000);assert.equal(h.hero.dataset.current,'2','offscreen carousel pauses');assert.equal(h.motions.filter(m=>m.state==='running').length,0);
 h.visible(true);await h.advance(2899);assert.equal(h.hero.dataset.current,'2');await h.advance(1);assert.equal(h.hero.dataset.current,'3','resume remaining interval');
 h.hidden(true);await h.advance(10000);assert.equal(h.hero.dataset.current,'3');h.hidden(false);
 h.prev.click();h.next.click();h.prev.click();await h.flush();assert.equal(h.hero.dataset.current,'2','latest rapid arrow selection wins');
 h.page('pagehide');await h.advance(6000);assert.equal(h.hero.dataset.playing,'false');h.page('pageshow');assert.equal(h.hero.dataset.playing,'true');
 assert.equal(h.raf(),0);
 const r=harness({reduced:true});await r.advance(12000);assert.equal(r.hero.dataset.current,'1');assert.equal(r.motions.length,0);r.next.click();await r.flush();assert.equal(r.hero.dataset.current,'2','arrows work with reduced motion');
 const o=harness({openingComplete:false});await o.advance(4300);assert.equal(o.hero.dataset.current,undefined);o.opening.dataset.heroVisible='true';o.event('samho:opening-visible');await o.flush();assert.equal(o.hero.dataset.current,'1');assert.equal(o.hero.dataset.playing,'true','zoom begins during opening reveal');
 await o.advance(1200);o.opening.dataset.state='complete';o.event('samho:opening-complete');await o.advance(3999);assert.equal(o.hero.dataset.current,'1');await o.advance(1);assert.equal(o.hero.dataset.current,'2');
 console.log('Carousel: 4s timing, staged image loading, offscreen/tab pause, rapid arrows, BFCache, reduced motion, opening handoff and zero idle RAF pass.');
})().catch(error=>{console.error(error);process.exitCode=1;});
