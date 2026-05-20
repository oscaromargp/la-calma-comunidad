/* La Calma Comunidad — Main Application v2.0 */

document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('la-calma-lang') || 'es';
  let exchangeRate = 17.22;

  // ----------------------------------------------------------
  // 1. EXCHANGE RATE API (free, no key needed)
  // ----------------------------------------------------------
  async function fetchExchangeRate() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.rates && data.rates.MXN) {
        exchangeRate = data.rates.MXN;
        console.log(`💱 Exchange rate updated: 1 USD = ${exchangeRate} MXN`);
      }
    } catch (e) {
      console.log('💱 Using fallback exchange rate: 17.22');
    }
  }

  // ----------------------------------------------------------
  // 2. i18n ENGINE
  // ----------------------------------------------------------
  function t(key) {
    const keys = key.split('.');
    let val = translations[currentLang];
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k];
      else return key;
    }
    return val;
  }

  function fmtUSD(n) { return '$' + Number(n).toLocaleString('en-US') + ' USD'; }
  function fmtMXN(n) { return '$' + Number(n * exchangeRate).toLocaleString('en-US') + ' MXN'; }
  function fmtPrice(n) { return currentLang === 'es' ? fmtMXN(n) : fmtUSD(n); }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text && text !== key) {
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const text = t(key);
      if (text && text !== key) el.innerHTML = text;
    });
    document.querySelectorAll('[data-i18n-price]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-i18n-price'));
      if (!isNaN(usd)) {
        el.textContent = currentLang === 'es'
          ? fmtMXN(usd) + ` (~${fmtUSD(usd)})`
          : fmtUSD(usd) + ` (~${fmtMXN(usd)})`;
      }
    });
    document.documentElement.lang = currentLang;
    localStorage.setItem('la-calma-lang', currentLang);
  }

  function toggleLang() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations();
    updateSimulator();
    document.querySelectorAll('[data-i18n-price]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-i18n-price'));
      if (!isNaN(usd)) {
        el.textContent = currentLang === 'es'
          ? fmtMXN(usd) + ` (~${fmtUSD(usd)})`
          : fmtUSD(usd) + ` (~${fmtMXN(usd)})`;
      }
    });
  }

  window.toggleLang = toggleLang;

  // ----------------------------------------------------------
  // 3. NAVBAR
  // ----------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.navbar-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ----------------------------------------------------------
  // 4. PARTICLES
  // ----------------------------------------------------------
  function createParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function init() {
      resize();
      const count = Math.min(Math.floor(window.innerWidth * 0.04), 50);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.4 + 0.1
      }));
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 153, 0, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }
    init(); animate();
    window.addEventListener('resize', () => { resize(); init(); });
  }
  createParticles();

  // ----------------------------------------------------------
  // 5. REVEAL + COUNTER
  // ----------------------------------------------------------
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.hasAttribute('data-counter')) animateCounter(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

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
  const LAND_PRICE_4 = 85000;
  const LAND_PRICE_5 = 87000;
  const COST_VILLA_M2 = 1125;
  const COST_ESTATE_M2 = 1650;
  const RENT_SHORT_HIGH = 350;
  const RENT_SHORT_LOW = 250;
  const OCCUPANCY = 0.80;
  const SEASON_MONTHS = 6;
  const LOW_SEASON_MONTHLY = 3500;
  const EXPENSE_RATIO = 0.30;

  const simForm = document.getElementById('sim-form');
  const surfaceSlider = document.getElementById('surface-slider');
  const surfaceDisplay = document.getElementById('surface-display');

  function updateSimulator() {
    const projectType = document.getElementById('project-type').value;
    const fraction = document.getElementById('fraction-select').value;
    const surface = parseInt(surfaceSlider.value);

    const landPrice = fraction === 'frac5' ? LAND_PRICE_5 : LAND_PRICE_4;
    const costPerM2 = projectType === 'villa' ? COST_VILLA_M2 : COST_ESTATE_M2;
    const totalBuild = costPerM2 * surface;
    const totalInvestment = landPrice + totalBuild;

    const rentShort = projectType === 'villa' ? RENT_SHORT_LOW : RENT_SHORT_HIGH;
    const seasonalIncome = rentShort * OCCUPANCY * 30 * SEASON_MONTHS;
    const lowSeasonIncome = LOW_SEASON_MONTHLY * (12 - SEASON_MONTHS) * 0.6;
    const annualIncome = seasonalIncome + lowSeasonIncome;
    const expenses = annualIncome * EXPENSE_RATIO;
    const netIncome = annualIncome - expenses;
    const roi = totalInvestment > 0 ? (netIncome / totalInvestment) * 100 : 0;

    const fm = (n) => currentLang === 'es' ? fmtMXN(n) : fmtUSD(n);

    document.getElementById('result-land-price').textContent = currentLang === 'es' ? fmtMXN(landPrice) : fmtUSD(landPrice);
    document.getElementById('result-land-m2').textContent = `$56.66 USD (${fmtMXN(1)}/m²)`;
    document.getElementById('result-build-cost').textContent = fm(totalBuild);
    document.getElementById('result-build-m2').textContent = fm(costPerM2) + ' /m²';
    document.getElementById('result-total').textContent = fm(totalInvestment);
    document.getElementById('result-breakdown-land').textContent = fm(landPrice);
    document.getElementById('result-breakdown-build').textContent = fm(totalBuild);

    document.getElementById('result-nightly').textContent = fm(rentShort) + '/noche';
    document.getElementById('result-occ').textContent = Math.round(OCCUPANCY * 100) + '%';
    document.getElementById('result-monthly-low').textContent = fm(LOW_SEASON_MONTHLY) + '/mes';
    document.getElementById('result-annual').textContent = fm(Math.round(annualIncome));
    document.getElementById('result-expenses').textContent = fm(Math.round(expenses));
    document.getElementById('result-net').textContent = fm(Math.round(netIncome));
    document.getElementById('result-roi').textContent = roi.toFixed(1) + '%';

    if (surfaceDisplay) {
      const label = currentLang === 'es' ? 'm² construidos' : 'm² built';
      surfaceDisplay.innerHTML = surface.toLocaleString() + ` <span class="range-unit">${label}</span>`;
    }
  }

  if (simForm) {
    const selects = simForm.querySelectorAll('select');
    selects.forEach(s => s.addEventListener('change', updateSimulator));
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
  // 8. PRESS CARD CLICK
  // ----------------------------------------------------------
  document.querySelectorAll('.press-card').forEach(card => {
    card.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      if (url) window.open(url, '_blank');
    });
  });

  // ----------------------------------------------------------
  // 9. INIT
  // ----------------------------------------------------------
  fetchExchangeRate().then(() => {
    applyTranslations();
    initReveal();
    updateSimulator();
    document.querySelectorAll('[data-i18n-price]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-i18n-price'));
      if (!isNaN(usd)) {
        el.textContent = currentLang === 'es'
          ? fmtMXN(usd) + ` (~${fmtUSD(usd)})`
          : fmtUSD(usd) + ` (~${fmtMXN(usd)})`;
      }
    });
    console.log(`📍 La Calma Comunidad v2.0 — Initialized | Lang: ${currentLang} | Rate: ${exchangeRate}`);
  });
});
