/* =========================================================
   Milky Way Solar System — script.js
   ========================================================= */

'use strict';

// ── Planet Data ────────────────────────────────────────────
const PLANETS = [
  {
    name: 'Mercury',
    emoji: '🪨',
    type: 'Terrestrial',
    color: '#b5b5b5',
    glowColor: 'rgba(181,181,181,0.6)',
    radius: 4,
    orbitRadius: 80,
    speed: 4.74,
    startAngle: 0.3,
    rings: false,
    diameter: '4,879 km',
    distance: '57.9 million km',
    period: '88 Earth days',
    moons: '0',
    temp: '167 °C (avg)',
    desc: 'The smallest planet and closest to the Sun. Its surface is heavily cratered and has extreme temperature swings — from −180 °C at night to 430 °C during the day.',
  },
  {
    name: 'Venus',
    emoji: '🌕',
    type: 'Terrestrial',
    color: '#e8cda0',
    glowColor: 'rgba(232,205,160,0.6)',
    radius: 7,
    orbitRadius: 130,
    speed: 3.50,
    startAngle: 1.2,
    rings: false,
    diameter: '12,104 km',
    distance: '108.2 million km',
    period: '225 Earth days',
    moons: '0',
    temp: '464 °C (avg)',
    desc: 'The hottest planet due to a thick CO₂ atmosphere creating a runaway greenhouse effect. Rotates backwards (retrograde) compared to most planets.',
  },
  {
    name: 'Earth',
    emoji: '🌍',
    type: 'Terrestrial',
    color: '#3a9bd5',
    glowColor: 'rgba(58,155,213,0.6)',
    radius: 7.5,
    orbitRadius: 185,
    speed: 2.98,
    startAngle: 2.5,
    rings: false,
    hasMoon: true,
    diameter: '12,742 km',
    distance: '149.6 million km',
    period: '365.25 Earth days',
    moons: '1 (The Moon)',
    temp: '15 °C (avg)',
    desc: 'Our home — the only known planet harboring life. 71% of its surface is covered in liquid water, and it has a protective magnetic field and ozone layer.',
  },
  {
    name: 'Mars',
    emoji: '🔴',
    type: 'Terrestrial',
    color: '#c1440e',
    glowColor: 'rgba(193,68,14,0.6)',
    radius: 5.5,
    orbitRadius: 245,
    speed: 2.41,
    startAngle: 0.8,
    rings: false,
    diameter: '6,779 km',
    distance: '227.9 million km',
    period: '687 Earth days',
    moons: '2 (Phobos, Deimos)',
    temp: '−60 °C (avg)',
    desc: 'The Red Planet hosts Olympus Mons — the tallest volcano in the solar system (21 km high). Mars has thin atmosphere and evidence of ancient liquid water.',
  },
  {
    name: 'Jupiter',
    emoji: '🟠',
    type: 'Gas Giant',
    color: '#c88b3a',
    glowColor: 'rgba(200,139,58,0.6)',
    radius: 24,
    orbitRadius: 360,
    speed: 1.31,
    startAngle: 1.8,
    rings: true,
    ringColor: 'rgba(200,150,80,0.25)',
    diameter: '139,820 km',
    distance: '778.5 million km',
    period: '11.9 Earth years',
    moons: '95',
    temp: '−110 °C (cloud top)',
    desc: 'The largest planet — so big that 1,300 Earths could fit inside. Its Great Red Spot is a storm larger than Earth that has raged for over 350 years.',
  },
  {
    name: 'Saturn',
    emoji: '🪐',
    type: 'Gas Giant',
    color: '#e4d191',
    glowColor: 'rgba(228,209,145,0.6)',
    radius: 20,
    orbitRadius: 480,
    speed: 0.97,
    startAngle: 3.5,
    rings: true,
    ringColor: 'rgba(228,209,145,0.35)',
    isProminent: true,
    diameter: '116,460 km',
    distance: '1.43 billion km',
    period: '29.5 Earth years',
    moons: '146',
    temp: '−140 °C (cloud top)',
    desc: 'Famous for its spectacular ring system made of ice and rock. Saturn is the least dense planet — it would float on water! It has 146 known moons including Titan.',
  },
  {
    name: 'Uranus',
    emoji: '🫧',
    type: 'Ice Giant',
    color: '#7de8e8',
    glowColor: 'rgba(125,232,232,0.6)',
    radius: 15,
    orbitRadius: 610,
    speed: 0.68,
    startAngle: 0.5,
    rings: true,
    ringColor: 'rgba(125,232,232,0.2)',
    diameter: '50,724 km',
    distance: '2.87 billion km',
    period: '84 Earth years',
    moons: '28',
    temp: '−195 °C (avg)',
    desc: 'The "sideways planet" — Uranus rotates on its side with an axial tilt of 98°. It is an ice giant with a fascinating ring system and 28 known moons.',
  },
  {
    name: 'Neptune',
    emoji: '🔵',
    type: 'Ice Giant',
    color: '#3f54ba',
    glowColor: 'rgba(63,84,186,0.6)',
    radius: 14,
    orbitRadius: 750,
    speed: 0.54,
    startAngle: 2.1,
    rings: true,
    ringColor: 'rgba(63,84,186,0.2)',
    diameter: '49,528 km',
    distance: '4.50 billion km',
    period: '165 Earth years',
    moons: '16',
    temp: '−200 °C (avg)',
    desc: 'The windiest planet with gusts reaching 2,100 km/h. Neptune has a massive storm called the Great Dark Spot and its largest moon Triton orbits retrograde.',
  },
  // Dwarf Planets
  {
    name: 'Pluto',
    emoji: '⚫',
    type: 'Dwarf Planet',
    color: '#9e8f7a',
    glowColor: 'rgba(158,143,122,0.4)',
    radius: 3,
    orbitRadius: 870,
    speed: 0.38,
    startAngle: 4.2,
    rings: false,
    dashed: true,
    diameter: '2,377 km',
    distance: '5.91 billion km',
    period: '248 Earth years',
    moons: '5 (Charon, Nix, Hydra…)',
    temp: '−230 °C (avg)',
    desc: 'Pluto was reclassified as a dwarf planet in 2006. It has a heart-shaped nitrogen ice plain (Tombaugh Regio) and a moon Charon half its own size.',
  },
];

// Sun data
const SUN = {
  name: 'Sun',
  emoji: '☀️',
  type: 'G-type Main-sequence Star',
  color: '#fff176',
  radius: 38,
  diameter: '1.39 million km',
  distance: '0 km (center)',
  period: '225–250 million years (galactic)',
  moons: 'N/A',
  temp: '5,778 K (surface)',
  desc: 'The Sun contains 99.86% of the total mass of the Solar System. Its core reaches 15 million °C, fusing 620 million tons of hydrogen per second into helium.',
};

// ── Canvas Setup ────────────────────────────────────────────
const canvas = document.getElementById('solar-canvas');
const ctx    = canvas.getContext('2d');

let W, H, cx, cy;          // canvas dimensions & center
let scale       = 1;
let targetScale = 1;
const MIN_SCALE = 0.15;
const MAX_SCALE = 4.5;
const ZOOM_STEP = 0.2;

let offsetX = 0, offsetY = 0;  // panning
let dragStartX, dragStartY, isDragging = false;

let speedMultiplier = 1;
let paused          = false;
let showLabels      = true;

// Planet angle state
const angles = PLANETS.map(p => p.startAngle);

// ── Resize ─────────────────────────────────────────────────
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  W = canvas.width  = rect.width  * dpr;
  H = canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  cx = rect.width  / 2;
  cy = rect.height / 2;
}

window.addEventListener('resize', resize);

// ── Draw Helpers ────────────────────────────────────────────
function drawGlow(x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.8);
  g.addColorStop(0,   color);
  g.addColorStop(1,   'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawSun(x, y) {
  // Corona glow
  const corona = ctx.createRadialGradient(x, y, 0, x, y, SUN.radius * scale * 3.5);
  corona.addColorStop(0,    'rgba(255,240,100,0.35)');
  corona.addColorStop(0.4,  'rgba(255,180, 30,0.15)');
  corona.addColorStop(1,    'transparent');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(x, y, SUN.radius * scale * 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Sun body gradient
  const sunGrad = ctx.createRadialGradient(
    x - SUN.radius * scale * 0.3,
    y - SUN.radius * scale * 0.3,
    0, x, y, SUN.radius * scale
  );
  sunGrad.addColorStop(0,   '#fff9c4');
  sunGrad.addColorStop(0.4, '#ffe066');
  sunGrad.addColorStop(0.8, '#ffab00');
  sunGrad.addColorStop(1,   '#e65100');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(x, y, SUN.radius * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrbit(cx2, cy2, r, dashed) {
  ctx.save();
  ctx.strokeStyle = dashed ? 'rgba(160,180,220,0.15)' : 'rgba(94,231,255,0.10)';
  ctx.lineWidth   = dashed ? 0.8 : 0.8;
  if (dashed) ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.arc(cx2, cy2, r * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawPlanet(p, angle, idx) {
  const px = cx + offsetX + Math.cos(angle) * p.orbitRadius * scale;
  const py = cy + offsetY + Math.sin(angle) * p.orbitRadius * scale;
  const pr = p.radius * scale;

  // Glow
  drawGlow(px, py, pr, p.glowColor || 'rgba(255,255,255,0.3)');

  // Saturn's prominent rings
  if (p.isProminent && scale > 0.3) {
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(1, 0.35);
    const ringW = pr * 2.5;
    const ringGrad = ctx.createLinearGradient(-ringW, 0, ringW, 0);
    ringGrad.addColorStop(0,   'transparent');
    ringGrad.addColorStop(0.2, 'rgba(228,209,145,0.5)');
    ringGrad.addColorStop(0.5, 'rgba(210,190,120,0.7)');
    ringGrad.addColorStop(0.8, 'rgba(228,209,145,0.5)');
    ringGrad.addColorStop(1,   'transparent');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringW, pr * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Uranus/Neptune ring
  if (p.rings && !p.isProminent && scale > 0.5) {
    ctx.save();
    ctx.strokeStyle = p.ringColor || 'rgba(255,255,255,0.15)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.ellipse(px, py, pr * 1.6, pr * 0.4, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Planet body
  const planetGrad = ctx.createRadialGradient(
    px - pr * 0.3, py - pr * 0.3, 0,
    px, py, pr
  );
  planetGrad.addColorStop(0, lightenColor(p.color, 30));
  planetGrad.addColorStop(1, darkenColor(p.color, 20));
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(px, py, Math.max(pr, 1.5), 0, Math.PI * 2);
  ctx.fill();

  // Earth blue-green detail
  if (p.name === 'Earth' && scale > 0.6) {
    ctx.fillStyle = 'rgba(40,120,40,0.45)';
    ctx.beginPath();
    ctx.arc(px + pr * 0.15, py - pr * 0.1, pr * 0.55, 0.2, 2.8);
    ctx.fill();
  }

  // Moon for Earth
  if (p.hasMoon && scale > 0.5) {
    const moonAngle = angle * 13.37;
    const moonDist  = pr * 2.2;
    const mx = px + Math.cos(moonAngle) * moonDist;
    const my = py + Math.sin(moonAngle) * moonDist;
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.arc(mx, my, Math.max(pr * 0.28, 1), 0, Math.PI * 2);
    ctx.fill();
  }

  // Label
  if (showLabels && scale > 0.25) {
    ctx.fillStyle    = 'rgba(208,232,255,0.85)';
    ctx.font         = `${Math.max(9, 11 * scale)}px 'Exo 2', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(p.name, px, py + pr + 4);
  }

  return { px, py, pr }; // for hit-testing
}

// ── Color utilities ────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b];
}
function lightenColor(hex, amount) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.min(255,r+amount)},${Math.min(255,g+amount)},${Math.min(255,b+amount)})`;
}
function darkenColor(hex, amount) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amount)},${Math.max(0,g-amount)},${Math.max(0,b-amount)})`;
}

// ── Info Panel ─────────────────────────────────────────────
function openPanel(data) {
  document.getElementById('panel-emoji').textContent    = data.emoji;
  document.getElementById('panel-name').textContent     = data.name;
  document.getElementById('panel-type').textContent     = data.type;
  document.getElementById('panel-diameter').textContent = data.diameter;
  document.getElementById('panel-distance').textContent = data.distance;
  document.getElementById('panel-period').textContent   = data.period;
  document.getElementById('panel-moons').textContent    = data.moons;
  document.getElementById('panel-temp').textContent     = data.temp;
  document.getElementById('panel-desc').textContent     = data.desc;
  document.getElementById('info-panel').classList.remove('hidden');
}

document.getElementById('close-panel').addEventListener('click', () => {
  document.getElementById('info-panel').classList.add('hidden');
});

// ── Tooltip ────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');
function showTooltip(name, x, y) {
  tooltip.textContent = name;
  tooltip.style.left  = `${x + 14}px`;
  tooltip.style.top   = `${y - 10}px`;
  tooltip.classList.remove('hidden');
}
function hideTooltip() {
  tooltip.classList.add('hidden');
}

// ── Zoom Controls ──────────────────────────────────────────
function setZoom(newScale) {
  targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
}
function applyZoomStep(dir) { setZoom(targetScale + dir * ZOOM_STEP); }

document.getElementById('btn-zoom-in').addEventListener('click',    () => applyZoomStep(1));
document.getElementById('btn-zoom-out').addEventListener('click',   () => applyZoomStep(-1));
document.getElementById('btn-zoom-reset').addEventListener('click', () => {
  targetScale = 1;
  offsetX = 0;
  offsetY = 0;
});

const zoomLabel = document.getElementById('zoom-label');

// Mouse wheel zoom (zoom toward cursor)
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.12 : 0.89;
  const rect   = canvas.getBoundingClientRect();
  const mx     = e.clientX - rect.left - (cx + offsetX);
  const my     = e.clientY - rect.top  - (cy + offsetY);
  const oldScale = targetScale;
  targetScale  = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale * factor));
  const ratio  = targetScale / oldScale - 1;
  offsetX     -= mx * ratio;
  offsetY     -= my * ratio;
}, { passive: false });

// ── Speed & Pause ──────────────────────────────────────────
document.getElementById('toggle-speed').addEventListener('input', e => {
  speedMultiplier = parseFloat(e.target.value);
});

const pauseBtn = document.getElementById('btn-pause');
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause';
});

// ── Labels Toggle ──────────────────────────────────────────
document.getElementById('toggle-labels').addEventListener('change', e => {
  showLabels = e.target.checked;
});

// ── Panning ────────────────────────────────────────────────
canvas.addEventListener('mousedown', e => {
  isDragging = true;
  dragStartX = e.clientX - offsetX;
  dragStartY = e.clientY - offsetY;
  canvas.style.cursor = 'grabbing';
});
canvas.addEventListener('mousemove', e => {
  if (isDragging) {
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
  } else {
    handleHover(e);
  }
});
canvas.addEventListener('mouseup',    () => { isDragging = false; canvas.style.cursor = 'grab'; });
canvas.addEventListener('mouseleave', () => { isDragging = false; hideTooltip(); });

// Touch panning
let lastTouchX, lastTouchY, lastTouchDist;
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    isDragging = true;
    dragStartX = e.touches[0].clientX - offsetX;
    dragStartY = e.touches[0].clientY - offsetY;
  } else if (e.touches.length === 2) {
    isDragging = false;
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    offsetX = e.touches[0].clientX - dragStartX;
    offsetY = e.touches[0].clientY - dragStartY;
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    targetScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale * (dist / lastTouchDist)));
    lastTouchDist = dist;
  }
}, { passive: false });
canvas.addEventListener('touchend', () => { isDragging = false; });

// ── Click to open panel ─────────────────────────────────────
canvas.addEventListener('click', e => {
  if (isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;

  // Check Sun
  const sunX = cx + offsetX, sunY = cy + offsetY;
  if (Math.hypot(mx - sunX, my - sunY) < SUN.radius * scale + 8) {
    openPanel(SUN);
    return;
  }

  // Check planets
  for (let i = 0; i < PLANETS.length; i++) {
    const p   = PLANETS[i];
    const ang = angles[i];
    const px  = cx + offsetX + Math.cos(ang) * p.orbitRadius * scale;
    const py  = cy + offsetY + Math.sin(ang) * p.orbitRadius * scale;
    const pr  = Math.max(p.radius * scale, 6);
    if (Math.hypot(mx - px, my - py) < pr + 6) {
      openPanel(p);
      return;
    }
  }
});

// ── Hover to show tooltip ───────────────────────────────────
function handleHover(e) {
  const rect = canvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const my   = e.clientY - rect.top;

  // Sun hover
  const sunX = cx + offsetX, sunY = cy + offsetY;
  if (Math.hypot(mx - sunX, my - sunY) < SUN.radius * scale + 8) {
    showTooltip('☀ The Sun', e.clientX, e.clientY);
    canvas.style.cursor = 'pointer';
    return;
  }

  for (let i = 0; i < PLANETS.length; i++) {
    const p   = PLANETS[i];
    const ang = angles[i];
    const px  = cx + offsetX + Math.cos(ang) * p.orbitRadius * scale;
    const py  = cy + offsetY + Math.sin(ang) * p.orbitRadius * scale;
    const pr  = Math.max(p.radius * scale, 6);
    if (Math.hypot(mx - px, my - py) < pr + 8) {
      showTooltip(`${p.emoji} ${p.name}`, e.clientX, e.clientY);
      canvas.style.cursor = 'pointer';
      return;
    }
  }

  hideTooltip();
  canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
}

// ── Keyboard shortcuts ─────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.key === '+'  || e.key === '=') applyZoomStep(1);
  if (e.key === '-')                   applyZoomStep(-1);
  if (e.key === '0')  { targetScale = 1; offsetX = 0; offsetY = 0; }
  if (e.key === ' ')  { paused = !paused; pauseBtn.textContent = paused ? '▶ Resume' : '⏸ Pause'; e.preventDefault(); }
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
    const step = 40;
    if (e.key === 'ArrowLeft')  offsetX += step;
    if (e.key === 'ArrowRight') offsetX -= step;
    if (e.key === 'ArrowUp')    offsetY += step;
    if (e.key === 'ArrowDown')  offsetY -= step;
    e.preventDefault();
  }
});

// ── Milky Way background arc ────────────────────────────────
function drawMilkyWay() {
  ctx.save();
  ctx.globalAlpha = 0.07;
  const mw = ctx.createLinearGradient(0, H * 0.3, W, H * 0.7);
  mw.addColorStop(0,   'transparent');
  mw.addColorStop(0.3, '#c8d8ff');
  mw.addColorStop(0.5, '#e0ecff');
  mw.addColorStop(0.7, '#c8d8ff');
  mw.addColorStop(1,   'transparent');
  ctx.fillStyle = mw;
  ctx.fillRect(0, 0, W / window.devicePixelRatio, H / window.devicePixelRatio);
  ctx.restore();
}

// ── Asteroid Belt ──────────────────────────────────────────
const ASTEROIDS = Array.from({ length: 120 }, () => ({
  angle: Math.random() * Math.PI * 2,
  r: 293 + Math.random() * 40,   // between Mars & Jupiter
  speed: 0.001 + Math.random() * 0.003,
  size: 0.5 + Math.random() * 1.2,
  alpha: 0.2 + Math.random() * 0.4,
}));

function drawAsteroidBelt() {
  ctx.save();
  for (const a of ASTEROIDS) {
    const ax  = cx + offsetX + Math.cos(a.angle) * a.r * scale;
    const ay  = cy + offsetY + Math.sin(a.angle) * a.r * scale;
    ctx.globalAlpha = a.alpha;
    ctx.fillStyle   = '#a0a0b0';
    ctx.beginPath();
    ctx.arc(ax, ay, a.size * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Belt label
  if (showLabels && scale > 0.3) {
    ctx.fillStyle    = 'rgba(160,180,220,0.35)';
    ctx.font         = `${Math.max(7, 10 * scale)}px 'Exo 2', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Asteroid Belt', cx + offsetX, cy + offsetY - 313 * scale);
  }
}

// ── Main Render Loop ────────────────────────────────────────
let lastTime = 0;

function draw(timestamp) {
  const delta = (timestamp - lastTime) / 1000; // seconds
  lastTime    = timestamp;

  // Smooth zoom lerp
  scale += (targetScale - scale) * 0.09;
  zoomLabel.textContent = `${Math.round(scale * 100)}%`;

  // Clear
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  // Milky Way wash
  drawMilkyWay();

  // Orbits
  for (const p of PLANETS) {
    drawOrbit(cx + offsetX, cy + offsetY, p.orbitRadius, p.dashed);
  }

  // Asteroid Belt
  if (!paused) {
    for (const a of ASTEROIDS) a.angle += a.speed * speedMultiplier * delta * 60;
  }
  drawAsteroidBelt();

  // Sun
  drawSun(cx + offsetX, cy + offsetY);

  // Sun label
  if (showLabels && scale > 0.3) {
    ctx.fillStyle    = 'rgba(255,230,100,0.8)';
    ctx.font         = `bold ${Math.max(9, 12 * scale)}px 'Exo 2', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Sun', cx + offsetX, cy + offsetY + SUN.radius * scale + 4);
  }

  // Planets
  for (let i = 0; i < PLANETS.length; i++) {
    const p = PLANETS[i];
    if (!paused) {
      angles[i] += (p.speed * 0.0005 * speedMultiplier) * delta * 60;
    }
    drawPlanet(p, angles[i], i);
  }

  requestAnimationFrame(draw);
}

// ── Init ────────────────────────────────────────────────────
function init() {
  resize();
  requestAnimationFrame(draw);
}

init();
