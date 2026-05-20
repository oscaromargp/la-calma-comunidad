/* La Calma Comunidad — Main Application v3.0 */

document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('la-calma-lang') || 'es';
  let exchangeRate = 17.22;

  // ----------------------------------------------------------
  // 1. EXCHANGE RATE API
  // ----------------------------------------------------------
  async function fetchExchangeRate() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.rates && data.rates.MXN) {
        exchangeRate = data.rates.MXN;
      }
    } catch (e) {}
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
      if (text && text !== key) el.textContent = text;
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
    updatePaymentCalc();
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
  // 6. INVESTMENT SIMULATOR (H1 limit: 600 m² max)
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
  const H1_MAX_M2 = 600;

  const simForm = document.getElementById('sim-form');
  const surfaceSlider = document.getElementById('surface-slider');
  const surfaceDisplay = document.getElementById('surface-display');

  function updateSimulator() {
    const projectType = document.getElementById('project-type').value;
    const fraction = document.getElementById('fraction-select').value;
    const surface = Math.min(parseInt(surfaceSlider.value), H1_MAX_M2);

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
      const label = currentLang === 'es' ? 'm² construidos (límite H1)' : 'm² built (H1 limit)';
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
  // 7. FINANCING CALCULATOR (customizable)
  // ----------------------------------------------------------
  const TOTAL_PRICE = 85000;
  const DEFAULT_DOWN = 17000;
  const DEFAULT_MONTHS = 60;

  function updatePaymentCalc() {
    const downSlider = document.getElementById('custom-down');
    const monthsSlider = document.getElementById('custom-months');
    if (!downSlider || !monthsSlider) return;

    const down = parseInt(downSlider.value);
    const months = parseInt(monthsSlider.value);
    const financed = TOTAL_PRICE - down;
    const monthly = months > 0 ? financed / months : 0;

    const fm = (n) => currentLang === 'es' ? fmtMXN(n) : fmtUSD(n);

    document.getElementById('pay-down').textContent = fm(down);
    document.getElementById('pay-financed').textContent = fm(financed);
    document.getElementById('pay-monthly').textContent = fm(Math.round(monthly));
    document.getElementById('pay-count').textContent = months;
    document.getElementById('pay-total').textContent = fm(TOTAL_PRICE);

    document.getElementById('custom-down-display').innerHTML = fm(down);
    document.getElementById('custom-months-display').innerHTML = months + ' ' + (currentLang === 'es' ? 'meses' : 'months');
    document.getElementById('custom-payment-result').textContent = fm(Math.round(monthly));

    // Update the secondary label
    const sub = document.querySelector('#custom-result span:last-child');
    if (sub) {
      sub.textContent = 'x ' + months + ' ' + (currentLang === 'es' ? 'meses' : 'months') + ' · Sin intereses';
    }
  }

  const downSlider = document.getElementById('custom-down');
  const monthsSlider = document.getElementById('custom-months');
  if (downSlider) downSlider.addEventListener('input', updatePaymentCalc);
  if (monthsSlider) monthsSlider.addEventListener('input', updatePaymentCalc);

  // ----------------------------------------------------------
  // 8. FAQ ACCORDION
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
  // 9. DAY CARD PARALLAX (mouse move effect)
  // ----------------------------------------------------------
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  });

  // ----------------------------------------------------------
  // 10. PARALLAX SCROLL
  // ----------------------------------------------------------
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.parallax-bg').forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = rect.top * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  });

  // ----------------------------------------------------------
  // 11. INIT
  // ----------------------------------------------------------
  fetchExchangeRate().then(() => {
    applyTranslations();
    initReveal();
    updateSimulator();
    updatePaymentCalc();
    document.querySelectorAll('[data-i18n-price]').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-i18n-price'));
      if (!isNaN(usd)) {
        el.textContent = currentLang === 'es'
          ? fmtMXN(usd) + ` (~${fmtUSD(usd)})`
          : fmtUSD(usd) + ` (~${fmtMXN(usd)})`;
      }
    });
  });
});