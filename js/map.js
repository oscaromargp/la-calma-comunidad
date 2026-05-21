let leafletMap;
let markersLayer;

function initMap() {
  if (typeof L === 'undefined') { setTimeout(initMap, 500); return; }
  const container = document.getElementById('leaflet-map');
  if (!container) return;

  leafletMap = L.map('leaflet-map', { center: [24.070988, -109.998741], zoom: 13, zoomControl: true });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(leafletMap);

  const markers = {
    sports: [
      { coords: [24.070988, -109.998741], title: 'La Calma', desc: 'Punto de partida' },
      { coords: [24.083, -110.005], title: 'Zona Kitesurf', desc: 'Acceso a playa El Teso — vientos 15-30 nudos' },
      { coords: [24.075, -110.010], title: 'Mountain Bike', desc: 'Senderos en Sierra de La Laguna' }
    ],
    family: [
      { coords: [24.078, -110.001], title: 'Escuela Montessori', desc: 'Bilingüe — 5 min de La Calma' },
      { coords: [24.082, -110.008], title: 'Clínica El Sargento', desc: '7 min — atención básica y urgencias' },
      { coords: [24.142, -110.312], title: 'Hospital La Paz', desc: '35 min — especialidades' }
    ],
    dining: [
      { coords: [24.076, -110.003], title: 'Café Bar Km 0', desc: 'Desayunos y café de especialidad' },
      { coords: [24.080, -110.006], title: 'Nómada El Sargento', desc: 'Cocina de autor con vista al mar' },
      { coords: [24.073, -110.002], title: 'Mare Spa & Café', desc: 'Atardeceres y café frente al mar' }
    ]
  };

  markersLayer = L.layerGroup().addTo(leafletMap);

  function showLayer(category) {
    markersLayer.clearLayers();
    if (category === 'none') return;
    const items = markers[category] || [];
    items.forEach(m => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:var(--accent-gold,#c9a96e);color:#0a0e17;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5);">${m.title}</div>`,
        iconSize: [0, 0], iconAnchor: [0, 0]
      });
      const marker = L.marker(m.coords, { icon }).addTo(markersLayer);
      marker.bindPopup(`<b>${m.title}</b><br>${m.desc}`);
    });
  }

  window.showLayer = showLayer;

  leafletMap.invalidateSize();
  showLayer('sports');
  document.querySelectorAll('.map-btn[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showLayer(btn.getAttribute('data-layer'));
    });
  });
}

document.addEventListener('DOMContentLoaded', initMap);
