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
  const buildRefDisplay = document.getElementById('calc-build-ref');
  const unitToggle = document.getElementById('calc-unit-toggle');
  let unit = 'm2';
  let chartRendered = false;

  function drawDonutChart(landCost, buildCost) {
    const container = document.getElementById('investment-chart-d3');
    if (!container) return;
    if (typeof d3 === 'undefined') { setTimeout(() => drawDonutChart(landCost, buildCost), 500); return; }

    container.innerHTML = '';

    const width = 320, height = 280;
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius * 0.55;

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', 'auto')
      .style('max-height', '280px')
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    const data = [
      { name: window.__lang ? (window.__lang() === 'es' ? 'Terreno' : 'Land') : 'Land', value: landCost },
      { name: window.__lang ? (window.__lang() === 'es' ? 'Construcción' : 'Construction') : 'Construction', value: buildCost }
    ];
    const total = landCost + buildCost;
    const colors = ['#c9a96e', '#1a3a5c'];

    const pie = d3.pie().value(d => d.value).padAngle(0.02);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(6);
    const arcHover = d3.arc().innerRadius(innerRadius).outerRadius(radius + 8).cornerRadius(6);
    const outerArc = d3.arc().innerRadius(radius * 0.85).outerRadius(radius * 0.85);

    const slices = svg.selectAll('.slice')
      .data(pie(data))
      .enter().append('g').attr('class', 'slice');

    slices.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i])
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease')
      .style('cursor', 'pointer')
      .on('mouseenter', function() { d3.select(this).transition().duration(300).attr('d', arcHover); })
      .on('mouseleave', function() { d3.select(this).transition().duration(300).attr('d', arc); });

    // Center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('fill', '#f0f0f0')
      .style('font-family', 'Inter, sans-serif')
      .text('$' + d3.format(',')(total));

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '10px')
      .style('fill', '#94a3b8')
      .style('font-family', 'Inter, sans-serif')
      .text(window.__lang && window.__lang() === 'es' ? 'Inversión Total' : 'Total Investment');

    // Legend
    const legendG = svg.append('g').attr('transform', `translate(${-width/2 + 20},${height/2 - 20})`);
    data.forEach((d, i) => {
      const g = legendG.append('g').attr('transform', `translate(0, ${i * 22})`);
      g.append('rect').attr('width', 12).attr('height', 12).attr('rx', 3).attr('fill', colors[i]);
      g.append('text')
        .attr('x', 18).attr('y', 10)
        .style('font-size', '11px').style('fill', '#94a3b8').style('font-family', 'Inter, sans-serif')
        .text(d.name + ' (' + Math.round(d.value / total * 100) + '%)');
    });

    // Labels on slices (only if slice is big enough)
    slices.append('text')
      .attr('transform', d => { const c = outerArc.centroid(d); return `translate(${c[0]},${c[1]})`; })
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .text(d => Math.round(d.data.value / total * 100) + '%')
      .attr('opacity', d => {
        const angle = (d.endAngle - d.startAngle) * 180 / Math.PI;
        return angle > 30 ? 1 : 0;
      });
  }

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

    if (surfaceDisplay) surfaceDisplay.innerHTML = surface.toLocaleString() + ` <span style="font-size:0.8rem;color:var(--text-tertiary);font-weight:400;">${unitLabel}</span>`;
    if (landDisplay) landDisplay.textContent = '$' + LAND_PRICE.toLocaleString() + ' USD';
    if (buildDisplay) buildDisplay.textContent = '$' + buildCost.toLocaleString() + ' USD';
    if (buildRefDisplay) buildRefDisplay.textContent = '$' + buildCost.toLocaleString() + ' USD';
    if (totalDisplay) totalDisplay.textContent = '$' + total.toLocaleString() + ' USD';
    if (costM2Display) costM2Display.textContent = '$' + costPerM2.toLocaleString() + ' USD/m²';

    drawDonutChart(LAND_PRICE, buildCost);
    chartRendered = true;
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
