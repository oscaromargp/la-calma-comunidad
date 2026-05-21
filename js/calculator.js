document.addEventListener('DOMContentLoaded', () => {
  const LAND_PRICE = 85000;
  const COST_STANDARD = 1150;
  const COST_LUXURY = 1600;
  const H1_MAX = 600;

  const surfaceSlider = document.getElementById('calc-surface');
  const surfaceDisplay = document.getElementById('calc-surface-display');
  const projectSelect = document.getElementById('calc-project');
  const totalDisplay = document.getElementById('calc-total');
  const landDisplay = document.getElementById('calc-land');
  const buildDisplay = document.getElementById('calc-build');
  const costM2Display = document.getElementById('calc-cost-m2');
  const unitToggle = document.getElementById('calc-unit-toggle');

  let unit = 'm2'; // m2 or sqft

  function updateCalculator() {
    const projectType = projectSelect.value;
    const surfaceM2 = Math.min(parseInt(surfaceSlider.value), H1_MAX);
    const surface = unit === 'sqft' ? Math.round(surfaceM2 * 10.764) : surfaceM2;
    const costPerM2 = projectType === 'villa' ? COST_STANDARD : COST_LUXURY;
    const buildCost = costPerM2 * surfaceM2;
    const total = LAND_PRICE + buildCost;

    const cl = window.__lang ? window.__lang() : 'es';
    const unitLabel = cl === 'es'
      ? (unit === 'm2' ? 'm² construidos (límite H1)' : 'sqft construidos (límite H1)')
      : (unit === 'm2' ? 'm² built (H1 limit)' : 'sqft built (H1 limit)');

    if (surfaceDisplay) {
      surfaceDisplay.innerHTML = surface.toLocaleString() + ` <span class="unit">${unitLabel}</span>`;
    }

    if (landDisplay) landDisplay.textContent = '$' + LAND_PRICE.toLocaleString() + ' USD';
    if (buildDisplay) buildDisplay.textContent = '$' + buildCost.toLocaleString() + ' USD';
    if (totalDisplay) totalDisplay.textContent = '$' + total.toLocaleString() + ' USD';
    if (costM2Display) costM2Display.textContent = '$' + costPerM2.toLocaleString() + ' USD/m²';
  }

  if (surfaceSlider) surfaceSlider.addEventListener('input', updateCalculator);
  if (projectSelect) projectSelect.addEventListener('change', updateCalculator);

  if (unitToggle) {
    unitToggle.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        unitToggle.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        unit = btn.getAttribute('data-unit');
        updateCalculator();
      });
    });
  }

  window.updateCalculator = updateCalculator;
  updateCalculator();
});
