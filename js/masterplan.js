const LOT_SVG = `<svg viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- Background -->
  <rect width="800" height="560" fill="#1a1f2e" rx="16"/>
  <!-- Title -->
  <text x="400" y="32" text-anchor="middle" font-family="Playfair Display, serif" font-size="16" font-weight="700" fill="#f0f0f0">Masterplan — La Calma Comunidad</text>
  <!-- Access road -->
  <rect x="330" y="40" width="140" height="380" class="access-road" rx="2"/>
  <text x="400" y="230" class="access-label" transform="rotate(-90,400,230)">ACCESO PRIVADO 13m</text>
  <!-- Lot 1 - Sold -->
  <rect class="lot sold" x="160" y="60" width="160" height="160" rx="4" data-lot="1"/>
  <text x="240" y="125" class="lot-label"></text>
  <text x="240" y="140" class="lot-detail">44m × 34m · 1,500 m²</text>
  <text x="240" y="155" class="lot-detail" data-i18n="masterplan.lot_1"></text>
  <!-- Lot 2 - Sold -->
  <rect class="lot sold" x="480" y="60" width="160" height="160" rx="4" data-lot="2"/>
  <text x="560" y="125" class="lot-label"></text>
  <text x="560" y="140" class="lot-detail">44m × 34m · 1,500 m²</text>
  <text x="560" y="155" class="lot-detail" data-i18n="masterplan.lot_2"></text>
  <!-- Lot 3 - Sold -->
  <rect class="lot sold" x="160" y="240" width="160" height="160" rx="4" data-lot="3"/>
  <text x="240" y="305" class="lot-label"></text>
  <text x="240" y="320" class="lot-detail">44m × 34m · 1,500 m²</text>
  <text x="240" y="335" class="lot-detail" data-i18n="masterplan.lot_3"></text>
  <!-- Lot 4 - Available -->
  <rect class="lot available" x="480" y="240" width="160" height="160" rx="4" data-lot="4"/>
  <text x="560" y="305" class="lot-label" data-i18n="masterplan.lot_4"></text>
  <text x="560" y="320" class="lot-detail">44m × 34m · 1,500 m²</text>
  <text x="560" y="335" class="lot-detail" data-i18n="masterplan.dimension"></text>
  <!-- Lot 5 - Available Premium -->
  <rect class="lot premium" x="480" y="420" width="160" height="100" rx="4" data-lot="5"/>
  <text x="560" y="462" class="lot-label" data-i18n="masterplan.lot_5"></text>
  <text x="560" y="478" class="lot-detail">44m × 34m · 1,505.37 m²</text>
  <!-- Lot 5 annotation -->
  <text x="660" y="470" font-size="9" fill="#7CB342" font-family="Inter, sans-serif">+5.37 m² gratis</text>
  <line x1="648" y1="468" x2="640" y2="470" stroke="#7CB342" stroke-width="1.5"/>
  <!-- North arrow -->
  <g transform="translate(720,52)">
    <polygon points="0,24 8,0 16,24" fill="#c9a96e"/>
    <text x="8" y="34" text-anchor="middle" font-size="9" fill="#c9a96e" font-weight="700">N</text>
  </g>
</svg>`;

let currentLangForSVG = 'es';

function renderSVG() {
  const container = document.getElementById('svg-masterplan-container');
  if (!container) return;
  container.innerHTML = LOT_SVG;

  document.querySelectorAll('#svg-masterplan-container .lot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const lot = el.getAttribute('data-lot');
      const tooltip = document.getElementById('lot-tooltip');
      if (tooltip && lot === '5') {
        tooltip.textContent = t('masterplan.lot_5_tooltip');
        tooltip.style.display = 'block';
      }
    });
    el.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('lot-tooltip');
      if (tooltip) tooltip.style.display = 'none';
    });
  });
}

function updateSVGLabels() {
  document.querySelectorAll('#svg-masterplan-container [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text && text !== key) el.textContent = text;
  });
  document.querySelectorAll('#svg-masterplan-container .lot-label').forEach(el => {
    const lot = el.closest('.lot');
    if (!lot) return;
    const n = lot.getAttribute('data-lot');
    if (n === '1' || n === '2' || n === '3') el.textContent = translations[currentLang].masterplan.lot_1.replace('1 —','').replace('2 —','').replace('3 —','');
  });
}

window.updateSVGLabels = updateSVGLabels;

document.addEventListener('DOMContentLoaded', () => {
  renderSVG();
  setTimeout(updateSVGLabels, 100);
});
