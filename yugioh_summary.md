# Yu-Gi-Oh! Card Search & Scanner - Project Summary

## Project Overview

A comprehensive Yu-Gi-Oh! card search and management system integrated into the portfolio website. Features include advanced search capabilities, OCR-based card scanning, and personal card collection management with authentication.

## Core Features

### 1. Multi-Mode Search
- **Name Search**: Search by card name (e.g., "Dark Magician")
- **Set Code Search**: Search by specific set code (e.g., "LOB-EN001", "CT13-EN008", "MVP1-ENSV4")
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
- **State Management**: React Context API (Toast notifications, Authentication)
- **OCR**: Tesseract.js v5
- **API**: YGOPRODeck API (primary source)
- **Database**: MongoDB for persistent list storage
- **Authentication**: Cookie-based sessions
- **Image Processing**: Canvas API for cropping

### Key Files

#### Types
- `src/types/yugioh.ts` - TypeScript interfaces for cards, lists, and API responses
  - Updated with `isForSale` field for Collection/For-Sale sync

#### Context & State Management
- `src/contexts/ToastContext.tsx` - Global toast notification system
- `src/contexts/YugiohAuthContext.tsx` - Authentication state management
- `src/app/yugioh/layout.tsx` - Layout with ToastProvider for all yugioh pages

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

### Phase 6: For-Sale Management & Toast System (Latest)
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

## Future Considerations

### Potential Enhancements
- Bulk card import from CSV/spreadsheet
- Price tracking over time with charts
- Trading/sale marketplace integration
- QR code generation for card sharing
- Export lists to PDF or Excel
- Deck builder integration
- Card condition tracking
- Multiple language support

### Performance Optimizations
- Implement client-side caching for frequently searched cards
- Add pagination for large result sets
- Lazy load card images
- Optimize OCR processing with WebAssembly

### API Alternatives
- TCGPlayer API (requires API key, paid)
- Scryfall-like caching layer
- Self-hosted card database for faster lookups

## Development Notes

### Testing Set Codes
Common test cases:
- `LOB-EN001` - Standard format
- `CT13-EN008` - Numbers in prefix
- `MVP1-ENSV4` - Letters in suffix
- `SDK-001` - Short format
- `5DS1-EN001` - Numbers at start

### Debug Console Logs
Search operations include emoji-prefixed logs:
- `🔍` - Search initiated
- `✅` - Successful API response
- `❌` - Error or not found
- `🏷️` - Set code format detected

### Component Memoization
CardDisplay uses React.memo with custom comparison to prevent unnecessary re-renders when card ID and compact mode haven't changed.

## Git Workflow

Following CLAUDE.md policies:
- Never commit or push without explicit user request
- No Claude Code co-authorship in commits
- Clean, descriptive commit messages
- Conventional commit format when appropriate

---

**Last Updated**: November 23, 2025
**Status**: Production ready - For-Sale management system fully implemented
**Version**: Next.js 15, React 19, MongoDB, Tesseract.js 5
