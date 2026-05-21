document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('la-calma-lang') || 'es';
  window.__lang = () => currentLang;

  window.t = function(key) {
    const keys = key.split('.');
    let val = translations[currentLang];
    for (const k of keys) {
      if (val && val[k] !== undefined) val = val[k];
      else return key;
    }
    return val;
  };

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
    document.documentElement.lang = currentLang;
    localStorage.setItem('la-calma-lang', currentLang);
  }

  window.toggleLang = () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations();
    if (window.updateCalculator) window.updateCalculator();
    if (window.updateSVGLabels) window.updateSVGLabels();
  };

  // Navbar
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.navbar-links');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
  if (mobileToggle) mobileToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('.navbar-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

  // Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.hasAttribute('data-counter')) animateCounter(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  applyTranslations();
});
