/* ============================================================
   LA CALMA COMUNIDAD — Main Application
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------
  // 1. i18n ENGINE
  // ----------------------------------------------------------
  let currentLang = localStorage.getItem('la-calma-lang') || 'es';

  function t(key) {
    const keys = key.split('.');
    let val = translations[currentLang];
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k];
      else return key;
    }
    return val;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text && text !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', text);
        } else {
          el.textContent = text;
        }
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const text = t(key);
      if (text && text !== key) {
        el.innerHTML = text;
      }
    });
    document.documentElement.lang = currentLang;
    localStorage.setItem('la-calma-lang', currentLang);
  }

  function toggleLang() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations();
    updateSimulator();
  }

  window.toggleLang = toggleLang;

  // ----------------------------------------------------------
  // 2. NAVBAR
  // ----------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.navbar-links');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ----------------------------------------------------------
  // 3. PARTICLES
  // ----------------------------------------------------------
  function createParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles() {
      resize();
      const count = Math.min(Math.floor(window.innerWidth * 0.04), 50);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      }));
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 153, 0, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  createParticles();

  // ----------------------------------------------------------
  // 4. REVEAL ON SCROLL
  // ----------------------------------------------------------
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.hasAttribute('data-counter')) {
            animateCounter(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ----------------------------------------------------------
  // 5. COUNTER ANIMATION
  // ----------------------------------------------------------
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }

  // ----------------------------------------------------------
  // 6. INVESTMENT SIMULATOR
  // ----------------------------------------------------------
  const LAND_PRICE = 85000;
  const LAND_M2 = 1500;

  const COST_VILLA_MIN = 1000;
  const COST_VILLA_MAX = 1250;
  const COST_ESTATE_MIN = 1500;
  const COST_ESTATE_MAX = 1800;

  const RENT_LONG_MIN = 2500;
  const RENT_LONG_MAX = 4500;
  const RENT_SHORT_MIN = 200;
  const RENT_SHORT_MAX = 500;
  const OCCUPANCY = 0.80;
  const SEASON_MONTHS = 6;

  const simForm = document.getElementById('sim-form');
  const surfaceSlider = document.getElementById('surface-slider');
  const surfaceDisplay = document.getElementById('surface-display');

  function updateSimulator() {
    const projectType = document.getElementById('project-type').value;
    const surface = parseInt(surfaceSlider.value);

    const isVilla = projectType === 'villa';
    const costPerM2Min = isVilla ? COST_VILLA_MIN : COST_ESTATE_MIN;
    const costPerM2Max = isVilla ? COST_VILLA_MAX : COST_ESTATE_MAX;
    const costPerM2 = Math.round((costPerM2Min + costPerM2Max) / 2);

    const totalLand = LAND_PRICE;
    const totalBuild = costPerM2 * surface;
    const totalInvestment = totalLand + totalBuild;

    const rentLong = isVilla ? RENT_LONG_MIN : RENT_LONG_MAX;
    const rentShort = isVilla ? RENT_SHORT_MIN + 50 : RENT_SHORT_MAX;
    const annualRental = (rentShort * OCCUPANCY * 30 * SEASON_MONTHS) + (rentLong * (12 - SEASON_MONTHS) * 0.6);
    const roi = (annualRental / totalInvestment) * 100;

    const fmt = (n) => '$' + n.toLocaleString('en-US') + ' USD';
    const fmtMXN = (n) => 'MX$' + (n * 20).toLocaleString('en-US');

    document.getElementById('result-land-price').textContent = fmt(LAND_PRICE);
    document.getElementById('result-land-m2').textContent = '$56.66 USD';

    document.getElementById('result-build-cost').textContent = fmt(costPerM2 * surface);
    document.getElementById('result-build-m2').textContent = fmt(costPerM2) + ' /m²';

    document.getElementById('result-total').textContent = fmt(totalInvestment);
    document.getElementById('result-breakdown-land').textContent = fmt(totalLand);
    document.getElementById('result-breakdown-build').textContent = fmt(totalBuild);

    document.getElementById('result-rent-long').textContent = fmt(rentLong) + '/mes';
    document.getElementById('result-rent-short').textContent = fmt(rentShort) + '/noche';
    document.getElementById('result-occ').textContent = Math.round(OCCUPANCY * 100) + '%';
    document.getElementById('result-annual').textContent = fmt(Math.round(annualRental));
    document.getElementById('result-roi').textContent = roi.toFixed(1) + '%';

    if (surfaceDisplay) {
      surfaceDisplay.innerHTML = surface.toLocaleString() + ' <span class="range-unit">m²</span>';
    }
  }

  if (simForm) {
    document.getElementById('project-type').addEventListener('change', updateSimulator);
    surfaceSlider.addEventListener('input', updateSimulator);
    updateSimulator();
  }

  // ----------------------------------------------------------
  // 7. FAQ ACCORDION
  // ----------------------------------------------------------
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // ----------------------------------------------------------
  // 8. INIT
  // ----------------------------------------------------------
  applyTranslations();
  initReveal();

  console.log('🏡 La Calma Comunidad — Landing initialized');
  console.log(`🌐 Current language: ${currentLang}`);
});
