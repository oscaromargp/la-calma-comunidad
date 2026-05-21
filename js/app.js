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

  // Gallery Carousel
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  let slideIndex = 0;
  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => { slideIndex = i; updateCarousel(); });
      dotsContainer.appendChild(dot);
    });
    function updateCarousel() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.scrollTo({ left: slideWidth * slideIndex, behavior: 'smooth' });
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === slideIndex));
    }
    document.querySelector('.carousel-prev')?.addEventListener('click', () => {
      slideIndex = slideIndex > 0 ? slideIndex - 1 : totalSlides - 1;
      updateCarousel();
    });
    document.querySelector('.carousel-next')?.addEventListener('click', () => {
      slideIndex = slideIndex < totalSlides - 1 ? slideIndex + 1 : 0;
      updateCarousel();
    });
    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.querySelector('.carousel-slide').getBoundingClientRect().width);
      if (idx !== slideIndex) { slideIndex = idx; dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx)); }
    });
  }

  applyTranslations();
});
