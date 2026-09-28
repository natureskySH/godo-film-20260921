(() => {
  const variants = [
    'hero-clear-local.html', 'hero-clear-dim.html', 'hero-clear-clean.html',
    'hero-white-local.html', 'hero-white-dim.html', 'hero-white-clean.html',
    'hero-local.html', 'hero-dim.html', 'hero-clean.html'
  ];
  const pairs = [['video-v1.html', 'video-v2.html', 'video-v3.html', 'video-v4.html', 'video.html', 'video-v5.html', 'video-v6.html', 'video-v7.html', 'video-v8.html', 'video-v9.html', 'video-v10.html', 'video-v11.html', 'video-v12.html', 'video-v13.html'], ...variants.map(name => [`v1-${name}`, `v2-${name}`, `v3-${name}`, `v4-${name}`, `v5-${name}`, `v6-${name}`, `v7-${name}`, `v8-${name}`, `v9-${name}`, `v10-${name}`, name])];
  const current = location.pathname.split('/').pop();
  const pair = pairs.find(pages => pages.includes(current));
  if (!pair) return;
  const video = document.querySelector('video');
  if (!video) return;
  const sources = ['video-v1.mp4?v=original-v1', 'video.mp4?v=floral-v5-20260922', 'video-v3.mp4?v=v3-20260923', 'video-v4.mp4?v=v4-quality-20260923', 'video-v5-slow.mp4?v=v5-slow60-soft-20260928', 'video-v6-normal.mp4?v=v6-normal-speed-20260928', 'video-v7.mp4?v=v7-native720-20260928', 'video-v8.mp4?v=v8-calm-ending-20260928', 'video-v9.mp4?v=v9-flow-native-20260928', 'video-v10.mp4?v=v10-runway-20260928', 'video-v11.mp4?v=v11-raw-v39-20260929', 'video-v12.mp4?v=v12-full-15s-20260929', 'video-v13.mp4?v=v13-stable-ending-20260929'];
  const posters = ['assets/v1-preview.png', 'assets/preview.png', 'assets/v3-preview.jpg', 'assets/v4-preview.jpg', 'assets/v5-preview.jpg', 'assets/v6-preview.jpg', 'assets/v7-preview.jpg', 'assets/v8-preview.jpg', 'assets/v9-preview.jpg', 'assets/v10-preview.jpg', 'assets/v11-preview.jpg', 'assets/v12-preview.jpg', 'assets/v13-preview.jpg'];
  const initialSource = video.getAttribute('src').split('?')[0];
  let active = sources.findIndex(source => source.split('?')[0] === initialSource);
  if (active < 0) active = sources.length - 1;
  const baseTitle = document.title.replace(/ · V\d+$/, '');
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
