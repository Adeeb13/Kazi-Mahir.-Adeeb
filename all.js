// js/webgl.js — Three.js 3D cosmos
(function() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 400;

  // ── STAR FIELD ──
  const starCount = 4000;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Spherical distribution
    const r = 300 + Math.random() * 900;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Gold or ice-blue
    if (Math.random() < 0.1) {
      colors[i3] = 1.0; colors[i3+1] = 0.85; colors[i3+2] = 0.3; // gold
    } else if (Math.random() < 0.15) {
      colors[i3] = 0.6; colors[i3+1] = 0.8;  colors[i3+2] = 1.0; // ice blue
    } else {
      const b = 0.7 + Math.random() * 0.3;
      colors[i3] = b * 0.9; colors[i3+1] = b * 0.92; colors[i3+2] = b;
    }
    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const starMat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mvp = modelViewMatrix * vec4(position, 1.0);
        vAlpha = smoothstep(0.0, 1.0, (400.0 + mvp.z) / 400.0);
        gl_PointSize = size * (250.0 / -mvp.z);
        gl_Position = projectionMatrix * mvp;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = (1.0 - d * 2.0) * vAlpha;
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── NEBULA CLOUDS ──
  const nebulaGroup = new THREE.Group();
  const nebulaColors = [0xc9a347, 0x4488cc, 0x884488];

  for (let n = 0; n < 3; n++) {
    const nGeo = new THREE.BufferGeometry();
    const nCount = 800;
    const nPos = new Float32Array(nCount * 3);
    const nCol = new Float32Array(nCount * 3);
    const nSz = new Float32Array(nCount);
    const cx = (Math.random() - 0.5) * 600;
    const cy = (Math.random() - 0.5) * 600;
    const cz = (Math.random() - 0.5) * 600 - 200;
    const rgb = [(nebulaColors[n] >> 16 & 0xff) / 255, (nebulaColors[n] >> 8 & 0xff) / 255, (nebulaColors[n] & 0xff) / 255];
    for (let i = 0; i < nCount; i++) {
      const i3 = i * 3;
      nPos[i3]   = cx + (Math.random()-0.5) * 300;
      nPos[i3+1] = cy + (Math.random()-0.5) * 300;
      nPos[i3+2] = cz + (Math.random()-0.5) * 300;
      nCol[i3]   = rgb[0]; nCol[i3+1] = rgb[1]; nCol[i3+2] = rgb[2];
      nSz[i] = Math.random() * 8 + 3;
    }
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
    nGeo.setAttribute('color', new THREE.BufferAttribute(nCol, 3));
    nGeo.setAttribute('size', new THREE.BufferAttribute(nSz, 1));

    const nMat = new THREE.ShaderMaterial({
      vertexShader: starMat.vertexShader,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float alpha = max(0.0, (0.5 - d) * 2.0) * 0.12;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true, vertexColors: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    nebulaGroup.add(new THREE.Points(nGeo, nMat));
  }
  scene.add(nebulaGroup);

  // ── MOUSE PARALLAX ──
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── SCROLL ──
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ── ANIMATE ──
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow rotation
    stars.rotation.y = t * 0.012;
    stars.rotation.x = Math.sin(t * 0.005) * 0.04;
    nebulaGroup.rotation.y = t * 0.008;
    nebulaGroup.rotation.z = t * 0.005;

    // Mouse parallax
    targetX += (mouseX * 0.6 - targetX) * 0.03;
    targetY += (-mouseY * 0.4 - targetY) * 0.03;
    camera.position.x = targetX * 30;
    camera.position.y = targetY * 20;
    camera.position.z = 400 - scrollY * 0.06;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();
// js/particles.js — 2D floating particle canvas
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 60;
  const particles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = rand(0, canvas.width);
      this.y  = init ? rand(0, canvas.height) : canvas.height + 10;
      this.vy = rand(-0.4, -1.2);
      this.vx = rand(-0.15, 0.15);
      this.size = rand(0.8, 2.8);
      this.alpha = rand(0.1, 0.7);
      this.gold = Math.random() < 0.35;
      this.twinkleSpeed = rand(0.008, 0.03);
      this.twinklePhase = rand(0, Math.PI * 2);
    }
    update() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.twinklePhase += this.twinkleSpeed;
      if (this.y < -10) this.reset();
    }
    draw() {
      const tw = (Math.sin(this.twinklePhase) + 1) / 2;
      const a  = this.alpha * (0.4 + tw * 0.6);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      if (this.gold) {
        ctx.fillStyle = `rgba(201,163,71,${a})`;
        if (this.size > 1.8) {
          ctx.shadowColor = `rgba(201,163,71,${a * 0.8})`;
          ctx.shadowBlur = 6;
        }
      } else {
        ctx.fillStyle = `rgba(180,210,240,${a * 0.6})`;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();
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
// js/nav.js
(function() {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('navBurger');
  const menu    = document.getElementById('mobileMenu');
  const mmLinks = document.querySelectorAll('.mm-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Burger
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mmLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => io.observe(s));
})();
// js/reveal.js — Intersection-based reveal with stagger
(function() {
  // Simple reveal-up elements
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = parseFloat(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('visible'), delay * 1000);
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => io.observe(el));

  // Staggered card grids
  const gridObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const cards = e.target.querySelectorAll('.reveal-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 90 + 80);
      });
      gridObserver.unobserve(e.target);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.honours-grid, .prog-grid, .projects-bento').forEach(g => gridObserver.observe(g));
})();
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
