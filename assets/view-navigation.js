(() => {
  const variants = [
    'hero-clear-local.html', 'hero-clear-dim.html', 'hero-clear-clean.html',
    'hero-white-local.html', 'hero-white-dim.html', 'hero-white-clean.html',
    'hero-local.html', 'hero-dim.html', 'hero-clean.html'
  ];
  const pairs = [['video-v1.html', 'video-v2.html', 'video-v3.html', 'video.html', 'video-v4.html'], ...variants.map(name => [`v1-${name}`, `v2-${name}`, `v3-${name}`, name])];
  const current = location.pathname.split('/').pop();
  const pair = pairs.find(pages => pages.includes(current));
  if (!pair) return;
  const video = document.querySelector('video');
  if (!video) return;
  const sources = ['video-v1.mp4?v=original-v1', 'video.mp4?v=floral-v5-20260922', 'video-v3.mp4?v=v3-20260923', 'video-v4.mp4?v=v4-quality-20260923'];
  const posters = ['assets/v1-preview.png', 'assets/preview.png', 'assets/v3-preview.jpg', 'assets/v4-preview.jpg'];
  let active = current === pair[0] ? 0 : current === pair[1] ? 1 : current === pair[2] ? 2 : 3;
  const baseTitle = document.title.replace(/ · V[1234]$/, '');
  document.title = `${baseTitle} · V${active + 1}`;
  video.dataset.version = `V${active + 1}`;
  const move = direction => {
    const wasPlaying = !video.paused;
    active = (active + direction + sources.length) % sources.length;
    video.src = sources[active];
    video.poster = posters[active];
    video.dataset.version = `V${active + 1}`;
    video.load();
    document.title = `${baseTitle} · V${active + 1}`;
    if (wasPlaying) video.play().catch(() => {});
  };
  const editing = target => target instanceof Element && Boolean(target.closest('input,textarea,select,[contenteditable="true"],[role="slider"],[role="dialog"],.mobile-links[data-open="true"]'));
  const menuOpen = () => document.querySelector('.mobile-menu[aria-expanded="true"]');
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || editing(event.target) || menuOpen()) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
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
    move(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
