(()=>{
const shells=Array.from(document.querySelectorAll('.preview-shell'));
const scale=()=>shells.forEach(shell=>{shell.querySelector('iframe').style.transform='scale('+shell.clientWidth/1440+')';});
if('ResizeObserver' in window){const observer=new ResizeObserver(scale);shells.forEach(shell=>observer.observe(shell));}else window.addEventListener('resize',scale);
const grid=document.querySelector('#designs'),buttons=[document.querySelector('#grid-view'),document.querySelector('#large-view')];
buttons.forEach((button,index)=>button.addEventListener('click',()=>{grid.classList.toggle('large',index===1);buttons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});scale();}));
scale();
})();
