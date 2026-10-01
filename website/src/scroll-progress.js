(() => {
  'use strict';
  const bar = document.querySelector('.page-progress');
  if (!bar) return;
  const fill = bar.querySelector('.page-progress-fill');
  let frame = 0, previous = -1, previousPercent = -1;
  function update() {
    frame = 0;
    // Read before writing; transform does not resize the page or trigger layout.
    const page = document.scrollingElement || document.documentElement;
    const range = page.scrollHeight - page.clientHeight;
    const position = page.scrollTop;
    // Clamp iOS rubber-band overscroll, including fractional offsets at the bottom.
    const progress = range > 0 ? (position >= range - 1 ? 1 : Math.max(0, Math.min(1, position / range))) : 0;
    if (progress !== previous) {
      fill.style.transform = `scaleX(${progress})`;
      previous = progress;
    }
    const percent = Math.round(progress * 100);
    if (percent !== previousPercent) {
      bar.setAttribute('aria-valuenow', String(percent));
      previousPercent = percent;
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  addEventListener('load', schedule);
  // Safari browser chrome, screen rotation and the on-screen keyboard.
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
  // Product filters, accordions, fonts and lazy images can change total page length.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    observer.observe(document.body);
  }
  document.addEventListener('load', schedule, true);
  document.fonts?.ready.then(schedule);
  update();
})();
