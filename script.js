// FAQ accordion
function toggleFaq(el){
  const item = el.parentElement;
  const answer = item.querySelector('.faq-a');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>{
    i.classList.remove('open');
    i.querySelector('.faq-a').style.maxHeight = null;
  });
  if(!wasOpen){
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}
window.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.faq-item.open .faq-a').forEach(a=>{
    a.style.maxHeight = a.scrollHeight + 'px';
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

// Network canvas animation in hero (nodes connecting = "Connecting People")
(function(){
  const canvas = document.getElementById('netCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,nodes;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    const count = Math.min(60, Math.floor((w*h)/22000));
    nodes = Array.from({length:count}, ()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35,
      r:Math.random()*1.6+0.8
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      if(!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if(n.x<0||n.x>w) n.vx*=-1;
        if(n.y<0||n.y>h) n.vy*=-1;
      }
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<130){
          ctx.strokeStyle = `rgba(245,129,31,${0.18*(1-dist/130)})`;
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
})();