# La Calma Comunidad — PardeSantos

**Landing page premium dark mode v3.0** para desarrollo inmobiliario exclusivo de **5 lotes Estate** en La Ventana, Baja California Sur, México.

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://oscaromargp.github.io/la-calma-comunidad/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://oscaromargp.github.io/la-calma-comunidad/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://oscaromargp.github.io/la-calma-comunidad/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://oscaromargp.github.io/la-calma-comunidad/)
[![Google My Maps](https://img.shields.io/badge/Google_My_Maps-4285F4?style=flat&logo=googlemaps&logoColor=white)](https://www.google.com/maps)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 🌐 Live Site

**→ [oscaromargp.github.io/la-calma-comunidad](https://oscaromargp.github.io/la-calma-comunidad/)**

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
├── index.html              # SPA principal (9 módulos + hero + footer)
├── css/
│   └── styles.css          # Dark Luxury v3.0 (Navy + Gold)
├── js/
│   ├── translations.js     # Motor i18n ES/EN v3.0
│   └── app.js              # Lógica principal (navbar, partículas, simulador, financiamiento)
├── images/                 # Multimedia (videos drone, fotos reales, planos)
│   ├── hero-drone.mp4      # Video drone hero
│   ├── hero-poster.jpg     # Poster del video
│   └── *.jpg               # Fotos reales del terreno (parallax backgrounds)
├── legal/
│   ├── privacidad.html
│   ├── cookies.html
│   └── terminos.html
└── README.md
```

### Stack Tecnológico

| Tecnología | Uso | Detalle |
|------------|-----|---------|
| **HTML5** | Estructura semántica | SPA con 9 módulos de contenido |
| **CSS3** | Dark Luxury Theme | Variables CSS, glassmorphism, parallax, 3D card effects |
| **Vanilla JS** | Interactividad | Motor i18n propio, partículas, simulador, financing calc, parallax |
| **Google My Maps** | Mapa oficial de lotificación | Embed del mapa real con polígonos exactos del desarrollador |
| **Google Maps Embed** | Mapa de contexto de zona | Referencia geográfica del área La Ventana |
| **Google Fonts** | Tipografía | Plus Jakarta Sans + Inter + JetBrains Mono |

---

## 🧩 Módulos de Contenido

### 1. Hero Section
Video drone de fondo con overlay gradiente, badge de exclusividad, title con glow dorado, CTA dual y coordenadas geográficas.

### 2. Mapa Oficial (Google My Maps)
- Embed directo del mapa oficial con polígonos exactos de las 5 fracciones
- Fracción 4 y 5 disponibles (F-1, F-2, F-3 vendidas)
- Leyenda visual: disponible (dorado) / vendido (gris)
- CTA para explorar la zona con mapa de contexto Google Maps

### 3. Transparencia Técnica (FODA + Infraestructura)
- Reto del agua/energía → sistemas independientes
- Protección de densidad H1 → solo 5 propietarios
- Estatus legal → 100% propiedad privada
- Matriz FODA completa (4 cuadrantes)

### 4. Simulador de Inversión
Calculadora interactiva con:
- Dropdown: Villa Boutique vs Residencia Premium
- Slider: Superficie de construcción (50-600 m², límite H1 real)
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
git commit -m "v3.1 — Premium SPA with Google My Maps, video gallery, investment chart, MXN/USD toggle"
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

## ✨ Características Premium v3.1

- [x] Video drone hero con overlay gradiente y partículas canvas
- [x] Galería de video YouTube embeds (recorrido aéreo + entorno)
- [x] Mapa oficial Google My Maps con polígonos exactos de los 5 lotes
- [x] Guía de Estilo de Vida con calendario deportivo interactivo (imágenes reales de fondo + overlays)
- [x] Cards "Un día en La Ventana" con mood overlays personalizados por hora (warm/bright/golden/dark)
- [x] Infografía de logística familiar (distancias a servicios clave)
- [x] Sección de Prensa con tarjetas visuales + Featured Hero Card de Blue Water World Cup (estadísticas: 20 ediciones, +50 competidores, 10+ países)
- [x] Proyección de Crecimiento con timeline + bloques alternados de imagen/info (Flora, Suelo, Construcción)
- [x] Transparencia Técnica: secciones separadas (Agua, Energía, Propiedad Privada, H1) + FODA + DAFO
- [x] Calculadora de inversión con límites H1 reales (600 m² máx construcción) + gráfico donut canvas (terreno vs construcción)
- [x] Proyección multi-plataforma (Airbnb, Booking, renta mensual, venta directa)
- [x] Fuentes de referencia con enlaces a estadísticas reales
- [x] Financiamiento: tabla de pagos fija + calculadora personalizable (sliders enganche/plazo, máx 60 meses) + pago semanal + toggle MXN/USD
- [x] Tipo de cambio USD/MXN en vivo vía open.er-api.com
- [x] FAQ accordion con 7 preguntas clave
- [x] i18n ES/EN propio (sin Google Translate)
- [x] Partículas flotantes, glassmorphism, reveal animations, contadores
- [x] Navbar sticky con blur, menú móvil responsive
- [x] Diseño 100% responsive (mobile/tablet/desktop)
- [x] Open Graph tags, páginas legales
- [x] 100% client-side, optimizado para GitHub Pages

---

## 📸 Capturas

| Desktop | Mobile |
|---------|--------|
| Hero + Mapa interactivo | Navegación responsive |
| Calculadora en tiempo real | FAQ accordion |

*(Agrega screenshots en `/assets/` para actualizar)*

---

## 📬 Contacto

- 📞 +52 (612) 107 7805
- 📧 tranquilerealestate@gmail.com

**Desarrollador:** Oscar Omar Gómez Peña
- 🌐 [bit.ly/oscaromargp](https://bit.ly/oscaromargp)
- 🐙 [@oscaromargp](https://github.com/oscaromargp)

---

## ⚖️ License

© 2026 La Calma Comunidad. Todos los derechos reservados.

---

> *"Protegiendo su vista, asegurando su futuro."* 🌅
