# Yu-Gi-Oh! Card Manager

Sistema completo de gestión de cartas Yu-Gi-Oh! con búsqueda, visualización de precios y administración de listas.

## Características

### 🔍 Búsqueda Pública
- Búsqueda de cartas por nombre (fuzzy search)
- **NUEVO**: Filtros avanzados (tipo, atributo, nivel, ATK/DEF rangos)
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

- **Frontend**: Next.js 15, React 19, Once UI
- **Backend**: Next.js API Routes
- **Base de Datos**: MongoDB
- **API Externa**: YGOPRODeck API v7
- **Autenticación**: Cookie-based sessions
- **TypeScript**: Tipado completo
- **Estilos**: Once UI Design System

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
│   └── CardSearch.tsx          # Buscador con debounce
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
- **UI**: Once UI System
- **Desarrollado por**: Andrés Aguilar
