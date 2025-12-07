# /roms - ROMs Index Summary

## Overview
The `/roms` route is a comprehensive gaming console library that provides direct access to ROM downloads for classic gaming systems from Nintendo, Sony, Microsoft, and Sega.

## Current Implementation

### Route Type
- **Type**: Next.js Page (Full Application)
- **File**: `src/app/roms/page.tsx`
- **Layout**: `src/app/roms/layout.tsx`
- **Styles**: `src/app/roms/roms.module.scss`
- **No Header/Footer**: Standalone full-page experience

### Features

#### 1. Console Library (23 Consoles Total)
**Nintendo (13 consoles)**
- NES (1983) → Myrient
- Game Boy (1989) → Myrient
- SNES (1990) → Myrient
- Virtual Boy (1995) → Myrient
- Nintendo 64 (1996) → Myrient
- Game Boy Color (1998) → Myrient
- Game Boy Advance (2001) → Myrient
- GameCube (2001) → Myrient
- Nintendo DS (2004) → Myrient
- Wii (2006) → Myrient
- Nintendo 3DS (2011) → Myrient
- Wii U (2012) → Myrient
- Nintendo Switch (2017) → RomsLab

**Sony PlayStation (6 consoles)**
- PlayStation (1994) → Myrient
- PlayStation 2 (2000) → Myrient
- PSP (2004) → Myrient
- PlayStation 3 (2006) → Myrient
- PS Vita (2011) → Myrient
- PlayStation 4 (2013) → RomsFun

**Microsoft (2 consoles)**
- Xbox (2001) → Myrient
- Xbox 360 (2005) → Myrient

**Sega (2 consoles)**
- Dreamcast (1998) → Myrient
- Sega Saturn (1994) → Myrient

#### 2. Fan Translate Section
- Links to TraduSquare (https://tradusquare.es/traducciones/)
- Provides access to fan-translated ROMs
- Custom icon from console image pack

#### 3. Navigation
- "Regresar a avsolem.com" button (top-right)
- Returns to main portfolio site
- Positioned absolutely (not fixed)

### Design System

#### Visual Style
- **Background**: Purple gradient (135deg, #667eea 0%, #764ba2 100%)
- **Full-screen layout**: Fixed position with overflow-y scroll
- **Custom design**: Standalone SCSS styling

#### Component Styles
- **Title**: "💾 ROMS INDEX" - White text, responsive sizing
- **Company Logos**: Official Nintendo, PlayStation, Microsoft, Sega SVG logos
- **Console Cards**: Square cards (180px × 180px)
  - Background: #e8e8e8 (light gray)
  - Border radius: 20px
  - Hover animation: translateY(-8px) scale(1.02)
  - Images: High-quality PNG from "Dark - Color" pack (v2.1)
  - Lazy loading enabled
- **Card Info**: Name + Year badges below each card
  - Name: White text with shadow
  - Year: White text on semi-transparent background

#### Responsive Design
- **Desktop**: Auto-fill grid (minmax 180px)
- **Tablet (≤1024px)**: Adjusted grid (minmax 160px)
- **Mobile (≤768px)**: Smaller cards (minmax 140px)
- **Small Mobile (≤480px)**: 2-column grid, optimized spacing

### Technical Implementation

#### Images
- **Source**: v2.1 Recommended Versions (Dark - Color pack)
- **Format**: PNG (optimized by Next.js Image component)
- **Total Size**: 1.9MB (29 images)
- **Location**: `/public/images/consoles/`
- **Optimization**:
  - Lazy loading (`loading="lazy"`)
  - Responsive sizes attribute
  - Next.js automatic WebP conversion

#### Links
- All console cards open in new tab (`target="_blank"`)
- Security: `rel="noopener noreferrer"`
- External sources: Myrient (free ROM database), RomsLab, RomsFun

#### Navigation Fix
- Footer links to /roms and /yugioh force full page reload
- Prevents Header/Footer persistence issue
- Uses `window.location.href` for navigation

### Integration

#### Footer Icon
- Added to `src/resources/content.js` social array
- Icon: `save` (floppy disk 💾)
- Added to `src/resources/icons.ts` (FaSave from react-icons)
- Appears in home footer alongside Yu-Gi-Oh dragon

#### Layout Configuration
- `src/app/layout.tsx` detects `/roms` route
- Excludes Header and Footer components
- Standalone page experience

### External Resources

#### Myrient Links (Primary Source)
- Fast & unrestricted access
- No-Intro and Redump collections
- Official ROM preservation database
- Base URL: https://myrient.erista.me/files/

#### Alternative Sources
- **Switch**: https://romslab.com/
- **PS4**: https://romsfun.com/roms/playstation-4/

#### Fan Translations
- **TraduSquare**: https://tradusquare.es/traducciones/
- Spanish ROM translation community

### Performance Optimizations

1. **Image Loading**
   - Lazy loading for all console images
   - Responsive sizes for optimal bandwidth
   - Next.js automatic optimization

2. **Mobile Optimizations**
   - 2-column grid on small screens
   - Reduced padding and margins
   - Smaller font sizes
   - Optimized logo heights

3. **CSS Optimizations**
   - Single SCSS module
   - Efficient flexbox layout
   - Hardware-accelerated transforms
   - Minimal media queries

### SEO & Metadata
- **Title**: "ROMS INDEX"
- **Description**: "Browse through classic gaming consoles from Nintendo, Sony, Microsoft, and Sega"
- **Meta Tags**: Configured in `layout.tsx`

## Files Structure

```
src/app/roms/
├── page.tsx              # Main component (23 consoles + fan translate)
├── layout.tsx            # Metadata and layout wrapper
├── roms.module.scss      # Complete styling (290+ lines)
└── summary.md            # This documentation

public/images/consoles/
├── Nintendo Entertainment System.png
├── Nintendo Game Boy.png
├── (... 21 more console images)
└── fan-translate.png     # TraduSquare icon
```

## User Flow

1. User clicks floppy disk 💾 icon in home footer
2. Page fully reloads to `/roms` (no header/footer)
3. Displays 4 company sections with their consoles
4. User clicks console card → Opens ROM download page
5. "Regresar a avsolem.com" returns to portfolio

## Future Enhancements (Potential)

### Short Term
- Add search/filter functionality
- Console hover tooltips with additional info
- Keyboard navigation support

### Medium Term
- Integration with ROM metadata API (RAWG/IGDB)
- Favorites system (localStorage)
- Game counts per console

### Long Term
- Full ROM manager (similar to /yugioh)
- User collections
- ROM screenshots gallery
- Integration with emulator guides

## Notes

- **Copyright Compliance**: Links to external sources only (no ROM hosting)
- **Educational Purpose**: Preservation and archival access
- **Modern Consoles**: Switch/PS4 link to alternative sources (not in Myrient)
- **Image Attribution**: v2.1 pack by Dan Patrick (community resource)
- **Accessibility**: Alt tags, semantic HTML, keyboard accessible

## Related Files
- `src/resources/content.js` - Footer icon configuration
- `src/resources/icons.ts` - Save icon registration
- `src/components/Footer.tsx` - Navigation handling
- `src/app/layout.tsx` - Route detection and layout exclusion

## Last Updated
2025-11-24 - Complete implementation with 23 consoles, fan translate section, and mobile optimizations
