// Magic: The Gathering Constants and Configuration

export const LIST_TYPES = {
  COLLECTION: 'collection',
  FOR_SALE: 'for-sale',
  WISHLIST: 'wishlist',
} as const;

export const LIST_LABELS = {
  [LIST_TYPES.COLLECTION]: 'Colección',
  [LIST_TYPES.FOR_SALE]: 'En Venta',
  [LIST_TYPES.WISHLIST]: 'Wishlist',
} as const;

export const LIST_ICONS = {
  [LIST_TYPES.COLLECTION]: '📚',
  [LIST_TYPES.FOR_SALE]: '💰',
  [LIST_TYPES.WISHLIST]: '⭐',
} as const;

// Scryfall API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.scryfall.com',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 500,
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 75,
  PAGE_SIZE: 50,
  RATE_LIMIT_MS: 100, // 10 req/sec = 100ms between requests
  USER_AGENT: 'AvsolemMTGManager/1.0',
} as const;

// MTG Colors (WUBRG)
export const MTG_COLORS = ['W', 'U', 'B', 'R', 'G'] as const;

export const COLOR_NAMES: Record<string, string> = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
};

export const COLOR_HEX: Record<string, string> = {
  W: '#F9FAF4',
  U: '#0E68AB',
  B: '#150B00',
  R: '#D3202A',
  G: '#00733E',
};

// Card Types
export const CARD_TYPES = [
  'Creature',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Artifact',
  'Planeswalker',
  'Land',
  'Battle',
] as const;

// Rarities
export const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'mythic',
  'special',
  'bonus',
] as const;

export const RARITY_LABELS: Record<string, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  mythic: 'Mythic Rare',
  special: 'Special',
  bonus: 'Bonus',
};

export const RARITY_COLORS: Record<string, string> = {
  common: '#1a1a1a',
  uncommon: '#707883',
  rare: '#A58E4A',
  mythic: '#BF4427',
  special: '#905D98',
  bonus: '#905D98',
};

// Tournament Formats
export const FORMATS = [
  'standard',
  'pioneer',
  'modern',
  'legacy',
  'vintage',
  'commander',
  'pauper',
  'historic',
  'alchemy',
  'brawl',
] as const;

export const FORMAT_LABELS: Record<string, string> = {
  standard: 'Standard',
  pioneer: 'Pioneer',
  modern: 'Modern',
  legacy: 'Legacy',
  vintage: 'Vintage',
  commander: 'Commander',
  pauper: 'Pauper',
  historic: 'Historic',
  alchemy: 'Alchemy',
  brawl: 'Brawl',
};

// Error Messages
export const ERROR_MESSAGES = {
  NO_RESULTS: 'No se encontraron cartas con ese nombre',
  API_ERROR: 'Error al buscar cartas. Intenta de nuevo.',
  AUTH_ERROR: 'Error de autenticación. Intenta de nuevo.',
  ADD_ERROR: 'Error al agregar la carta',
  REMOVE_ERROR: 'Error al eliminar la carta',
  UPDATE_ERROR: 'Error al actualizar la carta',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CARD_ADDED: 'Carta agregada exitosamente',
  CARD_REMOVED: 'Carta eliminada exitosamente',
  CARD_UPDATED: 'Carta actualizada exitosamente',
  LOGIN_SUCCESS: 'Login exitoso',
} as const;
