// Decide before first paint so returning home never flashes a white overlay.
(() => {
  'use strict';
  const key = 'samho:opening-seen:v1';
  const navigation = performance.getEntriesByType('navigation')[0];
  const reload = navigation?.type === 'reload';
  let seen = false;
  try {
    seen = sessionStorage.getItem(key) === '1';
  } catch {
    // Storage can be disabled. Keep internal navigation usable in that case.
    try { seen = new URL(document.referrer).origin === location.origin; } catch {}
  }
  const shouldPlay = (!seen || reload) && !location.hash &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.samhoOpening = {
    shouldPlay,
    markSeen() { try { sessionStorage.setItem(key, '1'); } catch {} }
  };
  if (shouldPlay) {
    document.documentElement.classList.add('opening-pending');
    // Fail open if the animation script cannot load.
    setTimeout(() => document.documentElement.classList.remove('opening-pending'), 1500);
  }
})();
