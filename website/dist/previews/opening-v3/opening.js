(() => {
  'use strict';
  const duration = 5500;
  const $ = selector => document.querySelector(selector);
  const opening = $('#logo-opening'), site = $('#site-preview'), mark = $('.logo-mark');
  const caption = $('.logo-caption'), outlines = $('#logo-outlines'), fill = $('#logo-fill-rect');
  const guide = $('#logo-guide'), korean = caption.querySelector('p'), english = caption.querySelector('span');
  const paths = [...document.querySelectorAll('.logo-contour')];
  const review = $('.logo-review'), replay = $('#logo-replay');
  const session = window.samhoOpening;
  const inspect = $('#logo-inspect'), controls = $('#logo-controls');
  const slider = $('#logo-timeline'), time = $('#logo-time');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
  const dissolve = x => { x = Math.max(0, Math.min(1, x)); return x*x*x*(x*(x*6-15)+10); };
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
    if (!opening.hidden && !review) session?.markSeen();
    opening.hidden = true;
    site.inert = false;
    if (review) review.inert = false;
    current = duration;
    document.body.classList.remove('logo-active','logo-playing');
    site.style.removeProperty('--hero-reveal');
    site.style.removeProperty('--hero-copy-reveal');
    if (slider) slider.value = duration;
    if (time) time.textContent = `${(duration/1000).toFixed(2)}초`;
    opening.dataset.state = 'complete';
    opening.dataset.time = duration;
    document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed','false'));
    document.documentElement.classList.remove('opening-pending');
    if (returnFocus) {
      const target = replay || $('#main');
      if (!replay) target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      returnFocus = false;
    }
  }
  function render(ms) {
    current = ms;
    if (slider) slider.value = Math.round(ms);
    if (time) time.textContent = `${(ms/1000).toFixed(2)}초`;
    const settle = smooth((ms-1000)/1750);
    mark.style.transform = `scale(${initialScale+(1-initialScale)*settle})`;
    paths.forEach((path,index) => {
      const kind = path.dataset.kind;
      const start = kind==='arc' ? 1000+index*100 : kind==='core' ? 1400 : 1650;
      const length = kind==='arc' ? 1050 : kind==='core' ? 950 : 700;
      const progress = smooth((ms-start)/length);
      path.style.strokeDashoffset = 1-progress;
      path.style.opacity = smooth(progress/.025);
    });
    guide.style.opacity = smooth(ms/500)*.14*(1-smooth((ms-1800)/950));
    const filling = smooth((ms-1800)/950);
    fill.setAttribute('y', String(1206-filling*1260));
    fill.setAttribute('height', String(filling*1260));
    outlines.style.opacity = 1-smooth((ms-2600)/150);
    const label = smooth((ms-2750)/400);
    const subtitle = smooth((ms-3050)/450);
    korean.style.opacity = label;
    korean.style.transform = `translateY(${(1-label)*6}px)`;
    english.style.opacity = subtitle;
    english.style.transform = `translateY(${(1-subtitle)*4}px)`;
    caption.setAttribute('aria-hidden',String(ms<2750));
    // Open the bright gallery underneath the white veil over 1.2 seconds.
    // The picture settles first; the white copy card follows without a cut.
    const heroReveal = dissolve((ms-4300)/1200);
    site.style.setProperty('--hero-reveal', String(heroReveal));
    site.style.setProperty('--hero-copy-reveal', String(dissolve((ms-4750)/750)));
    const brandExit = smooth((ms-4850)/450);
    mark.style.opacity = 1-brandExit;
    caption.style.opacity = 1-brandExit;
    opening.style.opacity = 1-heroReveal;
    opening.dataset.state = ms<1000?'intro':ms<2750?'forming':ms<4850?'name':'exit';
    opening.dataset.time = Math.round(ms);
  }
  function play(speed=1) {
    interacted = true;
    cancel(); reveal();
    returnFocus = true;
    opening.focus({preventScroll:true});
    document.body.classList.add('logo-playing');
    if (review) review.inert = true;
    if (reduced.matches) { render(3600); safety=setTimeout(finish,650); return; }
    render(0);
    document.documentElement.classList.remove('opening-pending');
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
    cancel(); if (review) review.inert=false;
    document.body.classList.remove('logo-playing');
    if (ms>=duration) { finish(); return; }
    reveal(); render(ms);
  }
  replay?.addEventListener('click',()=>play());
  $('#logo-slow')?.addEventListener('click',()=>play(.5));
  inspect?.addEventListener('click',()=>{
    interacted=true;
    controls.hidden=!controls.hidden;
    inspect.setAttribute('aria-expanded',String(!controls.hidden));
    if (controls.hidden) finish();
  });
  document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-scene]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    seek(Number(button.dataset.scene));
  }));
  slider?.addEventListener('input',()=>seek(Number(slider.value)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!opening.hidden){returnFocus=true;finish();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&document.body.classList.contains('logo-playing'))finish();});
  addEventListener('pagehide',()=>{if(!opening.hidden){returnFocus=false;finish();}});
  addEventListener('resize',()=>{if(!opening.hidden){measure();render(current);}});
  reduced.addEventListener('change',()=>{if(reduced.matches&&!opening.hidden)finish();});
  // The logo is inline SVG: no asset download or artificial loading delay.
  requestAnimationFrame(()=>{if(!interacted&&!reduced.matches&&(review||session?.shouldPlay))play();else finish();});
})();
