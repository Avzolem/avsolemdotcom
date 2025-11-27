# Yu-Gi-Oh! Card Search & Scanner - Project Summary

## Project Overview

A comprehensive Yu-Gi-Oh! card search and management system integrated into the portfolio website. Features include advanced search capabilities, OCR-based card scanning, and personal card collection management with authentication.

## Core Features

### 1. Multi-Mode Search
- **Name Search**: Search by card name (e.g., "Dark Magician")
- **Set Code Search**: Search by specific set code (e.g., "LOB-EN001", "CT13-EN008", "MVP1-ENSV4")
  - **Multi-Language Support with Automatic Fallback**:
    - Supports codes in all languages: EN, SP, FR, IT, PT, DE, AE, KR, JP
    - If a non-English code is not found (e.g., "SDCK-SP049"), automatically searches for the EN equivalent ("SDCK-EN049")
    - Displays warning message when fallback is used: "⚠️ El código SDCK-SP049 no está disponible. Mostrando versión EN: SDCK-EN049"
    - Transparent to user - always returns useful results
- **Advanced Filters**: Filter by type, attribute, race, level, ATK/DEF ranges

### 2. Card Scanner
- **Dual-Mode OCR Scanning**:
  - Set Code Mode: Scans bottom-right corner (50% x 15% crop area)
  - Name Mode: Scans top portion for card name
- OCR powered by Tesseract.js
- Real-time camera preview with visual scanning frame
- Automatic search trigger on successful scan

### 3. Differentiated Display

#### Set Code Search Results
- Shows specific set information:
  - Passcode
  - Set Code
  - Set Name
  - Rarity
  - Specific set price
- Price label: "Precio de este set:"

#### Name Search Results
- Shows general card information:
  - Passcode only in codes section
  - Collapsible dropdown with all available sets
  - Each set shows: code, name, rarity, individual price
  - Average estimated price
- Price label: "Precio estimado:"

### 4. Collection Management
- Three list types: Collection, For Sale, Wishlist
- Add cards to lists with quantity tracking
- **For Sale Management**:
  - "Poner en venta" button in Collection list
  - Toggle button changes to "💰 En Venta" (golden styling) when active
  - Hover over active button shows "Quitar de venta"
  - Bidirectional sync between Collection and For Sale lists
  - Cards marked for sale appear in both lists automatically
- **Quantity Controls**: Update card quantities without page reload
- **Toast Notifications**:
  - Success/info messages with colored text
  - Card names in green, set codes in yellow
  - Context-based toast system available across all pages
- Local image storage for offline access
- Price tracking per card
- Requires authentication

## Technical Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 with SCSS modules
- **State Management**: React Context API (Toast notifications, Authentication, Language)
- **OCR**: Tesseract.js v5
- **API**: YGOPRODeck API (primary source)
- **Database**: MongoDB for persistent list storage
- **Authentication**: NextAuth.js 4 (Google OAuth + Credentials)
- **Password Hashing**: bcryptjs
- **Image Processing**: Canvas API for cropping

### Key Files

#### Types
- `src/types/yugioh.ts` - TypeScript interfaces for cards, lists, and API responses
  - Updated with `isForSale` field for Collection/For-Sale sync

#### Context & State Management
- `src/contexts/ToastContext.tsx` - Global toast notification system
- `src/contexts/YugiohAuthContext.tsx` - Authentication state management (NextAuth wrapper)
- `src/contexts/YugiohLanguageContext.tsx` - Bilingual support (ES/EN)
- `src/app/yugioh/layout.tsx` - Layout with providers (Session, Toast, Language, Auth)

#### Authentication
- `src/lib/auth/options.ts` - NextAuth configuration (Google + Credentials providers)
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
- `src/lib/mongodb/models/User.ts` - User model with CRUD operations
- `src/components/yugioh/AuthModal.tsx` - Login/Register modal

#### Components
- `src/components/yugioh/CardSearch.tsx` - Main search interface with debouncing
- `src/components/yugioh/CardDisplay.tsx` - Card rendering with conditional display
- `src/components/yugioh/CardDisplay.module.scss` - Styling with Yu-Gi-Oh! brand colors
- `src/components/yugioh/CardScanner.tsx` - OCR scanning with camera integration
- `src/components/yugioh/AdvancedFilters.tsx` - Filter interface
- `src/components/yugioh/CardList.tsx` - List display with quantity controls and for-sale toggle
- `src/components/yugioh/CardList.module.scss` - List styling with button states
- `src/components/yugioh/ToastContainer.tsx` - Toast notification UI

#### API Routes
- `src/app/api/yugioh/search-setcode/route.ts` - Server-side set code lookup (avoids CORS)
- `src/app/api/yugioh/lists/[type]/route.ts` - Collection management endpoints (GET, POST, DELETE, PATCH)
- `src/app/api/yugioh/toggle-for-sale/route.ts` - Toggle for-sale status with bidirectional sync
- `src/app/api/yugioh/download-image/route.ts` - Local image storage

#### Database Models
- `src/lib/mongodb/models/YugiohList.ts` - MongoDB operations for list management
  - `updateCardField()` - Update specific card fields (e.g., isForSale)
  - `updateCardQuantity()` - Update card quantities
  - `addCardToList()` - Add cards with automatic sync
  - `removeCardFromList()` - Remove cards from lists

#### Services
- `src/lib/services/ygoprodeck.ts` - API integration and price calculations

### API Integration

#### YGOPRODeck API (Primary)
- Endpoint: `https://db.ygoprodeck.com/api/v7/`
- Features:
  - Supports 1007+ sets (updated September 2025)
  - Set code lookup: `/cardsetsinfo.php?setcode={code}`
  - Name search: `/cardinfo.php?fname={name}`
  - Advanced search with multiple filters
  - Provides prices, rarities, and comprehensive card data

#### CORS Handling
- External API calls proxied through Next.js API routes
- Server-side fetching avoids browser CORS restrictions

### Set Code Detection

#### Regex Pattern
```javascript
/^[A-Z0-9]{2,6}-[A-Z0-9]{3,7}$/
```

#### Supported Formats
- Standard: `LOB-EN001`, `SDK-001`
- Numbers in prefix: `CT13-EN008`, `5DS1-EN001`
- Letters in suffix: `MVP1-ENSV4`
- Long codes: `DP03-EN001`

### Search Flow

#### Set Code Search
1. User enters set code (detected by regex)
2. Frontend calls `/api/yugioh/search-setcode?code={setCode}`
3. API route queries YGOPRODeck set code endpoint
4. Returns: card name, set code, set name, rarity, price
5. Frontend fetches full card details by name
6. Attaches `specificSetInfo` to card object
7. CardDisplay renders set-specific view

#### Name Search
1. User enters card name
2. Frontend calls YGOPRODeck name search
3. Returns full card data including all sets
4. CardDisplay renders collapsible sets dropdown

### OCR Scanning

#### Set Code Mode
- **Crop Area**: Bottom-right corner (50% width, 15% height)
- **OCR Config**:
  - Whitelist: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-`
  - PSM: 7 (single line)
- **Detection**: Same regex as search bar
- **Visual Frame**: Positioned at bottom-right

#### Name Mode
- **Crop Area**: Top portion for card name
- **OCR Config**: Alphanumeric with spaces
- **Visual Frame**: Positioned at top

### Styling

#### Design Tokens
```scss
$yugioh-purple: #7B2CBF;
$yugioh-gold: #FFD700;
$yugioh-gray: #2a2a2a;
```

#### Key Features
- Dark theme with semi-transparent backgrounds
- Purple accent borders with gold highlights
- Hover effects with transforms and shadows
- Image zoom overlay on hover
- Responsive design with mobile breakpoints
- Custom scrollbars for dropdowns

### Database Schema

#### YugiohCard Interface
```typescript
{
  id: number;              // Passcode
  name: string;
  type: string;
  desc: string;
  race: string;
  archetype?: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  card_images: CardImage[];
  card_sets?: CardSet[];
  card_prices?: CardPrice[];
  specificSetInfo?: {      // Added for set code searches
    setCode: string;
    setName: string;
    setRarity: string;
    setPrice: string;
  };
}
```

#### CardInList Interface
```typescript
{
  cardId: number;
  cardName: string;
  cardImage: string;
  localImagePath?: string; // For offline access
  setCode: string;         // Unique identifier for card in specific set
  setName: string;
  setRarity: string;
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
  isForSale?: boolean;     // For Collection/For-Sale sync
}
```

## Implementation History

### Phase 1: Basic Search
- Implemented name-based card search
- Basic card display with images and stats

### Phase 2: Advanced Features
- Added advanced filters
- Implemented price calculations
- Created collection management system

### Phase 3: Scanner Integration
- Added OCR scanning with Tesseract.js
- Implemented passcode mode scanning
- Created visual scanning frame overlay

### Phase 4: Set Code Focus
- Replaced passcode search with set code search
- Updated scanner crop area to bottom-right
- Improved regex pattern detection
- Created API route for CORS-free set code lookup

### Phase 5: Differentiated Display
- Added `specificSetInfo` field to card type
- Implemented conditional rendering based on search type
- Created collapsible sets dropdown for name searches
- Different price labels and display logic

### Phase 6: For-Sale Management & Toast System
- Implemented Context API for toast notifications
- Created `ToastProvider` and `ToastContainer` components
- Added `isForSale` field to card type
- Implemented "Poner en venta" toggle button in Collection
- Created bidirectional sync between Collection and For-Sale lists
- Added `/api/yugioh/toggle-for-sale` endpoint
- Implemented optimistic UI updates for quantity changes
- Added colored toast messages (green names, yellow set codes)
- Moved ToastProvider to layout level for global availability
- Button states: normal → active ("💰 En Venta") → hover shows "Quitar de venta"
- **Deployment Fix**: Corrected import path in `SharedLink.ts` for Vercel compatibility

### Phase 7: Multi-Language Set Code Support
- **Problem**: YGOPRODeck API only supports English set codes (EN)
- **Investigation**: Explored YGO Resources API but no public endpoint for set code search
- **Solution**: Implemented automatic fallback system for non-English codes
- **Implementation**:
  - Modified `/api/yugioh/search-setcode/route.ts`:
    - Added regex pattern to detect non-English language codes: `/^(.+)-(SP|FR|IT|PT|DE|AE|KR|JP)(\d+.*)$/`
    - Attempts original code first
    - If fails and code is non-English, automatically tries EN equivalent
    - Returns `usedFallback`, `originalCode`, and `fallbackCode` fields
  - Updated `CardSearch.tsx`:
    - Modified `searchBySetCode()` to return fallback information
    - Added `fallbackWarning` state
    - Displays warning message when fallback is used
  - Created `warningBox` style in `CardSearch.module.scss`:
    - Golden/yellow theme for warnings (vs red for errors)
    - Matches Yu-Gi-Oh! color scheme
- **Supported Languages**: EN, SP, FR, IT, PT, DE, AE, KR, JP
- **User Experience**: Transparent fallback - user always gets results with clear indication when EN version is shown
- **Testing**: Verified with SDCK-SP049, LOB-FR001, CT13-SP008, LOB-DE001

### Phase 8: Official Yu-Gi-Oh! Color System
- **Feature**: Applied official Yu-Gi-Oh! colors to card type and attribute badges
- **Implementation**:
  - Updated `CardDisplay.module.scss` with comprehensive color system:
    - **Card Types**: Normal Monster (yellow), Effect Monster (orange), Fusion (purple), Synchro (white), XYZ (dark), Pendulum (green), Link (blue), Spell (green), Trap (pink), Token (gray)
    - **Attributes**: DARK (purple), LIGHT (yellow), WATER (blue), FIRE (red), EARTH (brown), WIND (green), DIVINE (gold)
  - Created `getTypeClassName()` helper function for dynamic CSS class generation
  - Badge styles use `rgba()` backgrounds with matching borders and text colors
- **Visual Impact**: Cards now have authentic Yu-Gi-Oh! visual identity with proper color coding
- **Responsive**: All color badges maintain readability on dark theme background

### Phase 9: Advanced Filters Enhancement
- **Complete Type Coverage**: Updated `AdvancedFilters.tsx` with all Yu-Gi-Oh! types
- **Implementation**:
  - **Card Types**: 26 types alphabetically sorted (Effect Monster, Fusion Monster, Link Monster, Spell Card, Trap Card, etc.)
  - **Monster Races**: 26 types including Creator-God and Illusion (previously missing)
  - **Attributes**: All 7 attributes sorted (DARK, DIVINE, EARTH, FIRE, LIGHT, WATER, WIND)
  - **Levels**: Extended range from 1-12 to 1-13 to support high-level cards
  - All lists use `.sort()` for alphabetical ordering
- **User Experience**: Complete and organized filter options for precise card searches

### Phase 10: Expandable Card Descriptions
- **Feature**: Long card descriptions (>250 characters) are now collapsible
- **Implementation**:
  - Added `isDescExpanded` state in `CardDisplay.tsx`
  - Detects long descriptions with `isLongDescription` boolean
  - Shows first 250 characters with "..." when collapsed
  - "▼ Ver más" / "▲ Ver menos" toggle button
- **Benefits**: Cleaner UI for cards with lengthy effect descriptions

### Phase 11: Price Fallback System
- **Problem**: Some set codes have $0 price in API but card has general pricing available
- **Solution**: Dual-price display system
- **Implementation**:
  - **CardDisplay.tsx**: When set price is $0, shows both "No disponible" and general estimated price
  - **CardList.tsx**: Fetches general prices from API for cards with $0 set price using `useEffect` hook
  - Stores general prices in `generalPrices` state (Record<number, number>)
  - Display format:
    ```
    Precio de este set: No disponible
    Precio estimado general: $X.XX
    ```
- **User Experience**: Users always see pricing information, even when specific set price is unavailable

### Phase 12: Camera UI Improvements
- **Feature**: Improved scanner button positioning for better mobile and desktop UX
- **Implementation**:
  - Moved camera control buttons (Capturar, Cerrar) below camera preview in `CardScanner.tsx`
  - Updated `CardScanner.module.scss`:
    - Changed `.controls` from `margin-bottom: 20px` to `margin-top: 20px`
    - Removed `margin-bottom` from `.cameraContainer`
  - JSX reordering: Camera preview now renders before controls
- **Benefits**:
  - More intuitive button placement
  - Prevents buttons from obstructing camera view
  - Consistent experience across mobile and desktop devices
  - Better thumb reach on mobile devices

### Phase 13: User Authentication System (Latest)
- **Feature**: Complete user authentication with personal collections
- **Tech Stack**: NextAuth.js 4 with JWT strategy
- **Authentication Methods**:
  - **Google OAuth**: One-click sign-in with Google account
  - **Email/Password**: Traditional credentials with bcrypt hashing
- **Implementation**:
  - **NextAuth Configuration** (`src/lib/auth/options.ts`):
    - Google Provider with OAuth 2.0
    - Credentials Provider with email/password
    - JWT session strategy (30 days expiry)
    - Custom callbacks for user data enrichment
  - **User Model** (`src/lib/mongodb/models/User.ts`):
    - Fields: email, name, password (hashed), provider, newsletterSubscribed, language
    - Functions: createUserWithCredentials, verifyPassword, upsertOAuthUser, updateUserPreferences, deleteUser
  - **Auth Context** (`src/contexts/YugiohAuthContext.tsx`):
    - Uses NextAuth's useSession
    - Exposes: user, isAuthenticated, isLoading, signInWithGoogle, signInWithCredentials, register, logout
  - **Auth Modal** (`src/components/yugioh/AuthModal.tsx`):
    - Tabbed interface: Login / Register
    - Google OAuth button with official styling
    - Email/password forms with validation
    - Newsletter subscription checkbox on registration
  - **User Menu** (`src/components/yugioh/YugiohHeader.tsx`):
    - Avatar display (Google profile image or initials fallback)
    - Dropdown with profile link and logout
  - **Profile Page** (`src/app/yugioh/perfil/page.tsx`):
    - User stats (collection count, for-sale count, wishlist count, total value)
    - Language preference toggle (ES/EN)
    - Newsletter subscription toggle
    - Account deletion with confirmation
- **User-Scoped Data**:
  - All lists (Collection, For-Sale, Wishlist) now linked to userId
  - Updated YugiohList model to require userId parameter
  - Shared links preserve owner's userId for data retrieval
- **Security**:
  - Passwords hashed with bcrypt (12 rounds)
  - JWT tokens with secure secret
  - Session validation on all protected API routes
- **i18n Support**:
  - All auth-related strings translated (ES/EN)
  - Profile page fully bilingual
- **Mobile Responsive**:
  - Auth modal adapts to small screens (480px breakpoint)
  - Profile stats grid collapses to single column on mobile
- **Environment Variables Required**:
  ```
  NEXTAUTH_SECRET=<random-string>
  NEXTAUTH_URL=https://yourdomain.com
  GOOGLE_CLIENT_ID=<from-google-console>
  GOOGLE_CLIENT_SECRET=<from-google-console>
  ```
- **Google Cloud Console Setup**:
  - Authorized JavaScript origins: `https://yourdomain.com`
  - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

## Known Patterns and Solutions

### CORS Prevention
All external API calls go through Next.js API routes to avoid browser CORS restrictions.

### Debouncing
500ms debounce on search input prevents excessive API calls.

### Cache Management
When modifying API routes, clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Regex Evolution
Started with restrictive pattern, progressively expanded to support all set code formats through iterative testing.

### Conditional Display Logic
Uses `card.specificSetInfo` presence to determine which UI template to render.

### For-Sale System Architecture
**Bidirectional Sync Logic**:
- Collection has `isForSale` boolean field
- For-Sale list is separate but synchronized
- When toggling "Poner en venta":
  - Updates `isForSale` in Collection via `/api/yugioh/toggle-for-sale`
  - Adds/removes card from For-Sale list automatically
- When adding from search to "En Venta":
  - Adds to For-Sale list
  - Also adds to Collection with `isForSale: true`
- When deleting from For-Sale:
  - Removes from For-Sale list
  - Sets `isForSale: false` in Collection (card remains in Collection)
- When deleting from Collection:
  - Removes from Collection completely
  - Also removes from For-Sale if present

### Toast System
Context-based notification system:
- `ToastProvider` at layout level provides global access
- `useToast()` hook available in all yugioh pages
- Toast messages support JSX for colored text
- Types: success, error, info
- Auto-dismisses after 3 seconds

### Optimistic UI Updates
Quantity and for-sale status updates:
- Update local state immediately for instant feedback
- Make API call in background
- Revert on failure (for quantity updates)
- Prevents page reloads and loading spinners

### Vercel Deployment
**Common Issues**:
- Import path resolution differs between dev and production
- Always use relative imports from actual file locations, not index files
- Example fix: `SharedLink.ts` imported from `../index` → changed to `../connection`
- Test production builds locally before deploying: `npm run build`

## Performance Metrics

### Build Information
- **Build Time**: ~25.5 seconds
- **Total Pages**: 42 static + dynamic pages
- **Bundle Sizes**:
  - `/yugioh` main page: 24.4 kB (132 kB First Load JS)
  - `/yugioh/coleccion`: 133 B (116 kB First Load JS)
  - `/yugioh/venta`: 133 B (116 kB First Load JS)
  - Shared chunks: 103 kB
  - Middleware: 33.9 kB
- **Optimization**: All Yu-Gi-Oh! pages are server-rendered (ƒ Dynamic) for real-time data

### Mobile Optimization
- **Responsive Breakpoints**:
  - Primary: 768px (tablets and below)
  - Secondary: 480px (mobile phones)
  - Large screens: 1400px (desktop adjustments)
- **Mobile-Specific Features**:
  - Camera scanner optimized for mobile with `facingMode: 'environment'`
  - Touch-friendly button sizes (min 44x44px)
  - Collapsible filters for space efficiency
  - Swipe-friendly card grids
  - Optimized image loading with Next.js Image component
- **Media Queries**: 50+ responsive adjustments across all components
- **Touch Interactions**: Hover states adapted for touch devices

## Future Considerations

### Potential Enhancements
- Bulk card import from CSV/spreadsheet
- Price tracking over time with charts
- Trading/sale marketplace integration
- QR code generation for card sharing
- Export lists to PDF or Excel
- Deck builder integration
- Card condition tracking
- Multiple language support for UI (currently Spanish)

### Performance Optimizations
- ✅ Optimized bundle splitting (completed)
- ✅ Mobile-responsive design (completed)
- Implement client-side caching for frequently searched cards
- Add pagination for large result sets
- Lazy load card images with intersection observer
- Optimize OCR processing with WebAssembly

### API Alternatives
- TCGPlayer API (requires API key, paid)
- Scryfall-like caching layer
- Self-hosted card database for faster lookups

## Development Notes

### Testing Set Codes
Common test cases:
- `LOB-EN001` - Standard English format
- `CT13-EN008` - Numbers in prefix
- `MVP1-ENSV4` - Letters in suffix
- `SDK-001` - Short format
- `5DS1-EN001` - Numbers at start
- `SDCK-SP049` - Spanish code (fallback to EN)
- `LOB-FR001` - French code (fallback to EN)
- `LOB-DE001` - German code (fallback to EN)

### Debug Console Logs
Search operations include emoji-prefixed logs:
- `🔍` - Search initiated
- `✅` - Successful API response
- `❌` - Error or not found
- `🏷️` - Set code format detected
- `🌐` - Language fallback used

### Component Memoization
CardDisplay uses React.memo with custom comparison to prevent unnecessary re-renders when card ID and compact mode haven't changed.

## Git Workflow

Following CLAUDE.md policies:
- Never commit or push without explicit user request
- No Claude Code co-authorship in commits
- Clean, descriptive commit messages
- Conventional commit format when appropriate

---

**Last Updated**: November 27, 2025
**Status**: Production ready - Full user authentication with personal collections
**Version**: Next.js 15, React 19, MongoDB, NextAuth.js 4, Tesseract.js 5
**Build Time**: ~41s | **Bundle Size**: 10.4 kB (main) | **Pages**: 46
**Recent Improvements**:
- ✅ User authentication (Google OAuth + Email/Password)
- ✅ Personal collections per user (Collection, For-Sale, Wishlist)
- ✅ User profile page with stats and preferences
- ✅ Newsletter subscription system
- ✅ Login-aware empty state messages
- ✅ Official Yu-Gi-Oh! color system for all card types and attributes
- ✅ Complete advanced filters (26 card types, 26 monster races, 7 attributes)
- ✅ Multi-language set code support with automatic EN fallback
- ✅ 50+ mobile responsive breakpoints
