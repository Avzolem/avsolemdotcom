# STATUS.md - Project Status Tracker

> Este archivo centraliza el estado de todos los proyectos dentro de avsolem.com.
> Claude Code debe leer este archivo al inicio de cada sesión para entender el contexto.

**Última actualización global**: 2025-01-09

---

## Quick Reference - Projects Status

| Proyecto | Ruta | Estado | Última Actualización |
|----------|------|--------|----------------------|
| Portfolio Principal | `/` | Production | 2025-01-06 |
| Cloud Storage | `/cloud` | Production | 2025-01-06 |
| Yu-Gi-Oh! Manager | `/yugioh` | Production | 2025-12-03 |
| ROMS Index | `/roms` | Production | 2025-11-24 |
| Diablo Web | `/diablo` | Production | 2025-01-09 |

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

### 2. Yu-Gi-Oh! Manager (`/yugioh`)

**Estado**: Production Ready
**Última sesión**: 2025-12-03
**Portfolio entry**: `src/app/work/projects/yugioh-manager.mdx`

#### Features Implementados
- [x] Búsqueda de cartas por nombre (debounce 500ms)
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
- [x] Multi-language set codes con fallback a EN

#### Stack Técnico
- Frontend: Next.js 15, React 19, SCSS Modules
- API: YGOPRODeck API v7, YugiohPrices API
- Database: MongoDB
- Auth: NextAuth.js 4 (Google OAuth + Credentials)
- OCR: Tesseract.js v5
- Fuzzy Search: Fuse.js

#### Estructura de Archivos
```
src/app/yugioh/
├── page.tsx - Búsqueda principal
├── layout.tsx - Layout con providers
├── coleccion/, venta/, wishlist/ - Listas
├── catalogo/, noticias/ - CMS público
├── admin/ - Panel de administración
├── shared/[token]/ - Listas compartidas
└── perfil/ - Perfil de usuario

src/components/yugioh/
├── CardSearch, CardDisplay, CardList
├── CardScanner, AdvancedFilters
├── ExportButtons, PriceStats, ShareButton
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
- [ ] Deck builder
- [ ] Modo offline (PWA)
- [ ] Import masivo desde CSV

---

### 3. ROMS Index (`/roms`)

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

### 4. Diablo Web (`/diablo`)

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

## Development History

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
- [ ] Yu-Gi-Oh: Deck builder
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

# Yu-Gi-Oh
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://avsolem.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YUGIOH_ADMIN_EMAILS=admin@email.com

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

*Última actualización: 2025-01-09 por Claude Code*
