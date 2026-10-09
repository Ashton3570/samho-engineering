(() => {
 const viewer=document.querySelector('#certificate-viewer');
 if(!viewer)return;
 const image=viewer.querySelector('#document');
 let trigger;
 document.querySelectorAll('[data-cert]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.cert;
  if(!['iatf','iso'].includes(key))return;
  trigger=button;
  const title=key==='iatf'?'IATF 16949:2016':'ISO 14001:2015';
  viewer.querySelector('#viewer-title').textContent=title;
  image.alt=title;
  image.src='/assets/certificates/'+key+'-large.webp';
  viewer.showModal();document.body.classList.add('modal-open');
  viewer.querySelector('.document-scroll').scrollTop=0;
 }));
 viewer.querySelector('.close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
 viewer.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
})();
