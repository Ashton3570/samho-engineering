(() => {
  'use strict';
  const duration = 3000;
  const $ = selector => document.querySelector(selector);
  const opening = $('#logo-opening'), site = $('#site-preview'), mark = $('.logo-mark');
  const caption = $('.logo-caption'), outlines = $('#logo-outlines'), fill = $('#logo-fill-rect');
  const paths = [...document.querySelectorAll('.logo-contour')];
  const review = $('.logo-review'), skip = $('.logo-skip'), replay = $('#logo-replay');
  const inspect = $('#logo-inspect'), controls = $('#logo-controls');
  const slider = $('#logo-timeline'), time = $('#logo-time'), status = $('#logo-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
  let frame = 0, safety = 0, interacted = false, returnFocus = false, current = duration, initialScale = 2.4;
  function cancel() { cancelAnimationFrame(frame); clearTimeout(safety); }
  function measure() {
    initialScale = Math.max(1, Math.min(innerHeight*.86, innerWidth*1.12)/mark.offsetWidth);
  }
  function reveal() {
    opening.hidden = false;
    site.inert = true;
    document.body.classList.add('logo-active');
    measure();
  }
  function finish() {
    cancel();
    opening.hidden = true;
    site.inert = false;
    review.inert = false;
    current = duration;
    document.body.classList.remove('logo-active','logo-playing');
    slider.value = duration;
    time.textContent = '3.00초';
    opening.dataset.state = 'complete';
    opening.dataset.time = duration;
    document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed','false'));
    if (returnFocus) { replay.focus({preventScroll:true}); returnFocus = false; }
  }
  function render(ms) {
    current = ms;
    slider.value = Math.round(ms);
    time.textContent = `${(ms/1000).toFixed(2)}초`;
    const settle = smooth((ms-220)/1850);
    mark.style.transform = `scale(${initialScale+(1-initialScale)*settle})`;
    paths.forEach((path,index) => {
      const kind = path.dataset.kind;
      const start = kind==='arc' ? index*100 : kind==='core' ? 540 : 810;
      const length = kind==='arc' ? 1080 : kind==='core' ? 790 : 540;
      const progress = smooth((ms-start)/length);
      path.style.strokeDashoffset = 1-progress;
      path.style.opacity = smooth(progress/.025);
    });
    const filling = smooth((ms-1040)/1010);
    fill.setAttribute('y', String(1140-filling*1030));
    fill.setAttribute('height', String(filling*1030));
    outlines.style.opacity = 1-smooth((ms-1880)/220);
    const label = smooth((ms-2010)/330);
    caption.style.opacity = label;
    caption.style.transform = `translateY(${(1-label)*5}px)`;
    caption.setAttribute('aria-hidden',String(ms<2010));
    opening.style.opacity = 1-smooth((ms-2600)/400);
    opening.dataset.state = ms<1040?'outline':ms<2100?'fill':ms<2600?'settled':'exit';
    opening.dataset.time = Math.round(ms);
  }
  function play(speed=1) {
    interacted = true;
    cancel(); reveal();
    returnFocus = true;
    skip.focus({preventScroll:true});
    document.body.classList.add('logo-playing');
    review.inert = true;
    if (reduced.matches) { render(2400); safety=setTimeout(finish,650); return; }
    render(0);
    const started = performance.now();
    safety = setTimeout(finish,duration/speed+1200);
    function tick(now) {
      const ms = (now-started)*speed;
      if (ms>=duration) { finish(); return; }
      render(ms);
      frame = requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  function seek(ms) {
    interacted = true;
    cancel(); review.inert=false;
    document.body.classList.remove('logo-playing');
    if (ms>=duration) { finish(); return; }
    reveal(); render(ms);
  }
  replay.addEventListener('click',()=>play());
  $('#logo-slow').addEventListener('click',()=>play(.5));
  skip.addEventListener('click',()=>{returnFocus=true;finish();});
  inspect.addEventListener('click',()=>{
    interacted=true;
    controls.hidden=!controls.hidden;
    inspect.setAttribute('aria-expanded',String(!controls.hidden));
    if (controls.hidden) finish();
  });
  document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    seek(Number(button.dataset.scene));
  }));
  slider.addEventListener('input',()=>seek(Number(slider.value)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!opening.hidden){returnFocus=true;finish();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&document.body.classList.contains('logo-playing'))finish();});
  addEventListener('resize',()=>{if(!opening.hidden){measure();render(current);}});
  reduced.addEventListener('change',()=>{if(reduced.matches&&!opening.hidden)finish();});
  // Loading never blocks the site; use the exact supplied raster for the final mark.
  const image = new Image();
  image.src = $('#logo-original').getAttribute('href');
  let deadline;
  Promise.race([image.decode(),new Promise((_,reject)=>{deadline=setTimeout(()=>reject(new Error('asset timeout')),1500);})])
    .then(()=>{if(!interacted&&!reduced.matches)play();})
    .catch(()=>{status.textContent='오프닝은 다시 재생 버튼으로 확인할 수 있습니다.';})
    .finally(()=>clearTimeout(deadline));
})();
