(() => {
  const variants = [
    'hero-clear-local.html', 'hero-clear-dim.html', 'hero-clear-clean.html',
    'hero-white-local.html', 'hero-white-dim.html', 'hero-white-clean.html',
    'hero-local.html', 'hero-dim.html', 'hero-clean.html'
  ];
  const pairs = [['video-v1.html', 'video.html'], ...variants.map(name => [`v1-${name}`, name])];
  const current = location.pathname.split('/').pop();
  const pair = pairs.find(pages => pages.includes(current));
  if (!pair) return;
  const counterpart = pair.find(page => page !== current);
  let navigating = false;
  const move = () => {
    if (navigating) return;
    navigating = true;
    location.assign(counterpart);
  };
  const editing = target => target instanceof Element && Boolean(target.closest('input,textarea,select,[contenteditable="true"],[role="slider"],[role="dialog"],.mobile-links[data-open="true"]'));
  const menuOpen = () => document.querySelector('.mobile-menu[aria-expanded="true"]');
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || editing(event.target) || menuOpen()) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move();
  });
  // Let vertical scrolling and pinch zoom keep their native behavior.
  document.documentElement.style.touchAction = 'pan-y pinch-zoom';
  let gesture = null;
  document.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { gesture = null; return; }
    if (event.button !== 0 || editing(event.target) || menuOpen()) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp };
  }, { passive: true });
  document.addEventListener('pointercancel', () => { gesture = null; }, { passive: true });
  document.addEventListener('pointerup', event => {
    const start = gesture;
    gesture = null;
    if (!start || start.id !== event.pointerId || menuOpen()) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.5 || event.timeStamp - start.time > 1500) return;
    move();
  }, { passive: true });
})();
