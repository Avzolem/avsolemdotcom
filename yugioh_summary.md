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
- Local image storage for offline access
- Price tracking per card
- Requires authentication

## Technical Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 with SCSS modules
- **OCR**: Tesseract.js v5
- **API**: YGOPRODeck API (primary source)
- **Authentication**: Cookie-based sessions
- **Image Processing**: Canvas API for cropping

### Key Files

#### Types
- `src/types/yugioh.ts` - TypeScript interfaces for cards, lists, and API responses

#### Components
- `src/components/yugioh/CardSearch.tsx` - Main search interface with debouncing
- `src/components/yugioh/CardDisplay.tsx` - Card rendering with conditional display
- `src/components/yugioh/CardDisplay.module.scss` - Styling with Yu-Gi-Oh! brand colors
- `src/components/yugioh/CardScanner.tsx` - OCR scanning with camera integration
- `src/components/yugioh/AdvancedFilters.tsx` - Filter interface

#### API Routes
- `src/app/api/yugioh/search-setcode/route.ts` - Server-side set code lookup (avoids CORS)
- `src/app/api/yugioh/lists/[type]/route.ts` - Collection management endpoints
- `src/app/api/yugioh/download-image/route.ts` - Local image storage

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
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
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

### Phase 5: Differentiated Display (Latest)
- Added `specificSetInfo` field to card type
- Implemented conditional rendering based on search type
- Created collapsible sets dropdown for name searches
- Different price labels and display logic

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

**Last Updated**: Current session
**Status**: All features implemented and ready for testing
**Version**: Next.js 15, React 19, Tesseract.js 5
