/* throttle */
const throttle = (fn, ms) => { let t=0; return (...a) => { const n=Date.now(); if(n-t>=ms){t=n;fn(...a);}};};

/* menu mobile */
const mob = document.getElementById('mob');
const nav = document.getElementById('nav');
let open = false;
const openM  = () => { open=true;  nav.classList.add('open');    mob.classList.add('open');    mob.setAttribute('aria-expanded','true');  document.body.style.overflow='hidden'; };
const closeM = () => { open=false; nav.classList.remove('open'); mob.classList.remove('open'); mob.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
mob.addEventListener('click', () => open ? closeM() : openM());
document.addEventListener('keydown', e => e.key==='Escape' && open && closeM());
document.addEventListener('click', e => open && !e.target.closest('nav') && closeM());
window.addEventListener('resize', () => window.innerWidth>768 && open && closeM());

/* scroll suave */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - document.getElementById('hdr').offsetHeight, behavior:'smooth' });
    closeM();
  });
});

/* header + nav ativo */
const hdr      = document.getElementById('hdr');
const sections = [...document.querySelectorAll('section[id]')];
const links    = [...document.querySelectorAll('.nav-links a')];
const onScroll = throttle(() => {
  const y = window.scrollY, h = hdr.offsetHeight;
  hdr.classList.toggle('scrolled', y > 60);
  let cur = '';
  sections.forEach(s => { if (y >= s.offsetTop - h - 20) cur = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, 80);
window.addEventListener('scroll', onScroll, { passive:true });

/* fade-up */
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((en, i) => {
    if (en.isIntersecting) {
      setTimeout(() => en.target.classList.add('show'), i * 70);
      fadeObs.unobserve(en.target);
    }
  });
}, { threshold:.1, rootMargin:'0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* barras skill */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const b = en.target;
      requestAnimationFrame(() => setTimeout(() => b.style.width = b.dataset.width, 120));
      barObs.unobserve(b);
    }
  });
}, { threshold:.5 });
document.querySelectorAll('.skill-fill').forEach(b => barObs.observe(b));

/* hero card entrada */
setTimeout(() => document.getElementById('hero-card')?.classList.add('show'), 200);

/* ano rodapé */
document.getElementById('yr').textContent = new Date().getFullYear();