const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const events=new Map(),frames=new Map();let counter=0,reads=0,height=3000,resize;
const page={scrollTop:0,clientHeight:800,get scrollHeight(){reads++;return height;}};
const fill={style:{}},bar={querySelector:()=>fill,setAttribute(k,v){this[k]=v;}};
const context={document:{querySelector:()=>bar,scrollingElement:page,documentElement:page,body:{},addEventListener:(n,f)=>events.set(n,f)},window:{ResizeObserver:true},
 addEventListener:(n,f)=>events.set(n,f),requestAnimationFrame(f){const id=++counter;frames.set(id,f);return id;},ResizeObserver:class{constructor(f){resize=f;}observe(){}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/scroll-progress.js'),'utf8'),context);
const flush=()=>{const todo=[...frames.values()];frames.clear();todo.forEach(f=>f());};
assert.equal(reads,1);for(let i=0;i<120;i++){page.scrollTop=i*10;events.get('scroll')();flush();}
assert.equal(reads,1,'scroll does not remeasure full page height each frame');
page.scrollTop=2200;events.get('scroll')();flush();assert.equal(bar['aria-valuenow'],'100');
height=5000;resize();flush();assert.equal(reads,2);assert.equal(bar['aria-valuenow'],'52','lazy content updates scroll range');
page.scrollTop=-100;events.get('scroll')();flush();assert.equal(bar['aria-valuenow'],'0','iOS top overscroll clamped');
page.scrollTop=4500;events.get('scroll')();flush();assert.equal(bar['aria-valuenow'],'100','iOS bottom overscroll clamped');
console.log('Scroll progress: cached height, dynamic content resize and iOS overscroll pass.');
