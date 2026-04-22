// js/main.js — Orchestration
(function() {

  // ── PRELOADER ──
  const preloader = document.getElementById('preloader');
  const label = preloader.querySelector('.preloader-label');
  const messages = ['Calibrating…', 'Loading cosmos…', 'Initialising…'];
  let mi = 0;
  const labelTimer = setInterval(() => {
    mi = (mi + 1) % messages.length;
    if (label) label.textContent = messages[mi];
  }, 600);

  window.addEventListener('load', () => {
    clearInterval(labelTimer);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('loading');
      setTimeout(() => preloader.remove(), 900);
    }, 1200);
  });

  // Fallback if load is too slow
  setTimeout(() => {
    preloader.classList.add('done');
    document.body.classList.remove('loading');
  }, 4000);

  // ── PARALLAX HERO ON SCROLL ──
  const heroContent = document.querySelector('.hero-content');
  const energyRings = document.querySelectorAll('.energy-ring');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${s * 0.28}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - s / 550).toString();
    }
    energyRings.forEach((r, i) => {
      r.style.transform = `scale(${1 + s * 0.0002 * (i + 1)})`;
      r.style.opacity   = Math.max(0, 0.9 - s / 400).toString();
    });
  });

  // ── SMOOTH ANCHOR SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── CONSOLE EASTER EGG ──
  const s = [
    ['%c KAZI MAHIR ADEEB ',   'background:#c9a347;color:#04040a;font-size:1.4rem;font-weight:900;padding:0.5rem 1.2rem;'],
    ['%c Ethical AI Architect · Researcher · Builder ', 'color:#c9a347;font-size:0.9rem;'],
    ['%c github.com/Adeeb13 ', 'color:#666;font-size:0.8rem;'],
    ['%c "The floor moves — but I walk anyway." ', 'color:#f0c060;font-style:italic;font-size:0.85rem;'],
  ];
  s.forEach(([msg, css]) => console.log(msg, css));

})();
