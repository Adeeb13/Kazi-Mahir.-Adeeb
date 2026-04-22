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
