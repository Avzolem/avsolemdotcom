# STATUS.md - Project Status Tracker

> Este archivo centraliza el estado de todos los proyectos dentro de avsolem.com.
> Claude Code debe leer este archivo al inicio de cada sesión para entender el contexto.

**Última actualización global**: 2026-05-01

---

## Quick Reference - Projects Status

| Proyecto | Ruta | Estado | Última Actualización |
|----------|------|--------|----------------------|
| Portfolio Principal | `/` | Production | 2025-01-06 |
| CV / Resume | `/cv` | Production | 2025-01-17 |
| Cloud Storage | `/cloud` | Production | 2025-01-06 |
| Yu-Gi-Oh! Manager | `/yugioh` | Production | 2026-03-18 |
| Pokémon TCG Manager | `/pokemon` | Production | 2026-02-28 |
| Magic: The Gathering Manager | `/magic` | Production | 2026-03-03 |
| ROMS Index | `/roms` | Production | 2025-11-24 |
| Diablo Web | `/diablo` | Production | 2025-01-09 |
| ASCII Studio | `/ascii` | Production | 2026-05-01 |

---

## Projects Detail

### 1. Cloudsolem - Personal Cloud Storage (`/cloud`)

**Estado**: Production Ready
**Última sesión**: 2025-01-06
**Portfolio entry**: `src/app/work/projects/cloudsolem-storage.mdx`

#### Features Implementados
- [x] Autenticación con password (cookie-based)
- [x] Upload de archivos (drag-drop, progress tracking)
- [x] Video streaming directo (Cloudinary)
- [x] Sistema de carpetas (tree navigation, breadcrumbs)
- [x] Renombrar y eliminar archivos
- [x] Toast notifications para todas las acciones
- [x] Quota de almacenamiento visible
- [x] Mobile responsive (2-column grid)
- [x] Click-outside para cerrar menús
- [x] Copiar enlace directo de archivos
- [x] Lite version para navegadores legacy (PSP, 3DS, Vita)

#### Stack Técnico
- Frontend: Next.js 15, React 19, SCSS
- Storage: Cloudinary (25GB free tier)
- Database: MongoDB (`cloud_files`, `cloud_folders`)
- Auth: Cookie-based session

#### Estructura de Archivos
```
src/app/cloud/
├── layout.tsx, cloud-theme.scss
├── (main)/ - Dashboard principal con auth
│   ├── page.tsx - File grid, folder system
│   └── stream/[fileId]/page.tsx - Video player
└── lite/ - Version para browsers legacy
```

#### Pendiente / Ideas Futuras
- [ ] Compartir carpetas públicamente
- [ ] Thumbnails para más tipos de archivos
- [ ] Búsqueda de archivos

---

### 2. CV / Resume (`/cv`)

**Estado**: Production Ready
**Última sesión**: 2025-01-17

#### Features Implementados
- [x] Diseño profesional tamaño carta (8.5x11")
- [x] Soporte bilingüe completo (EN/ES)
- [x] Toggle de idioma en tiempo real
- [x] Toggle de tema (light/dark)
- [x] Estilos de impresión optimizados para Edge/Chrome
- [x] PDF de 1 sola página
- [x] Foto de perfil circular con borde cyan
- [x] Sidebar con contacto, idiomas y skills
- [x] Sección principal con experiencia y educación
- [x] Fechas en línea con títulos (diseño compacto)
- [x] Bullets cyan en listas
- [x] Controles flotantes estilo liquid glass
- [x] Botón "Download CV" en página /about

#### Stack Técnico
- Frontend: Next.js 15, React 19, Tailwind CSS
- Print: CSS @media print optimizado
- Iconos: Lucide React

#### Estructura de Archivos
```
src/app/cv/
├── page.tsx - Componente principal con datos bilingües
└── print.css - Estilos de impresión completos
```

#### Notas
- Para imprimir correctamente en Edge: márgenes ninguno, sin encabezados/pie, gráficos de fondo activado
- Los datos del CV están hardcodeados en page.tsx para ambos idiomas

---

### 3. Yu-Gi-Oh! Manager (`/yugioh`)

**Estado**: Production Ready
**Última sesión**: 2026-03-18
**Portfolio entry**: `src/app/work/projects/yugioh-manager.mdx`

#### Features Implementados
- [x] Búsqueda de cartas por nombre (debounce 500ms, 300ms para Set Codes)
- [x] Detección temprana de Set Code (búsqueda inicia con 4 caracteres)
- [x] Input de búsqueda auto-uppercase
- [x] Scanner de cartas con cámara (Dual-mode: Set Code + Nombre)
- [x] Filtros avanzados (30 tipos, atributos, niveles, ATK/DEF)
- [x] 3 listas: Colección, En Venta, Wishlist
- [x] Sistema de autenticación (Google OAuth + Email/Password)
- [x] Colecciones personales por usuario
- [x] Toggle "Poner en venta" con sync bidireccional
- [x] Estadísticas de precios con gráficas
- [x] Export CSV y PDF
- [x] Compartir listas (enlaces temporales 7 días)
- [x] Panel de administración con CMS
- [x] Catálogo de productos (`/yugioh/catalogo`)
- [x] Sistema de noticias (`/yugioh/noticias`)
- [x] i18n completo (ES/EN)
- [x] Colores oficiales Yu-Gi-Oh! por tipo/atributo
- [x] Multi-language set codes con fallback a EN (soporta sufijos alfanuméricos como SPK27→ENK27)
- [x] Deck Builder MVP (Main/Extra/Side zones, límite 3 decks)
- [x] Búsqueda integrada en deck builder con auto-zone detection
- [x] Validación en tiempo real (límites de zonas, máx 3 copias)
- [x] Estadísticas de deck (curva de niveles, distribución tipo/atributo)
- [x] Export PDF formato torneo KDE oficial (con logos Konami/Yu-Gi-Oh!)
- [x] Enlace home en copyright del footer

#### Stack Técnico
- Frontend: Next.js 15, React 19, SCSS Modules
- API: YGOPRODeck API v7, YugiohPrices API
- Database: MongoDB
- Auth: NextAuth.js 4 (Google OAuth + Credentials)
- OCR: Tesseract.js v5
- Fuzzy Search: Fuse.js
- PDF Export: jsPDF (KDE tournament format)

#### Estructura de Archivos
```
src/app/yugioh/
├── page.tsx - Búsqueda principal
├── layout.tsx - Layout con providers
├── coleccion/, venta/, wishlist/ - Listas
├── catalogo/, noticias/ - CMS público
├── admin/ - Panel de administración
├── shared/[token]/ - Listas compartidas
├── decks/ - Lista de decks del usuario
├── decks/[deckId]/ - Editor de deck
└── perfil/ - Perfil de usuario

src/components/yugioh/
├── CardSearch, CardDisplay, CardList
├── CardScanner, AdvancedFilters
├── ExportButtons, PriceStats, ShareButton
├── DeckBuilder, DeckList, DeckStats
├── YugiohHeader, YugiohFooter, AuthModal
└── Toast, ToastContainer
```

#### Variables de Entorno Requeridas
```
MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
YUGIOH_ADMIN_EMAILS (separados por coma)
RESEND_API_KEY (opcional, para emails)
```

#### Pendiente / Ideas Futuras
- [ ] Historial de precios (tracking temporal)
- [ ] Modo offline (PWA)
- [ ] Import masivo desde CSV

---

### 4. Magic: The Gathering Manager (`/magic`)

**Estado**: Production Ready
**Última sesión**: 2026-03-03
**Portfolio entry**: `src/app/work/projects/magic-manager.mdx`

#### Features Implementados
- [x] Búsqueda de cartas via Scryfall API (fuzzy search, autocomplete)
- [x] Filtros avanzados (colores WUBRG, tipo, CMC range, rareza, formato)
- [x] 3 listas: Colección, En Venta, Wishlist
- [x] Sistema de autenticación (Google OAuth + Email/Password, compartido con Pokemon/Yu-Gi-Oh)
- [x] Colecciones personales por usuario
- [x] Toggle "Poner en venta" con sync bidireccional
- [x] Precios de Scryfall (USD, USD foil, EUR)
- [x] Export CSV y PDF
- [x] Compartir listas (enlaces temporales 7 días)
- [x] Panel de administración con CMS
- [x] Catálogo de productos (`/magic/catalogo`)
- [x] Sistema de noticias (`/magic/noticias`)
- [x] i18n completo (ES/EN)
- [x] Soporte double-faced cards (flip button)
- [x] Mana cost symbols con colores WUBRG
- [x] Oracle text, Power/Toughness, Loyalty display
- [x] Format legalities display
- [x] Deck Builder (60+ main, 15 sideboard, max 4 copies, basic lands ilimitados)
- [x] Deck stats (mana curve, color distribution, type distribution, average CMC)
- [x] Export PDF formato torneo con branding MTG
- [x] Scanner OCR de cartas (cámara + upload)
- [x] Ordenamiento por nombre, precio, CMC, color

#### Stack Técnico
- Frontend: Next.js 15, React 19, SCSS Modules
- API: Scryfall API (no API key, 100ms rate limit)
- Database: MongoDB (`magic_lists`, `magic_decks`, `magic_news`, `magic_products`, `magic_shared_links`)
- Auth: NextAuth.js 4 (shared session with Pokemon/Yu-Gi-Oh)
- OCR: Tesseract.js v5
- PDF Export: jsPDF (tournament format)
- Color scheme: Orange (#E8611A) accents, Gold (#D4AF37) text, neutral black/gray backgrounds

#### Estructura de Archivos
```
src/app/magic/
├── page.tsx - Búsqueda principal
├── layout.tsx - Layout con providers
├── magic-theme.scss - Theme global (orange/gold/mana colors)
├── coleccion/, venta/, wishlist/ - Listas
├── catalogo/, noticias/ - CMS público
├── admin/ - Panel de administración
├── shared/[token]/ - Listas compartidas
├── decks/ - Lista de decks del usuario
├── decks/[deckId]/ - Editor de deck
└── perfil/ - Perfil de usuario

src/components/magic/
├── CardSearch, CardDisplay, CardList
├── CardScanner, AdvancedFilters
├── ExportButtons, PriceStats, ShareButton
├── DeckBuilder, DeckList, DeckStats
├── MagicHeader, MagicFooter, AuthModal
└── Toast, ToastContainer
```

#### Variables de Entorno Requeridas
```
MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
MAGIC_ADMIN_EMAILS (separados por coma)
RESEND_API_KEY (opcional, para emails)
```

#### Pendiente / Ideas Futuras
- [ ] Historial de precios (tracking temporal)
- [ ] Modo offline (PWA)
- [ ] Import masivo desde CSV

---

### 5. ROMS Index (`/roms`)

**Estado**: Production Ready
**Última sesión**: 2025-11-24
**Portfolio entry**: `src/app/work/projects/roms-index.mdx`

#### Features Implementados
- [x] 23 consolas organizadas por fabricante
- [x] Nintendo (13), Sony (6), Microsoft (2), Sega (2)
- [x] Links a Myrient (ROM preservation database)
- [x] Sección de Fan Translations (TraduSquare)
- [x] Diseño standalone (sin Header/Footer)
- [x] Mobile responsive
- [x] Lazy loading de imágenes

#### Stack Técnico
- Frontend: Next.js 15, SCSS Modules
- Images: PNG optimizados por Next/Image
- Links: External (Myrient, RomsLab, RomsFun)

#### Estructura de Archivos
```
src/app/roms/
├── page.tsx - 23 consoles + fan translate
├── layout.tsx - Metadata
└── roms.module.scss - Estilos completos

public/images/consoles/ - 29 imágenes de consolas
```

#### Pendiente / Ideas Futuras
- [ ] Búsqueda/filtro de consolas
- [ ] Contador de juegos por consola
- [ ] Favoritos (localStorage)

---

### 6. Diablo Web (`/diablo`)

**Estado**: Production Ready
**Última sesión**: 2025-01-09
**Portfolio entry**: `src/app/work/projects/diablo-web.mdx`

#### Features Implementados
- [x] DiabloWeb iframe (WebAssembly port)
- [x] Dark theme con estética Diablo
- [x] Header con logo oficial de Diablo
- [x] Fuente Cinzel Decorative (estilo medieval)
- [x] Controles: fullscreen, mute, info, home
- [x] Modal informativo (controles, shareware vs full)
- [x] Branding "Powered by Avsolem"
- [x] Icono en footer (GiDevilMask)
- [x] Portfolio entry con 3 imágenes
- [x] Metadata SEO

#### Stack Técnico
- Frontend: Next.js 15, React, Tailwind CSS
- Game: DiabloWeb (d07RiV) via iframe
- Engine: DevilutionX compiled to WebAssembly
- Font: Cinzel Decorative (Google Fonts)

#### Estructura de Archivos
```
src/app/diablo/
├── page.tsx - Game iframe + UI con logo y controles
└── layout.tsx - Metadata + Cinzel Decorative font

public/images/
├── diablo-logo.webp - Logo oficial de Diablo
└── projects/diablo/
    ├── 01-cover.webp - Portada icónica
    ├── 02-gameplay.webp - Screenshot gameplay
    └── 03-screenshot.webp - Screenshot oficial Blizzard
```

#### Notas
- Shareware version disponible gratis
- Full game requiere DIABDAT.MPQ del usuario
- Saves persisten en browser storage

---

### 7. ASCII Studio (`/ascii`)

**Estado**: Production Ready
**Última sesión**: 2026-05-01
**Portfolio entry**: `src/app/work/projects/ascii-studio.mdx`

#### Features Implementados
- [x] Pipeline imagen → ASCII (drop, paste, upload)
- [x] Dithering: Floyd–Steinberg, Bayer 4×4, Bayer 8×8, threshold
- [x] 4 charsets (standard, dense, sparse, halftone)
- [x] 11 art styles (Classic, Halftone, Dither, Braille, Dot Screen, Dot Cross, Line, Particles, Alphabet, Retro, Terminal)
- [x] 9 templates editoriales (avsolem, Aurelia, Solar, Console, Hyperflux, Daily Press, Verdura, Stellar, Persimmon)
- [x] 9 modos FX animados (Noise Field, Waves, Cycle, Intervals, Beam, Glitch, CRT, Matrix Rain, none)
- [x] Sliders: brightness, contrast, dither strength, opacity, FX strength/speed/scale
- [x] Direction picker para FX (↑↓←→)
- [x] 6 color modes: Template, Grayscale, Full Color, Matrix, Amber, Custom (hex picker)
- [x] FPS counter en vivo (verde/ámbar/rojo)
- [x] Aspect ratios: 16:9, 4:3, 1:1, 3:4, 9:16
- [x] Library con IndexedDB (save/load/delete con thumbnails)
- [x] Templates drawer + Library drawer laterales
- [x] Customize panel con edge handle siempre visible
- [x] Random button (genera combinaciones aleatorias)
- [x] Reset button (restaura defaults)
- [x] Texto de templates editable inline
- [x] Export PNG (canvas + overlay vía SVG foreignObject)
- [x] Export GIF animado (gifenc, 3s @ 18fps, palette quantization)
- [x] Export HTML embed (`<pre>` autocontenido + Copy snippet)
- [x] Publish dropdown menu con las 3 opciones
- [x] Portfolio entry con 4 screenshots

#### Stack Técnico
- Frontend: Next.js 16, React 19, TypeScript
- Render: HTML5 Canvas 2D, requestAnimationFrame loop
- GIF encoder: gifenc 1.0.3
- Storage: IndexedDB (native API, sin wrapper)
- Fonts: Helvetica Neue, Playfair Display, Cormorant Garamond
- Pipeline: sample → applyFx → applyDither → buildGrid → renderGrid
- Sin auth ni almacenamiento remoto (todo client-side)

#### Estructura de Archivos
```
src/app/ascii/
├── page.tsx - Editor principal (estado + dropdown export)
├── AsciiCanvas.tsx - Render loop con apiRef imperativo
├── ControlPanel.tsx - Panel lateral derecho
├── TemplatesDrawer.tsx, LibraryDrawer.tsx
├── TemplateOverlay.tsx - Capa de texto editable
├── EmbedModal.tsx - Modal de snippet copiable
└── ascii.css - Estilos completos del editor

src/lib/ascii/
├── types.ts, fx.ts, artStyles.ts
├── core/ - sample, charsets, dither, render
├── templates/ - 9 templates como datos puros
├── storage/db.ts - IndexedDB wrapper
└── exporters/ - index.ts (PNG, embed) + gif.ts

src/types/gifenc.d.ts - shim de tipos para gifenc
```

#### Pendiente / Ideas Futuras
- [ ] Webcam como source en vivo
- [ ] Video MP4 como source con scrubbing
- [ ] Más templates (estilo japonés, brutalista, vaporwave)
- [ ] Compartir creaciones vía URL (encode en base64)

---

## Development History

### 2026-05-01
- **ASCII Studio**: Nuevo proyecto `/ascii` — editor de imagen→ASCII en navegador, inspirado en asc11.com
- **ASCII Studio**: Pipeline completo con sample/dither/grid/render + 4 charsets, 4 modos de dithering
- **ASCII Studio**: 9 templates editoriales (avsolem default + Aurelia/Solar/Console/Hyperflux/Daily Press/Verdura/Stellar/Persimmon)
- **ASCII Studio**: 11 art styles, 9 modos FX animados con speed/scale/direction
- **ASCII Studio**: Color modes (Grayscale, Full Color, Matrix, Amber duotone, Custom hex)
- **ASCII Studio**: Customize panel con sliders (brightness, contrast, dither strength, opacity)
- **ASCII Studio**: FPS counter en vivo color-coded (verde ≥50, ámbar ≥24, rojo)
- **ASCII Studio**: IndexedDB local library con save/load/delete y thumbnails
- **ASCII Studio**: 3 exports — PNG, GIF animado (gifenc), HTML embed snippet
- **ASCII Studio**: Publish dropdown con las 3 opciones, modal de embed con Copy
- **ASCII Studio**: Edge handle persistente, Reset y Random buttons en panel
- **ASCII Studio**: Sin auth ni storage remoto — todo client-side
- **Portfolio**: Entrada ascii-studio.mdx con 4 screenshots
- **Fix UI**: Header gana padding-right cuando el panel está abierto (botones ya no quedan tapados)
- **Dependencies**: Añadido gifenc@1.0.3 + shim de tipos en src/types/gifenc.d.ts

### 2026-03-18
- **Yu-Gi-Oh Search**: Detección temprana de Set Code (búsqueda inicia con 4 caracteres en lugar de código completo)
- **Yu-Gi-Oh Search**: Input auto-uppercase en barra de búsqueda
- **Yu-Gi-Oh Search**: Debounce dinámico (300ms para Set Codes, 500ms para nombres)
- **Yu-Gi-Oh Search**: Manejo silencioso de Set Codes parciales (sin error mientras el usuario escribe)
- **Yu-Gi-Oh Search**: Fix fallback de idioma para set codes con sufijo alfanumérico (e.g., LDK2-SPK27→LDK2-ENK27)
- **Yu-Gi-Oh Search**: Fix búsqueda por set code usa card ID exacto en vez de fuzzy name search (evita resultados incorrectos como SKE-034→Mountain)
- **Yu-Gi-Oh Search**: Soporte de búsqueda para Tokens via set code TKN (e.g., SR02-ENTKN→Dragon Lord Token)

### 2026-03-03
- **Magic: The Gathering Manager**: Proyecto completo `/magic` con ~82 archivos nuevos
- **Magic**: Búsqueda Scryfall, colección, wishlist, venta, deck builder, admin, catálogo, noticias
- **Magic**: Double-faced cards, mana symbols WUBRG, oracle text, legalities, precios
- **Magic**: Deck Builder con main/sideboard (60+/15), max 4 copies, basic lands ilimitados
- **Magic**: Export PDF torneo, scanner OCR, sharing, i18n ES/EN
- **Magic**: Color scheme orange (#E8611A) accents, gold (#D4AF37) text, neutral backgrounds
- **Magic**: Header/Footer con logos oficiales MTG
- **TCG Hub**: Magic activo en `/tcg` landing page
- **Portfolio**: Entrada magic-manager.mdx creada

### 2026-02-17 (optimización)
- **Performance**: React.cache() para getPosts (deduplicación de ~60+ llamadas SSG)
- **Performance**: Dynamic import de jsPDF en DeckBuilder (136KB menos en bundle inicial)
- **Performance**: Cloud page `<img>` reemplazado por `<Image />` con next/image
- **Cleanup**: Eliminados ~60+ console.logs de producción en 10 archivos
- **Type Safety**: YugiohDeck.ts tipado con UpdateFilter<Document> (sin `as any`)
- **Security**: next-mdx-remote v5 → v6 (CVE-2026-0969)
- **Dependencies**: baseline-browser-mapping actualizado, Cloudinary en remotePatterns

### 2026-02-17
- **Yu-Gi-Oh Deck Builder**: MVP completo con Main/Extra/Side zones (límite 3 decks por usuario)
- **Yu-Gi-Oh Deck Builder**: Búsqueda integrada con auto-zone detection para Extra Deck
- **Yu-Gi-Oh Deck Builder**: Validación en tiempo real (límites de zonas, máx 3 copias por carta)
- **Yu-Gi-Oh Deck Builder**: Estadísticas de deck (curva de niveles, distribución tipo/atributo)
- **Yu-Gi-Oh Deck Builder**: Export PDF formato torneo KDE oficial con logos Konami y Yu-Gi-Oh!
- **Yu-Gi-Oh Footer**: Enlace home en copyright ("avsolem" clickeable)
- **Footer Icons**: Restaurados iconos faltantes de Diablo, ROMs y Yu-Gi-Oh en footer principal
- **Dependencies**: Añadido jsPDF para generación de PDF de torneos

### 2025-01-17
- **CV Page**: Nueva página `/cv` con diseño profesional tamaño carta
- **CV Page**: Soporte bilingüe completo (EN/ES) con toggle en tiempo real
- **CV Page**: Toggle de tema light/dark con controles liquid glass
- **CV Page**: Estilos de impresión optimizados para Edge/Chrome (1 página)
- **CV Page**: Fechas en línea con títulos, bullets cyan, foto circular
- **About Page**: Centrado de nombre y rol en todas las pantallas
- **About Page**: Botón "Download CV" con enlace a `/cv`

### 2025-01-09
- **Diablo Web**: Nuevo proyecto `/diablo` con DiabloWeb iframe
- **Diablo Web**: Logo oficial, fuente Cinzel Decorative, branding Avsolem
- **Diablo Web**: Botón home, icono en footer (GiDevilMask)
- **Diablo Web**: Portfolio entry con 3 imágenes optimizadas
- **Optimización**: Removidas dependencias no usadas (classnames, nodemailer, simplex-noise, class-variance-authority)
- **Optimización**: Convertidas 46 imágenes PNG a WebP (ahorro: 34 MB)
- **Optimización**: Eliminados archivos duplicados (Providers.new.tsx, LazyProjectCard.tsx)
- **Footer**: Hover cyan uniforme en todos los iconos
- **CLAUDE.md**: Actualizado con regla de crear portfolio entries automáticamente
- **STATUS.md**: Creado archivo centralizado de estado

### 2025-01-06
- **Cloud Storage**: Toast notifications, folder system, mobile optimizations
- **Cloud Storage**: Copy direct link feature
- **Light Theme**: Fixed text visibility, imported theme-overrides.css
- **Portfolio**: Added Cloudsolem entry with screenshots
- **Security**: Fixed preact vulnerability, Toast type warning

### 2025-12-07
- **i18n**: Complete Yu-Gi-Oh translation overhaul (80+ keys)
- **Security**: Next.js RCE vulnerability fix (15.5.6 → 15.5.7)
- **MDX**: Server component error fix (CopyButton extraction)

### 2025-12-03
- **Yu-Gi-Oh CMS**: Catálogo de productos y sistema de noticias
- **Admin Panel**: Tabs para gestión de productos y noticias

### 2025-12-02
- **Yu-Gi-Oh Admin**: Panel completo con estadísticas, usuarios, emails

### 2025-11-27
- **Yu-Gi-Oh Auth**: Sistema completo con Google OAuth + Credentials
- **User Profiles**: Colecciones personales, preferencias, stats

### 2025-11-24
- **ROMS Index**: Implementación completa con 23 consolas

### 2025-11-23
- **Yu-Gi-Oh Scanner**: Migración de Passcode a Set Code mode
- **YugiohPrices API**: Integración para precios por rareza

### 2025-11-21
- **Yu-Gi-Oh Scanner**: Sistema dual-mode con OCR + Fuzzy Matching

### 2025-11-20
- **UI Fixes**: Background blocking clicks, production CSS issues
- **Yu-Gi-Oh**: 30 card types in filters, custom logo, local search

---

## Global Pending Tasks

### Alta Prioridad
- [ ] Ninguna tarea pendiente crítica

### Media Prioridad
- [ ] Yu-Gi-Oh: Historial de precios temporal
- [ ] Cloud: Compartir carpetas públicamente
- [ ] ROMS: Búsqueda/filtro de consolas

### Baja Prioridad
- [ ] Yu-Gi-Oh: PWA offline mode
- [ ] ROMS: Contador de juegos por consola
- [ ] Diablo: Self-hosted version (sin iframe)

---

## Environment Variables Reference

```env
# Site
NEXT_PUBLIC_SITE_URL=https://avsolem.com

# MongoDB
MONGODB_URI=mongodb+srv://...

# Cloud Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=cloud_storage
CLOUD_PASSWORD=

# Auth (shared across Yu-Gi-Oh, Pokemon, Magic)
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://avsolem.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YUGIOH_ADMIN_EMAILS=admin@email.com
MAGIC_ADMIN_EMAILS=admin@email.com

# Email (optional)
RESEND_API_KEY=
```

---

## Scripts de Mantenimiento

### MongoDB Backup
```bash
node scripts/backup-mongodb.mjs       # Backup manual
node scripts/restore-mongodb.mjs      # Listar backups
node scripts/restore-mongodb.mjs <nombre>  # Restaurar
```

### Project Screenshots
```bash
# Capturar screenshots para portfolio
npx playwright screenshot --viewport-size="1280,800" "http://localhost:3000/<route>" public/images/projects/<slug>/01-screenshot.png
```

---

## Notes for Claude Code

1. **Al crear nuevos proyectos**: Siempre crear portfolio entry en `/src/app/work/projects/`
2. **Yarn**: Este proyecto usa Yarn, NO npm
3. **Commits**: NUNCA hacer commit/push sin autorización explícita
4. **Theme**: Default es dark mode, light mode tiene overrides en `theme-overrides.css`
5. **Este archivo**: Actualizar STATUS.md al finalizar cada sesión de trabajo

---

*Última actualización: 2026-05-01 por Claude Code*
