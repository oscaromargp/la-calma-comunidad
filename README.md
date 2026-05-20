# La Calma Comunidad

**Landing page premium dark mode** para desarrollo inmobiliario exclusivo de **5 lotes Estate** en La Ventana, Baja California Sur, México.

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://oscaromargp.github.io/la-calma-comunidad/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://oscaromargp.github.io/la-calma-comunidad/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://oscaromargp.github.io/la-calma-comunidad/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://oscaromargp.github.io/la-calma-comunidad/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🌐 Live Site

**→ [la-calma-comunidad.vercel.app](https://la-calma-comunidad.vercel.app)**

---

## 📋 Descripción

**La Calma Comunidad** es una landing page premium e interactiva para un desarrollo inmobiliario exclusivo de 5 lotes tipo Estate (~1,500 m² c/u) en La Ventana, BCS. Diseñada para inversionistas de alto perfil, nómadas digitales y familias que buscan eco-luxury living en Baja California Sur.

### Propuesta de Valor

| Aspecto | Descripción |
|---------|-------------|
| **Nombre** | La Calma Comunidad |
| **Sector** | Real Estate / Inmobiliario Premium |
| **Tipo** | Desarrollo exclusivo de baja densidad (H1) |
| **Ubicación** | La Ventana / El Sargento, BCS, México |
| **Lotes** | 5 unidades de ~1,500 m² |
| **Precio Base** | $85,000 USD ($56.66 USD/m²) |
| **Acceso** | Privado de 13 m de ancho |
| **Estatus Legal** | 100% Propiedad Privada (no ejidal) |

---

## 🏗️ Arquitectura Técnica

```
la-calma-comunidad/
├── index.html              # SPA principal (6 módulos + hero + footer)
├── css/
│   └── styles.css          # Dark Luxury theme (Navy + Gold)
├── js/
│   ├── translations.js     # Motor i18n ES/EN
│   ├── app.js              # Lógica principal (navbar, partículas, calculator)
│   └── map.js              # Leaflet.js + OpenStreetMap
├── images/                 # Multimedia (videos drone, fotos, planos)
│   ├── hero-drone.mp4      # Video drone hero
│   ├── hero-poster.jpg     # Poster del video
│   └── ...                 # Fotos reales del terreno
├── legal/
│   ├── privacidad.html
│   ├── cookies.html
│   └── terminos.html
└── README.md
```

### Stack Tecnológico

| Tecnología | Uso | Detalle |
|------------|-----|---------|
| **HTML5** | Estructura semántica | SPA con 6 módulos de contenido |
| **CSS3** | Dark Luxury Theme | Variables CSS, glassmorphism, animaciones @keyframes |
| **Vanilla JS** | Interactividad | Motor i18n propio, partículas, calculadora, FAQ accordion |
| **Leaflet.js** | Mapas interactivos | OpenStreetMap + CartoDB Dark Matter tiles |
| **Google Fonts** | Tipografía | Plus Jakarta Sans + Inter + JetBrains Mono |

---

## 🧩 Módulos de Contenido

### 1. Hero Section
Video drone de fondo con overlay gradiente, badge de exclusividad, title con glow dorado, CTA dual y coordenadas geográficas.

### 2. Mapa Interactivo (Leaflet + OSM)
- **5 lotes** dibujados como polígonos con popups informativos
- **3 capas toggle**: Deportes, Familia/Salud, Gastronomía
- Tile layer CartoDB Dark Matter para estética premium

### 3. Transparencia Técnica (FODA + Infraestructura)
- Reto del agua/energía → sistemas independientes
- Protección de densidad H1 → solo 5 propietarios
- Estatus legal → 100% propiedad privada
- Matriz FODA completa (4 cuadrantes)

### 4. Simulador de Inversión
Calculadora interactiva con:
- Dropdown: Villa Boutique vs Residencia Premium
- Slider: Superficie de construcción (100-800 m²)
- Outputs en tiempo real: costo terreno, construcción, total, rentas, ROI

### 5. Financiamiento Directo
- Enganche: 20% ($17,000 USD)
- Plazo: 60 meses
- Pago fijo: $1,134 USD/mes
- 3 highlight cards: sin inflación, disponibilidad inmediata, garantía contractual

### 6. FAQ Profundo
6 preguntas críticas para compradores analíticos con accordion interactivo.

---

## 🚀 Deployment

### GitHub Pages

```bash
git init
git add .
git commit -m "v2.0 — Interactive SPA with Leaflet map, i18n, and investment calculator"
git branch -M master
git remote add origin https://github.com/oscaromargp/la-calma-comunidad.git
git push -u origin master
```

Habilitar en Settings → Pages → Source: master / (root) → Save

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

Arrastrar la carpeta del proyecto a [app.netlify.com](https://app.netlify.com)

---

## 🌐 Internacionalización (i18n)

Motor de traducción ligero con Vanilla JS:
- **ES** — Español (default)
- **EN** — English

Toggle con botón en navbar. La preferencia se persiste en localStorage.

---

## ✨ Características Premium

- [x] Video drone hero con overlay gradiente
- [x] Partículas flotantes animadas (canvas)
- [x] Glassmorphism cards con hover 3D
- [x] Contadores animados (IntersectionObserver)
- [x] Reveal animations en scroll
- [x] Navbar sticky con blur al scroll
- [x] Menú móvil responsive
- [x] Mapa interactivo con 3 capas de POIs
- [x] Calculadora de inversión dinámica
- [x] FAQ accordion
- [x] i18n ES/EN propio (sin Google Translate)
- [x] Diseño 100% responsive
- [x] Open Graph tags
- [x] Páginas legales (privacidad, cookies, términos)
- [x] Optimizado para GitHub Pages (0 server-side)

---

## 📸 Capturas

| Desktop | Mobile |
|---------|--------|
| Hero + Mapa interactivo | Navegación responsive |
| Calculadora en tiempo real | FAQ accordion |

*(Agrega screenshots en `/assets/` para actualizar)*

---

## 📬 Contacto

**Asesor Comercial:** Ignacio Ibarra
- 📞 +52 (612) 105 5224
- 📧 tranquilerealestate@gmail.com

**Desarrollador:** Oscar Omar Gómez Peña
- 🌐 [bit.ly/oscaromargp](https://bit.ly/oscaromargp)
- 🐙 [@oscaromargp](https://github.com/oscaromargp)

---

## ⚖️ License

© 2026 La Calma Comunidad. Todos los derechos reservados.

---

> *"Protegiendo su vista, asegurando su futuro."* 🌅
