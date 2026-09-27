(() => {
  'use strict';
  const DURATION = 1800;
  const opening = document.querySelector('#opening');
  const site = document.querySelector('#site-preview');
  const metal = opening.querySelector('.opening-metal');
  const light = opening.querySelector('.metal-light');
  const brand = opening.querySelector('.opening-brand');
  const skip = opening.querySelector('.opening-skip');
  const replay = document.querySelector('#opening-replay');
  const inspect = document.querySelector('#opening-inspect');
  const controls = document.querySelector('#opening-controls');
  const slider = document.querySelector('#opening-timeline');
  const time = document.querySelector('#opening-time');
  const status = document.querySelector('#opening-status');
  const review = document.querySelector('.opening-review');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, safety = 0, interacted = false, restoreFocus = false;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x*x*(3-2*x); };
  function cancel() { cancelAnimationFrame(frame); clearTimeout(safety); }
  function reveal() {
    opening.hidden = false;
    site.inert = true;
    document.body.classList.add('opening-active');
  }
  function finish() {
    cancel();
    opening.hidden = true;
    site.inert = false;
    review.inert = false;
    document.body.classList.remove('opening-active', 'opening-playing');
    slider.value = DURATION;
    time.textContent = '1.80초';
    opening.dataset.state = 'complete';
    if (restoreFocus) { replay.focus({preventScroll:true}); restoreFocus = false; }
  }
  function render(ms) {
    slider.value = Math.round(ms);
    time.textContent = `${(ms/1000).toFixed(2)}초`;
    opening.style.opacity = 1 - ease((ms-1470)/330);
    metal.style.opacity = 1 - ease((ms-740)/370);
    metal.style.transform = `scale(${1.035-ease(ms/1100)*.035})`;
    const position = `${108-ease(ms/960)*116}% 50%`;
    light.style.maskPosition = position;
    light.style.webkitMaskPosition = position;
    brand.style.opacity = ease((ms-850)/280);
    brand.style.transform = `translateY(${(1-ease((ms-850)/350))*7}px)`;
    skip.style.color = ms < 910 ? '#fff' : '#536176';
    opening.dataset.state = ms < 850 ? 'metal' : ms < 1470 ? 'logo' : 'exit';
    brand.setAttribute('aria-hidden', String(ms < 850));
  }
  function play(speed = 1) {
    interacted = true;
    cancel();
    reveal();
    restoreFocus = true;
    skip.focus({preventScroll:true});
    document.body.classList.add('opening-playing');
    review.inert = true;
    if (reduced.matches) {
      render(1220);
      safety = setTimeout(finish, 600);
      return;
    }
    render(0);
    const start = performance.now();
    safety = setTimeout(finish, 6000);
    function tick(now) {
      const elapsed = (now-start)*speed;
      if (elapsed >= DURATION) { finish(); return; }
      render(elapsed);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }
  function seek(ms) {
    interacted = true;
    cancel();
    document.body.classList.remove('opening-playing');
    review.inert = false;
    if (ms >= DURATION) { finish(); return; }
    reveal();
    render(ms);
  }
  replay.addEventListener('click', () => play());
  skip.addEventListener('click', () => { restoreFocus = true; finish(); });
  document.querySelector('#opening-slow').addEventListener('click', () => play(.5));
  inspect.addEventListener('click', () => {
    interacted = true;
    const expand = controls.hidden;
    controls.hidden = !expand;
    inspect.setAttribute('aria-expanded', String(expand));
    if (!expand) finish();
  });
  document.querySelectorAll('[data-scene]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
      seek(Number(button.dataset.scene));
    });
  });
  slider.addEventListener('input', () => seek(Number(slider.value)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !opening.hidden) { restoreFocus = true; finish(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && document.body.classList.contains('opening-playing')) finish();
  });
  // Never hide the page while waiting for an asset. Slow or broken assets skip autoplay.
  const assets = Array.from(opening.querySelectorAll('img'));
  const ready = Promise.all(assets.map(img => img.decode()));
  let deadline;
  Promise.race([ready, new Promise((_, reject) => { deadline=setTimeout(() => reject(new Error('asset timeout')), 1500); })])
    .then(() => { if (!interacted && !reduced.matches) play(); })
    .catch(() => { status.textContent='오프닝은 다시 재생 버튼으로 확인할 수 있습니다.'; })
    .finally(() => clearTimeout(deadline));
})();
