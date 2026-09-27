(()=>{
'use strict';
const dropdowns=Array.from(document.querySelectorAll('.company-dropdown'));
document.addEventListener('click',event=>dropdowns.forEach(d=>{if(!d.contains(event.target))d.open=false;}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')dropdowns.forEach(d=>{if(d.open){d.open=false;d.querySelector('summary').focus();}});});
if(!document.body.classList.contains('inner-page'))return;
const menu=document.querySelector('#menu-dialog'),toggle=document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');document.body.classList.add('modal-open');});
menu.querySelector('[data-close]').addEventListener('click',()=>menu.close());
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.body.classList.remove('modal-open');toggle.focus({preventScroll:true});});
menu.addEventListener('click',e=>{if(e.target!==menu)return;const r=menu.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)menu.close();});
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
})();
