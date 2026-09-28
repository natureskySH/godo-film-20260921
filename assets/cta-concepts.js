(() => {
 const video=document.querySelector('.hero-video');
 if(!video || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let started=false,frame=0;
 const tick=()=>{
  if(started)return;
  if(!video.paused && video.currentTime>=.15){
   started=true;
   document.body.classList.add('cta-active');
   return;
  }
  if(!video.paused)frame=requestAnimationFrame(tick);
 };
 const begin=()=>{cancelAnimationFrame(frame);if(!started)tick()};
 video.addEventListener('playing',begin);
 if(!video.paused)begin();
 addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
})();
