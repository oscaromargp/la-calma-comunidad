/* ============================================================
   LA CALMA COMUNIDAD — Interactive Leaflet Map
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Center coordinates: La Calma Comunidad
  const CENTER = [24.070988, -109.998741];

  // 5 Lots approximated from the master plan
  const LOTOS = [
    { id: 1, coords: [[24.0718, -109.9998], [24.0719, -109.9984], [24.0708, -109.9983], [24.0707, -109.9997]], front: '180°', status: 'Disponible' },
    { id: 2, coords: [[24.0714, -110.0005], [24.0716, -109.9998], [24.0705, -109.9997], [24.0703, -110.0004]], front: 'Acceso Directo', status: 'Disponible' },
    { id: 3, coords: [[24.0709, -110.0012], [24.0712, -110.0005], [24.0701, -110.0004], [24.0698, -110.0011]], front: 'Central', status: 'Disponible' },
    { id: 4, coords: [[24.0704, -110.0019], [24.0707, -110.0012], [24.0696, -110.0011], [24.0693, -110.0018]], front: 'Mayor Elevación', status: 'Disponible' },
    { id: 5, coords: [[24.0699, -110.0026], [24.0702, -110.0019], [24.0691, -110.0018], [24.0688, -110.0025]], front: 'Remate', status: 'Últimas Unidades' }
  ];

  // POIs
  const POIS = {
    sports: [
      { name_es: 'Playa El Teso — Kiteboarding', name_en: 'El Teso Beach — Kiteboarding', coords: [24.0770, -109.9970], icon: '🏄', desc_es: 'Zona de despegue principal de kiteboarding y wingfoil. Temporada Nov-Abr.', desc_en: 'Main kiteboarding & wingfoil launch zone. Season Nov-Apr.' },
      { name_es: 'Isla Cerralvo — Buceo', name_en: 'Cerralvo Island — Diving', coords: [24.1300, -109.8400], icon: '🤿', desc_es: 'Arrecifes y vida marina. Buceo y pesca deportiva.', desc_en: 'Reefs and marine life. Diving and sport fishing.' },
      { name_es: 'Rutas MTB El Sargento', name_en: 'El Sargento MTB Trails', coords: [24.0650, -110.0050], icon: '🚵', desc_es: 'Senderos mundiales de mountain bike con vista al mar.', desc_en: 'World-class mountain bike trails with ocean views.' },
      { name_es: 'Paddle Board Bahía', name_en: 'Bay Paddle Board', coords: [24.0740, -109.9950], icon: '🏄‍♂️', desc_es: 'Aguas tranquilas ideales para paddle board al amanecer.', desc_en: 'Calm waters ideal for sunrise paddle boarding.' }
    ],
    family: [
      { name_es: 'Escuela Montessori La Ventana', name_en: 'La Ventana Montessori School', coords: [24.0620, -110.0010], icon: '📚', desc_es: 'Educación bilingüe comunitaria (preescolar y primaria).', desc_en: 'Community bilingual education (preschool & elementary).' },
      { name_es: 'Farmacia Local La Ventana', name_en: 'La Ventana Local Pharmacy', coords: [24.0630, -110.0000], icon: '💊', desc_es: 'Farmacia de primer contacto. Abastecimiento básico.', desc_en: 'First-contact pharmacy. Basic supplies.' },
      { name_es: 'Hospitales La Paz (35 min)', name_en: 'La Paz Hospitals (35 min)', coords: [24.1420, -110.3110], icon: '🏥', desc_es: 'Hospitales especializados de clase mundial. 35 min por carretera escénica.', desc_en: 'World-class specialty hospitals. 35 min scenic drive.' },
      { name_es: 'Aeropuerto Internacional La Paz', name_en: 'La Paz International Airport', coords: [24.0730, -110.3620], icon: '✈️', desc_es: 'Conexiones nacionales e internacionales. 45 min del desarrollo.', desc_en: 'National & international connections. 45 min from development.' }
    ],
    gastro: [
      { name_es: 'Café Bar Km 0', name_en: 'Café Bar Km 0', coords: [24.0650, -110.0030], icon: '☕', desc_es: 'Corazón social de El Sargento. Punto de encuentro de la comunidad.', desc_en: 'Social heart of El Sargento. Community gathering point.' },
      { name_es: 'Nómada El Sargento', name_en: 'Nómada El Sargento', coords: [24.0640, -110.0015], icon: '🍽️', desc_es: 'Alta cocina de la Baja. Restaurante gourmet frente al mar.', desc_en: 'Baja fine dining. Gourmet oceanfront restaurant.' },
      { name_es: 'Mare Spa & Café', name_en: 'Mare Spa & Café', coords: [24.0660, -110.0020], icon: '🧘', desc_es: 'Wellness, café orgánico y vistas panorámicas.', desc_en: 'Wellness, organic coffee and panoramic views.' }
    ]
  };

  // Initialize map
  const map = L.map('interactive-map', {
    center: CENTER,
    zoom: 14,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // Dark tile layer (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    minZoom: 10
  }).addTo(map);

  // Custom marker icons using L.divIcon
  function createMarkerIcon(color, symbol) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 36px; height: 36px;
        background: linear-gradient(135deg, #003366, #004080);
        border: 2px solid #FF9900;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(255,153,0,0.3);
        cursor: pointer;
      ">${symbol}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  // Draw lots
  const lotPolygons = [];
  LOTOS.forEach((lot, i) => {
    const polygon = L.polygon(lot.coords, {
      color: '#FF9900',
      weight: 2,
      opacity: 0.8,
      fillColor: '#003366',
      fillOpacity: 0.15,
      className: 'lot-polygon'
    }).addTo(map);

    const center = polygon.getBounds().getCenter();
    L.marker(center, {
      icon: L.divIcon({
        className: 'lot-label',
        html: `<div style="
          background: rgba(0,51,102,0.85);
          border: 1px solid #FF9900;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #FF9900;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        ">LOTE ${lot.id}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    }).addTo(map);

    const lotLabel = `Lote ${lot.id}`;
    const currentLang = localStorage.getItem('la-calma-lang') || 'es';
    const lotName = translations[currentLang]?.map?.lots?.[`l${lot.id}`] || `Lot ${lot.id}`;

    polygon.bindPopup(`
      <div style="font-size:0.85rem;">
        <strong style="color:#FF9900;">${lotName}</strong><br>
        <span style="color:#A1A1AA;">1,500 m² · ${lot.front}</span><br>
        <span style="color:#10B981;font-size:0.75rem;">${lot.status}</span>
      </div>
    `);

    polygon.on('mouseover', () => {
      polygon.setStyle({ fillOpacity: 0.35, weight: 3 });
    });
    polygon.on('mouseout', () => {
      polygon.setStyle({ fillOpacity: 0.15, weight: 2 });
    });

    lotPolygons.push(polygon);
  });

  // Fit map to show all lots with padding
  const allBounds = L.latLngBounds(LOTOS[0].coords);
  LOTOS.forEach(lot => lot.coords.forEach(c => allBounds.extend(c)));
  map.fitBounds(allBounds, { padding: [60, 60] });

  // POI Layers
  let activePois = [];

  function addPois(category) {
    clearPois();
    const pois = POIS[category];
    if (!pois) return;
    const currentLang = localStorage.getItem('la-calma-lang') || 'es';

    pois.forEach(p => {
      const name = currentLang === 'es' ? p.name_es : p.name_en;
      const desc = currentLang === 'es' ? p.desc_es : p.desc_en;
      const marker = L.marker(p.coords, {
        icon: createMarkerIcon('#FF9900', p.icon)
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-size:0.85rem;">
          <strong style="color:#FF9900;">${name}</strong><br>
          <span style="color:#A1A1AA;">${desc}</span>
        </div>
      `);
      activePois.push(marker);
    });

    // Re-fit to show lots + POIs
    const bounds = L.latLngBounds(allBounds);
    pois.forEach(p => bounds.extend(p.coords));
    map.fitBounds(bounds, { padding: [60, 60] });
  }

  function clearPois() {
    activePois.forEach(m => map.removeLayer(m));
    activePois = [];
  }

  // Layer toggle buttons
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
        const currentLang = localStorage.getItem('la-calma-lang') || 'es';
        const descKey = `map.${layer}_desc`;
        const desc = translations[currentLang]?.map?.[`${layer}_desc`];
        document.getElementById('map-layer-desc').textContent = desc || '';
      }
    });
  });

  // Re-add POIs after language change
  const origToggleLang = window.toggleLang;
  window.toggleLang = function() {
    if (origToggleLang) origToggleLang();
    const activeBtn = document.querySelector('.map-layer-btn.active');
    if (activeBtn) {
      const layer = activeBtn.getAttribute('data-layer');
      if (layer !== 'lots') {
        clearPois();
        addPois(layer);
      }
      const currentLang = localStorage.getItem('la-calma-lang') || 'es';
      const desc = translations[currentLang]?.map?.[`${layer}_desc`];
      document.getElementById('map-layer-desc').textContent = desc || '';
    }
  };

  // Listen for lang changes from translations
  document.addEventListener('langChange', (e) => {
    const activeBtn = document.querySelector('.map-layer-btn.active');
    if (activeBtn) {
      const layer = activeBtn.getAttribute('data-layer');
      if (layer !== 'lots') {
        clearPois();
        addPois(layer);
      }
    }
  });
});
