# Yu-Gi-Oh! Card Manager

Sistema completo de gestión de cartas Yu-Gi-Oh! con búsqueda, visualización de precios y administración de listas.

## Características

### 🔍 Búsqueda Pública
- Búsqueda de cartas por nombre (fuzzy search)
- **NUEVO**: 📸 Escaneo de cartas con cámara (Dos Modos)
  - **🏷️ Modo Set Code (Recomendado)**: Escanea el código de set alfanumérico
    - Escanea código de set (ej: "LOB-EN001", "SDK-001")
    - OCR optimizado para alfanumérico (letras mayúsculas + números + guión)
    - Búsqueda en **YugiohPrices API** (precios por rareza específica)
    - Fallback a YGOPRODeck API
    - Marco visual en esquina inferior derecha
    - Identifica la versión exacta de la carta
  - **📝 Modo Nombre**: Escanea el nombre de la carta con fuzzy matching
    - OCR de texto con Tesseract.js
    - Fuzzy matching inteligente con Fuse.js
    - Presenta top 5 coincidencias con porcentaje de similitud
    - Marco visual en parte superior de la carta
  - Selector de modo fácil de usar
  - Soporte para subir imágenes desde galería
  - Marcos visuales ajustables según modo seleccionado
  - Funciona en móvil y escritorio
- Filtros avanzados (tipo, atributo, nivel, ATK/DEF rangos)
- Información completa de cada carta:
  - Imagen de alta calidad
  - Estadísticas (ATK, DEF, Level, etc.)
  - Descripción detallada
  - Tipo, Raza, Atributo
  - Precio actualizado de TCGPlayer
- Cache de 24 horas para mejor rendimiento
- Debounce de 500ms en búsqueda
- Rate limiting automático (15 requests/segundo)

### 🔐 Sistema de Administración
- Acceso protegido con contraseña
- Cookie de sesión segura (7 días)
- Solo usuarios autenticados pueden:
  - Agregar cartas a listas
  - Modificar cantidades
  - Eliminar cartas
  - Ver estadísticas de valor

### 📚 Gestión de Listas
Tres listas principales:

1. **Colección** - Tu inventario personal de cartas
2. **En Venta** - Cartas disponibles para venta
3. **Wishlist** - Cartas que deseas conseguir

Cada lista incluye:
- **NUEVO**: Estadísticas de precios con gráficas de distribución
- **NUEVO**: Export a CSV y PDF
- **NUEVO**: Compartir listas públicamente (enlaces temporales)
- **NUEVO**: Almacenamiento local de imágenes (evita hotlinking)
- Cantidad de cartas por tipo
- Valor total estimado
- Fecha de agregado
- Notas personalizadas
- Control de cantidad

## Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MongoDB
- **API Externa**: YGOPRODeck API v7
- **OCR**: Tesseract.js para reconocimiento de texto
- **Fuzzy Matching**: Fuse.js para búsqueda difusa inteligente
- **Autenticación**: NextAuth.js (Google OAuth + Credentials)
- **TypeScript**: Tipado completo
- **Estilos**: SCSS Modules + Tailwind CSS

## API Endpoints

### Autenticación
- `POST /api/yugioh/auth` - Login
- `GET /api/yugioh/auth` - Check auth status
- `DELETE /api/yugioh/auth` - Logout

### Listas
- `GET /api/yugioh/lists/[type]` - Obtener lista (público)
- `POST /api/yugioh/lists/[type]` - Agregar carta (requiere auth)
- `PATCH /api/yugioh/lists/[type]` - Actualizar carta (requiere auth)
- `DELETE /api/yugioh/lists/[type]` - Eliminar carta (requiere auth)

Tipos válidos: `collection`, `for-sale`, `wishlist`

## Estructura de Archivos

```
src/
├── app/yugioh/
│   ├── layout.tsx              # Layout con navegación y AuthProvider
│   ├── page.tsx                # Página de búsqueda
│   ├── coleccion/page.tsx      # Lista de colección
│   ├── venta/page.tsx          # Lista de ventas
│   └── wishlist/page.tsx       # Lista de wishlist
├── components/yugioh/
│   ├── AdminLogin.tsx          # Modal de login
│   ├── CardDisplay.tsx         # Visualización de carta individual
│   ├── CardList.tsx            # Lista de cartas guardadas
│   ├── CardSearch.tsx          # Buscador con debounce
│   └── CardScanner.tsx         # Escáner de cámara con OCR y fuzzy matching
├── lib/
│   ├── services/ygoprodeck.ts  # Cliente API YGOPRODeck
│   └── mongodb/
│       ├── connection.ts       # Conexión MongoDB
│       └── models/YugiohList.ts # Modelo de listas
├── contexts/
│   └── YugiohAuthContext.tsx   # Context de autenticación
├── types/
│   └── yugioh.ts               # Tipos TypeScript
└── api/yugioh/
    ├── auth/route.ts           # Autenticación
    └── lists/[type]/route.ts   # CRUD de listas
```

## Cómo Funciona el Escaneo de Cartas

El sistema ofrece **dos modos de escaneo** con diferentes enfoques:

### Modo Set Code (Recomendado) 🏷️

1. **Captura del Set Code**
   - Marco visual en esquina inferior derecha (donde está el código de set)
   - Recorta 50% derecho x 15% inferior de la imagen
   - Aplica preprocesamiento: escala de grises + mejora de contraste

2. **OCR Optimizado para Alfanumérico**
   - Tesseract configurado para letras mayúsculas + números + guión
   - Extrae el set code (ej: "LOB-EN001", "SDK-001")
   - Valida mínimo 5 caracteres

3. **Búsqueda Multi-API**
   - **Primera opción**: YugiohPrices API
     - Endpoint: `https://yugiohprices.com/api/price_for_print_tag/{setcode}`
     - Obtiene precio específico de esa rareza/versión
     - Identifica la carta exacta con su set
   - **Fallback**: YGOPRODeck API
     - Endpoint: `https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode={setcode}`
     - Búsqueda por código de set
   - Resultado exacto de la versión específica de la carta

### Modo Nombre 📝

1. **Captura del Nombre**
   - Marco visual en parte superior (30% de altura)
   - Recorta el 30% superior de la imagen
   - Aplica preprocesamiento: escala de grises + mejora de contraste

2. **OCR de Texto**
   - Tesseract con caracteres alfanuméricos permitidos
   - Limpieza de texto (espacios, artefactos, etc.)

3. **Fuzzy Matching Inteligente**
   - Obtiene todos los nombres de cartas de YGOProDeck (~13,000 cartas)
   - Usa Fuse.js con threshold de 0.4 para encontrar similitudes
   - Maneja errores comunes de OCR
   - Presenta top 5 coincidencias con porcentaje de similitud
   - El usuario selecciona la carta correcta

### ¿Cuál modo usar?

- **Usa Modo Set Code** si: Quieres identificar la versión exacta de la carta con su rareza específica y obtener precios precisos por versión
- **Usa Modo Nombre** si: No tienes acceso al set code o prefieres buscar por el nombre de la carta

## Optimizaciones

### Performance
- Cache de API (24 horas)
- Debounce en búsqueda (500ms)
- Lazy loading de imágenes con Next/Image
- React memoization en componentes
- Virtual scrolling para listas grandes
- **Rate Limiting**: Sistema de cola que limita requests a 15/segundo (API permite 20/segundo)

### 🚨 IMPORTANTE: Cumplimiento con API YGOProDeck

Para evitar ser bloqueados por la API de YGOProDeck, seguimos estas reglas:

1. **Rate Limiting**
   - Límite de API: 20 requests por segundo
   - Nuestro límite: 15 requests por segundo (margen de seguridad)
   - Penalización: Ban de 1 hora si se excede
   - Implementación: Sistema de cola con throttling automático

2. **Caching**
   - Cache local de 24 horas para todas las búsquedas
   - El cache se valida antes de hacer nuevas peticiones
   - Reduce drásticamente las llamadas a la API

3. **⚠️ Imágenes**
   - Las imágenes están actualmente servidas vía Next.js Image Optimization
   - **RECOMENDACIÓN**: Descargar y almacenar localmente las imágenes de cartas guardadas en listas
   - La API prohíbe hotlinking continuo de imágenes
   - Penalización: Blacklist de IP permanente

### Mobile
- Diseño responsive mobile-first
- Touch-friendly buttons
- Optimized grid layouts
- Viewport meta tags
- Fast tap interactions

### SEO
- Metadata completo por página
- Open Graph tags
- Sitemap integration
- Semantic HTML

## Seguridad

- Contraseña almacenada en variable de entorno
- HttpOnly cookies
- CSRF protection con SameSite
- Input sanitization
- Rate limiting en API externa

## Variables de Entorno

```bash
YUGIOH_ADMIN_PASSWORD=your_password_here
MONGODB_URI=your_mongodb_connection_string
```

## Uso

1. **Búsqueda**: Navega a `/yugioh` y busca cartas
2. **Login**: Click en "🔐 Acceso Admin" e ingresa contraseña
3. **Agregar a lista**: Busca una carta y usa los botones "+ Colección", "+ En Venta", "+ Wishlist"
4. **Ver listas**: Navega a las secciones de Colección, En Venta o Wishlist
5. **Gestionar**: Modifica cantidades o elimina cartas (solo con auth)

## Mantenimiento

### Limpiar cache
El cache se limpia automáticamente después de 24 horas. Para limpiar manualmente, reinicia el servidor.

### Backup de listas
Las listas se almacenan en MongoDB. Configura backups regulares de la base de datos.

### Actualizar precios
Los precios se actualizan automáticamente al buscar cartas (se obtienen de TCGPlayer vía YGOPRODeck API).

## Créditos

- **API**: [YGOPRODeck](https://ygoprodeck.com)
- **Precios**: TCGPlayer
- **UI**: Tailwind CSS + SCSS Modules
- **Desarrollado por**: Andrés Aguilar
