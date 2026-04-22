// js/hero.js — Hero-specific interactions
(function() {
  // ── CHAR REVEAL — set animation-delay from data-delay attribute ──
  document.querySelectorAll('.char-reveal').forEach(el => {
    const base = 1.8; // preloader finishes ~1.8s after load
    const delay = parseFloat(el.dataset.delay || 0) + base;
    el.style.animationDelay = delay + 's';
  });

  // ── COUNTER ANIMATION ──
  function countUp(el, target, suffix = '', duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start).toLocaleString() + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.counter-num').forEach(el => {
        const t = parseInt(el.dataset.target, 10);
        const s = el.dataset.suffix || '';
        countUp(el, t, s);
      });
      counterIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  const counters = document.querySelector('.hero-counters');
  if (counters) counterIO.observe(counters);

  // ── ROLES TICKER ──
  const ticker = document.getElementById('rolesTicker');
  if (!ticker) return;
  const spans = ticker.querySelectorAll('span');
  let current = 0;

  setInterval(() => {
    spans[current].classList.remove('active');
    current = (current + 1) % (spans.length - 1); // last is duplicate of first
    spans[current].classList.add('active');
    ticker.style.transform = `translateY(-${current * 2.2}rem)`;
  }, 2400);

  // ── HERO NAME GLITCH ON HOVER ──
  document.querySelectorAll('.name-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.querySelectorAll('.char-reveal').forEach(c => {
        c.style.textShadow = '2px 0 rgba(255,60,60,0.4), -2px 0 rgba(60,60,255,0.4), 0 0 40px rgba(255,215,0,0.3)';
        setTimeout(() => { c.style.textShadow = ''; }, 180);
      });
    });
  });
})();
