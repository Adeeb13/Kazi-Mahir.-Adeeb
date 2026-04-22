// js/cursor.js
(function() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const dot   = cursor.querySelector('.cursor-dot');
  const ring  = cursor.querySelector('.cursor-ring');

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function tick() {
    // Dot snaps immediately
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    // Ring lags
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    cursor.querySelector('.cursor-aura').style.left = mx + 'px';
    cursor.querySelector('.cursor-aura').style.top  = my + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('a, button, .honour-card, .prog-card, .project-tile, .etag').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

  // Click ripple
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
})();
