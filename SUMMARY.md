# Project Summary

## Overview
Portfolio website built with Next.js 15, React 19, and Tailwind CSS for Andrés Aguilar (avsolem), a Full Stack Developer.

## Recent Changes (2025-12-07)

### Session 1: UI Overhaul & New Features
- **Once UI Cleanup**: Migrated from Once UI library to pure Tailwind CSS
  - Renamed `once-ui.config.js` to `site.config.js`
  - Deleted `ClientWarningSuppress.tsx` and `custom.css`
  - Updated documentation references

- **Liquid Glass UI Design**: Implemented floating header with glass morphism effect
  - Black background with translucent header
  - Backdrop blur and subtle borders
  - Updated `globals.css`, `Header.tsx`, `Header.module.scss`

- **New Work Entries**: Added portfolio entries for Yu-Gi-Oh Manager and ROMS Index
  - Created automated screenshot capture script with Playwright
  - Added MDX files: `yugioh-manager.mdx`, `roms-index.mdx`
  - Set Yu-Gi-Oh Manager as featured "Recent project"

- **Route-based Layout**: Created `LayoutContent.tsx` client component
  - Header/Footer hidden on `/yugioh` and `/roms` routes
  - Uses `usePathname()` for proper client-side route detection

### Session 2: i18n Translation System
- **Complete Yu-Gi-Oh Translation Overhaul**:
  - `SharedListView.tsx` - All Spanish text replaced with `t()` calls
  - `Toast.tsx` - Fixed aria-label translation
  - `YugiohHeader.tsx` - Fixed Catálogo, Noticias, tagline
  - `admin/page.tsx` - Full translation (80+ strings)
  - `catalogo/page.tsx` - All UI text translated
  - `noticias/page.tsx` - All UI text translated

- **Translation Keys Added**: 80+ new keys in both `en.ts` and `es.ts`
  - Admin panel (stats, users, email, products, news management)
  - Catalog page (loading, filters, product display)
  - News page (loading, search, article display)

### Session 3: Security & Build Fixes
- **Next.js RCE Vulnerability Fix**: Updated from 15.5.6 to 15.5.7
  - Critical vulnerability: GHSA-9qr9-h5gf-34mp

- **MDX Server Component Error Fix**:
  - Created `CopyButton.tsx` as client component
  - Extracted `onClick` handlers from server-rendered MDX components
  - Fixed build error on `/blog/nextjs-notion-integration-tutorial`

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: MDX files for blog posts and projects
- **Icons**: Lucide React
- **TypeScript**: Strict mode enabled

## Key Directories
- `/src/app/` - Next.js app router pages and API routes
- `/src/components/` - Reusable React components
- `/src/resources/` - Configuration and content files
- `/src/locales/yugioh/` - i18n translation files (en.ts, es.ts)
- `/src/app/blog/posts/` - MDX blog posts
- `/src/app/work/projects/` - MDX project descriptions

## Git Commits (Latest)
1. `d5db593` - fix: resolve Next.js RCE vulnerability and MDX onClick error
2. `83a2e90` - feat: complete i18n translations for Yu-Gi-Oh components
3. `2e85f0b` - refactor: migrate from Once UI to pure Tailwind CSS

---

## Session 4: Cloud Storage Feature (2025-01-06) - COMPLETE

### Project: `/cloud` - Personal Cloud Storage

**Status**: Complete and ready for production

### Overview
Personal cloud storage with video streaming, accessible from any device including legacy consoles (PSP, 3DS, PS Vita).

### Technical Decisions
| Aspect | Decision |
|--------|----------|
| **Storage Backend** | Cloudinary (free tier) |
| **Privacy** | Public URLs with cookie-based auth |
| **Auth** | Simple password authentication |
| **Streaming** | MP4 direct playback (HLS not supported on free tier) |
| **Database** | MongoDB (`cloud_files`, `cloud_folders` collections) |
| **Legacy Support** | `/cloud/lite` Route Handlers with raw HTML |

### Directory Structure
```
src/app/cloud/
├── layout.tsx                 # Root layout (imports styles only)
├── cloud-theme.scss           # Visual theme
├── (main)/                    # Route group with CloudAuthProvider
│   ├── layout.tsx             # Client layout with auth context
│   ├── page.tsx               # Main dashboard
│   └── stream/[fileId]/page.tsx  # Video player
└── lite/                      # Legacy browser version (Route Handlers)
    ├── route.ts               # Raw HTML file list
    └── stream/[fileId]/route.ts  # Raw HTML video player

src/components/cloud/
├── CloudHeader.tsx            # Navigation header
├── CloudFooter.tsx            # Footer with back link
├── FileUploader.tsx           # Drag-drop upload with progress
├── StorageQuota.tsx           # Storage usage indicator
└── VideoPlayer.tsx            # MP4 player with controls

src/lib/cloudinary/
└── config.ts                  # Cloudinary configuration & URL generation

src/lib/mongodb/models/
├── CloudFile.ts               # File metadata schema
└── CloudFolder.ts             # Folder schema

src/app/api/cloud/
├── auth/route.ts              # Password authentication
├── files/route.ts             # List files
├── files/[fileId]/route.ts    # File CRUD operations
├── upload/signature/route.ts  # Cloudinary upload signature
├── upload/complete/route.ts   # Save file metadata
├── stream/[fileId]/route.ts   # Get streaming URL
└── storage/route.ts           # Storage usage stats

src/contexts/
└── CloudAuthContext.tsx       # Auth state management

src/middleware.ts              # Legacy browser detection & redirect
```

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=cloud_storage
CLOUD_PASSWORD=your_secure_password
```

### Routes
| Route | Type | Description |
|-------|------|-------------|
| `/cloud` | React | Main dashboard with file grid |
| `/cloud/stream/[fileId]` | React | Video player page |
| `/cloud/lite` | Route Handler | Raw HTML file list (no JS) |
| `/cloud/lite/stream/[fileId]` | Route Handler | Raw HTML video player (no JS) |

### API Routes
- `POST /api/cloud/auth` - Login with password
- `DELETE /api/cloud/auth` - Logout
- `GET /api/cloud/auth` - Check auth status
- `POST /api/cloud/upload/signature` - Get Cloudinary upload signature
- `POST /api/cloud/upload/complete` - Save file metadata to MongoDB
- `GET /api/cloud/files` - List user files
- `GET/PATCH/DELETE /api/cloud/files/[fileId]` - File operations
- `GET /api/cloud/stream/[fileId]` - Get streaming URL
- `GET /api/cloud/storage` - Storage usage stats

### Features Implemented
- [x] Simple password authentication (cookie-based)
- [x] File upload with progress tracking
- [x] Video thumbnail generation (Cloudinary)
- [x] MP4 direct streaming
- [x] Storage quota tracking
- [x] File rename and deletion (Cloudinary + MongoDB)
- [x] Legacy browser detection via middleware
- [x] Lite version with pure HTML (PSP/Vita/3DS compatible)
- [x] Automatic redirect for legacy User-Agents

### Legacy Browser Support
The middleware detects these User-Agents and redirects to `/cloud/lite`:
- Nintendo 3DS / Nintendo Browser
- PSP / PlayStation Portable
- PlayStation Vita
- NetFront
- PLAYSTATION 3

The lite version uses Route Handlers that return raw HTML without any JavaScript, making it compatible with browsers that don't support modern JS.

---

## Session 5: Cloud UI Enhancements & Light Theme Fix (2025-01-06)

### Cloud Storage UI Improvements
- **Folder System**: Full CRUD operations for folders
  - Created `/api/cloud/folders/route.ts` (GET, POST)
  - Created `/api/cloud/folders/[folderId]/route.ts` (GET, PATCH, DELETE)
  - Tree navigation sidebar with nested folder support
  - Breadcrumb navigation for folder path
  - Files filtered by current folder

- **Header Redesign**:
  - Renamed title to "Cloudsolem"
  - Moved storage quota to header (horizontal layout)
  - Added "Nueva Carpeta" and "Subir" buttons to header
  - Thinner storage bar (6px mobile, 8px desktop)

- **Toast Notifications**:
  - Updated `ToastContext.tsx` with UI rendering
  - Toast styles in `cloud-theme.scss`
  - Notifications for: upload, delete, rename, create folder

- **Mobile Optimizations**:
  - Compact header with smaller buttons
  - 2-column file grid on small screens
  - Touch-friendly toast positioning

### Light Theme Fixes
- **Imported `theme-overrides.css`** (was never being used!)
- **Darker colors for light mode**:
  - Cyan text: `cyan-400/500/600` → `cyan-700` (#0e7490)
  - Gray text: Each shade one level darker
  - Headers forced to `#111827`
  - Body text forced to `#111827`

- **Component fixes**:
  - Newsletter box: `border-gray-300` + `shadow-sm`
  - About button: `bg-white` + `border-gray-300` + `shadow-sm`
  - Input fields: `bg-gray-50` + `border-gray-300`

### Mobile Image Display Fix
- Added `isMobileImage()` detection in `OptimizedCarousel.tsx`
- Portrait images use `object-contain` instead of `object-cover`
- Gray background for mobile images to prevent cropping

### Portfolio Entry
- Created `cloudsolem-storage.mdx` project entry
- Captured screenshots with Playwright (1920x1080, 390x844)
- Added Cloud icon to Footer linking to `/cloud`

### Files Changed
| File | Changes |
|------|---------|
| `src/app/cloud/(main)/page.tsx` | Folder system, toast integration |
| `src/app/cloud/cloud-theme.scss` | Sidebar, tree, toast, mobile styles |
| `src/app/globals.css` | Import theme-overrides.css |
| `src/app/theme-overrides.css` | Light mode color overrides |
| `src/components/Footer.tsx` | Cloud icon link |
| `src/components/OptimizedCarousel.tsx` | Mobile image handling |
| `src/contexts/ToastContext.tsx` | Toast UI rendering |
| `src/contexts/ThemeContext.tsx` | Dark mode defaults |
