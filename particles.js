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
