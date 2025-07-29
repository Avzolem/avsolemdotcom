# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 web application for avsolem.com that includes:
- Web3 integration with Solana blockchain (via @thirdweb-dev and @solana/web3.js)
- NFT functionality with Metaplex Foundation libraries
- Authentication system with MongoDB adapter
- WhatsApp Cloud API integration
- Responsive UI with Tailwind CSS and DaisyUI
- Particle effects and animations

## Development Commands

```bash
# Install dependencies (use --legacy-peer-deps due to dependency conflicts)
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

### Key Directories
- `app/` - Next.js App Router structure with TypeScript
  - `api/` - API route handlers using Route Handlers
  - Main pages include: page.tsx (home), chat, nfts, whatsapp features, web3functions
- `components/` - Reusable React components organized by category
  - `common/` - Shared UI components (Header, Footer, Hero, etc.)
  - `forms/` - Form components and field elements
  - `layouts/` - Page layout components
- `lib/` - Utility libraries for specific functionality
  - `bulker.js` - Bulk operations handling
  - `metaplexlib.js` - Metaplex/NFT utilities
  - `sendwhatsapp.js` - WhatsApp messaging utilities
- `styles/` - Global CSS and Tailwind configurations
- `public/` - Static assets and images

### Important Configuration
- **Next.js Config**: ESLint errors are ignored during builds, redirects configured for /psvita and /roms, image domains configured for Cloudinary
- **Tailwind/DaisyUI**: Custom "avsolem" theme with dark base colors and multiple theme options
- **Web3**: ThirdwebProvider configured for Solana Devnet
- **Authentication**: AuthContextProvider wraps the entire app via providers.tsx
- **TypeScript**: Configured with non-strict mode, ES2017 target

### Technology Stack
- **Frontend**: React 19, Next.js 15 (App Router), TypeScript, Tailwind CSS, DaisyUI
- **Web3**: Solana blockchain, Metaplex for NFTs, ThirdwebProvider
- **Backend**: Next.js Route Handlers, MongoDB for data persistence
- **Integrations**: WhatsApp Cloud API, Cloudinary for media
- **Forms**: react-hook-form for form handling
- **Animations**: tsparticles for particle effects

## Development Notes

- The app uses App Router with TypeScript (.tsx files)
- API routes use Route Handlers in `app/api/` with route.ts files
- Client components are marked with 'use client' directive
- Component structure follows a modular approach with clear separation of concerns
- Custom theme "avsolem" is set as default with dark background
- MongoDB connection is used for authentication via next-auth adapter
- Images use Next.js Image component for optimization