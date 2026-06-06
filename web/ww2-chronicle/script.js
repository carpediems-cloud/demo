/* ═══════════════════════════════════════════════
   WW2 CHRONICLE — SCRIPT.JS
   Scroll animations, counters, nav, particles
   ═══════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// NAVBAR — scroll highlight + mobile toggle
// ─────────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNavLink();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active-link', scrollY >= top && scrollY < top + height);
    }
  });
}

// ─────────────────────────────────────────────────
// SCROLL REVEAL — IntersectionObserver
// ─────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────────────
// STAT BARS — animate on scroll into view
// ─────────────────────────────────────────────────
const statItems    = document.querySelectorAll('.stat-item');
const bdFills      = document.querySelectorAll('.bd-fill');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('counted');
    }
  });
}, { threshold: 0.3 });

statItems.forEach(el => statObserver.observe(el));

// Trigger breakdown bars once the section is visible
const breakdownSection = document.querySelector('.casualties-breakdown');
if (breakdownSection) {
  const bdObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bdFills.forEach(fill => fill.classList.add('counted'));
      }
    });
  }, { threshold: 0.3 });
  bdObserver.observe(breakdownSection);
}

// ─────────────────────────────────────────────────
// HERO PARALLAX — subtle bg shift on mouse move
// ─────────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');

document.addEventListener('mousemove', (e) => {
  if (!heroBg) return;
  const xPct = (e.clientX / window.innerWidth - 0.5) * 10;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 6;
  heroBg.style.transform = `scale(1.06) translate(${xPct}px, ${yPct}px)`;
});

// ─────────────────────────────────────────────────
// ASH PARTICLES — floating embers in hero
// ─────────────────────────────────────────────────
const heroParticles = document.getElementById('heroParticles');

function createAsh() {
  const ash = document.createElement('div');
  ash.className = 'ash';
  const size  = 1 + Math.random() * 3;
  const left  = Math.random() * 100;
  const dur   = 8 + Math.random() * 16;
  const delay = Math.random() * -20;
  const dx    = (Math.random() - 0.5) * 120;

  ash.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    top: -10px;
    --dx: ${dx}px;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    opacity: ${0.1 + Math.random() * 0.4};
  `;
  heroParticles.appendChild(ash);
}

for (let i = 0; i < 60; i++) createAsh();

// ─────────────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────────────
// TYPEWRITER EFFECT — hero sub text (optional)
// ─────────────────────────────────────────────────
// Already uses static HTML — no typewriter needed.
// But we add a subtle fade-in stagger to hero elements
const heroRevealEls = document.querySelectorAll('.hero-content .reveal-up');
heroRevealEls.forEach((el, i) => {
  el.style.transitionDelay = `${0.2 + i * 0.2}s`;
  setTimeout(() => el.classList.add('in-view'), 100);
});

// ─────────────────────────────────────────────────
// TIMELINE DOT GLOW — pulse as user scrolls near
// ─────────────────────────────────────────────────
const tlDots = document.querySelectorAll('.tl-dot');

const dotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.style.boxShadow = entry.isIntersecting
      ? '0 0 22px 6px rgba(201,162,39,0.7)'
      : '0 0 12px rgba(201,162,39,0.4)';
  });
}, { threshold: 0.8 });

tlDots.forEach(dot => dotObserver.observe(dot));

// ─────────────────────────────────────────────────
// BATTLE CARDS — tilt effect on mouse enter
// ─────────────────────────────────────────────────
document.querySelectorAll('.battle-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rotX = (y - 0.5) * -8;
    const rotY = (x - 0.5) *  8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s linear, box-shadow 0.4s, border-color 0.4s';
  });
});

// ─────────────────────────────────────────────────
// LEGACY CARDS — icon pulse animation
// ─────────────────────────────────────────────────
const legacyIcons = document.querySelectorAll('.legacy-icon');
const iconObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'iconPop 0.5s ease forwards';
    }
  });
}, { threshold: 0.5 });

legacyIcons.forEach(icon => iconObserver.observe(icon));

// inject keyframe
const iconStyle = document.createElement('style');
iconStyle.textContent = `
  @keyframes iconPop {
    0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    70%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
`;
document.head.appendChild(iconStyle);

// ─────────────────────────────────────────────────
// ACTIVE LINK STYLE (inject CSS)
// ─────────────────────────────────────────────────
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-links a.active-link { color: var(--primary) !important; }
  .nav-links a.active-link::after { transform: scaleX(1) !important; }
`;
document.head.appendChild(navStyle);

// ─────────────────────────────────────────────────
// SCROLL PROGRESS BAR (thin top bar)
// ─────────────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 64px;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(to right, #8b1a1a, #c9a227, #f5e27a);
  z-index: 1001;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total  = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = (window.scrollY / total) * 100;
  progressBar.style.width = pct + '%';
});

// ─────────────────────────────────────────────────
// INIT — call all initial states
// ─────────────────────────────────────────────────
updateActiveNavLink();
console.log('%c✠ WW2 CHRONICLE — Loaded', 'color:#c9a227;font-family:serif;font-size:14px;');
