/* La Calma Comunidad — Leaflet Map v2.0 */

document.addEventListener('DOMContentLoaded', () => {
  const CENTER = [24.070988, -109.998741];

  // 5 fractions — only 4 & 5 available
  const LOTES = [
    { id: 1, frac: 'F-1', coords: [[24.0718,-109.9998],[24.0719,-109.9984],[24.0708,-109.9983],[24.0707,-109.9997]], status: 'sold' },
    { id: 2, frac: 'F-2', coords: [[24.0714,-110.0005],[24.0716,-109.9998],[24.0705,-109.9997],[24.0703,-110.0004]], status: 'sold' },
    { id: 3, frac: 'F-3', coords: [[24.0709,-110.0012],[24.0712,-110.0005],[24.0701,-110.0004],[24.0698,-110.0011]], status: 'sold' },
    { id: 4, frac: 'F-4', coords: [[24.0704,-110.0019],[24.0707,-110.0012],[24.0696,-110.0011],[24.0693,-110.0018]], status: 'available' },
    { id: 5, frac: 'F-5', coords: [[24.0699,-110.0026],[24.0702,-110.0019],[24.0691,-110.0018],[24.0688,-110.0025]], status: 'available' }
  ];

  // POIs
  const POIS = {
    sports: [
      { name_es: 'Playa El Teso — Kiteboarding', name_en: 'El Teso Beach — Kiteboarding', coords: [24.0770,-109.9970], icon: '🏄', desc_es: 'Zona de despegue principal. Escuelas de kite, renta de equipo.', desc_en: 'Main launch zone. Kite schools, gear rental.' },
      { name_es: 'Isla Cerralvo — Buceo', name_en: 'Cerralvo Island — Diving', coords: [24.1300,-109.8400], icon: '🤿', desc_es: 'Arrecifes, vida marina. Buceo, snorkel, pesca deportiva.', desc_en: 'Reefs, marine life. Diving, snorkel, sport fishing.' },
      { name_es: 'Rutas MTB El Sargento', name_en: 'El Sargento MTB Trails', coords: [24.0650,-110.0050], icon: '🚵', desc_es: 'Senderos mundiales de MTB. Don Diablo Trail Run, El Reto Baja.', desc_en: 'World-class MTB trails. Don Diablo Trail Run, El Reto Baja.' },
      { name_es: 'Lighthouse 1000 Race', name_en: 'Lighthouse 1000 Race', coords: [24.0750,-109.9980], icon: '🏁', desc_es: 'Competencia internacional de kite/wing/windsurf (Ene-Feb).', desc_en: 'Intl kite/wing/windsurf competition (Jan-Feb).' }
    ],
    family: [
      { name_es: 'Escuela Montessori La Ventana', name_en: 'La Ventana Montessori School', coords: [24.0620,-110.0010], icon: '📚', desc_es: 'Educación bilingüe preescolar y primaria.', desc_en: 'Bilingual preschool & elementary education.' },
      { name_es: 'Farmacia La Ventana', name_en: 'La Ventana Pharmacy', coords: [24.0630,-110.0000], icon: '💊', desc_es: 'Farmacia de primer contacto.', desc_en: 'First-contact pharmacy.' },
      { name_es: 'Hospitales La Paz (35 min)', name_en: 'La Paz Hospitals (35 min)', coords: [24.1420,-110.3110], icon: '🏥', desc_es: 'Hospitales especializados de clase mundial.', desc_en: 'World-class specialty hospitals.' },
      { name_es: 'Aeropuerto Intl La Paz (LAP)', name_en: 'La Paz Intl Airport (LAP)', coords: [24.0730,-110.3620], icon: '✈️', desc_es: 'Crecimiento 10.9% anual. Vuelos directos nacionales e internacionales.', desc_en: '10.9% annual growth. Direct national & intl flights.' }
    ],
    gastro: [
      { name_es: 'Café Bar Km 0', name_en: 'Café Bar Km 0', coords: [24.0650,-110.0030], icon: '☕', desc_es: 'Corazón social de El Sargento. Punto de encuentro.', desc_en: 'Social heart of El Sargento. Meeting point.' },
      { name_es: 'Nómada El Sargento', name_en: 'Nómada El Sargento', coords: [24.0640,-110.0015], icon: '🍽️', desc_es: 'Alta cocina de la Baja frente al mar.', desc_en: 'Baja fine dining oceanfront.' },
      { name_es: 'Mare Spa & Café', name_en: 'Mare Spa & Café', coords: [24.0660,-110.0020], icon: '🧘', desc_es: 'Wellness, café orgánico, vistas panorámicas.', desc_en: 'Wellness, organic coffee, panoramic views.' }
    ]
  };

  const map = L.map('interactive-map', {
    center: CENTER, zoom: 14, zoomControl: true, scrollWheelZoom: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM | CARTO',
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  function getLotStyle(status) {
    if (status === 'available') return {
      color: '#FF9900', weight: 3, opacity: 0.9,
      fillColor: '#FF9900', fillOpacity: 0.15,
      dashArray: null
    };
    return {
      color: '#6B7280', weight: 2, opacity: 0.4,
      fillColor: '#374151', fillOpacity: 0.08,
      dashArray: '6,4'
    };
  }

  const allBounds = L.latLngBounds([]);
  const lotPolygons = [];

  LOTES.forEach((lot) => {
    lot.coords.forEach(c => allBounds.extend(c));
    const style = getLotStyle(lot.status);
    const polygon = L.polygon(lot.coords, style).addTo(map);
    lotPolygons.push(polygon);

    const isAvailable = lot.status === 'available';

    // Center label
    const center = polygon.getBounds().getCenter();
    L.marker(center, {
      icon: L.divIcon({
        className: 'lot-label',
        html: `<div style="
          background: ${isAvailable ? 'rgba(0,51,102,0.9)' : 'rgba(55,65,81,0.7)'};
          border: 1px solid ${isAvailable ? '#FF9900' : '#6B7280'};
          border-radius: 8px; padding: 4px 8px;
          font-size: 0.65rem; font-weight: 700;
          color: ${isAvailable ? '#FF9900' : '#9CA3AF'};
          font-family: 'Inter', sans-serif; white-space: nowrap;
          backdrop-filter: blur(4px);
        ">${lot.frac} ${isAvailable ? '✓' : '✕'}</div>`,
        iconSize: [0, 0], iconAnchor: [0, 0]
      })
    }).addTo(map);

    const statusText = isAvailable ? 'DISPONIBLE / AVAILABLE' : 'VENDIDO / SOLD';
    const statusColor = isAvailable ? '#10B981' : '#EF4444';
    const lotName = `Fracción ${lot.id}`;

    polygon.bindPopup(`
      <div style="font-size:0.85rem;">
        <strong style="color:${isAvailable ? '#FF9900' : '#9CA3AF'};">${lotName}</strong><br>
        <span style="color:#A1A1AA;">1,500 m²</span><br>
        <span style="color:${statusColor};font-weight:700;font-size:0.75rem;">${statusText}</span>
      </div>
    `);

    polygon.on('mouseover', () => {
      if (isAvailable) polygon.setStyle({ fillOpacity: 0.35, weight: 4 });
      else polygon.setStyle({ fillOpacity: 0.15, weight: 3 });
    });
    polygon.on('mouseout', () => {
      polygon.setStyle(getLotStyle(lot.status));
    });
  });

  map.fitBounds(allBounds, { padding: [60, 60] });

  // POIs
  let activePois = [];
  function createMarkerIcon(symbol) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="width:36px;height:36px;background:linear-gradient(135deg,#003366,#004080);border:2px solid #FF9900;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(255,153,0,0.3);cursor:pointer;">${symbol}</div>`,
      iconSize: [36,36], iconAnchor: [18,18], popupAnchor: [0,-20]
    });
  }

  function addPois(category) {
    clearPois();
    const pois = POIS[category];
    if (!pois) return;
    const lang = localStorage.getItem('la-calma-lang') || 'es';
    pois.forEach(p => {
      const name = lang === 'es' ? p.name_es : p.name_en;
      const desc = lang === 'es' ? p.desc_es : p.desc_en;
      const marker = L.marker(p.coords, { icon: createMarkerIcon(p.icon) }).addTo(map);
      marker.bindPopup(`<div style="font-size:0.85rem;"><strong style="color:#FF9900;">${name}</strong><br><span style="color:#A1A1AA;">${desc}</span></div>`);
      activePois.push(marker);
    });
    const bounds = L.latLngBounds(allBounds);
    pois.forEach(p => bounds.extend(p.coords));
    map.fitBounds(bounds, { padding: [60, 60] });
  }

  function clearPois() {
    activePois.forEach(m => map.removeLayer(m));
    activePois = [];
  }

  document.querySelectorAll('.map-layer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.getAttribute('data-layer');
      if (layer === 'lots') {
        clearPois();
        map.fitBounds(allBounds, { padding: [60, 60] });
        document.getElementById('map-layer-desc').textContent = '';
      } else {
        addPois(layer);
        const lang = localStorage.getItem('la-calma-lang') || 'es';
        const desc = translations[lang]?.area_guide?.[`${layer}_desc`] || '';
        document.getElementById('map-layer-desc').textContent = desc;
      }
    });
  });

  // Lang change hook
  const origToggle = window.toggleLang;
  window.toggleLang = function() {
    if (origToggle) origToggle();
    const activeBtn = document.querySelector('.map-layer-btn.active');
    if (activeBtn) {
      const layer = activeBtn.getAttribute('data-layer');
      if (layer !== 'lots') {
        clearPois(); addPois(layer);
      }
    }
  };
});
