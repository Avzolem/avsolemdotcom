// Pokemon TCG Constants and Configuration

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

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.tcgdex.net/v2/en',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 500,
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 100,
  PAGE_SIZE: 50,
} as const;

// Pokemon Types (Energy Types)
export const POKEMON_TYPES = [
  'Colorless',
  'Darkness',
  'Dragon',
  'Fairy',
  'Fighting',
  'Fire',
  'Grass',
  'Lightning',
  'Metal',
  'Psychic',
  'Water',
] as const;

// Type colors for UI
export const TYPE_COLORS: Record<string, string> = {
  Colorless: '#A8A878',
  Darkness: '#705848',
  Dragon: '#7038F8',
  Fairy: '#EE99AC',
  Fighting: '#C03028',
  Fire: '#F08030',
  Grass: '#78C850',
  Lightning: '#F8D030',
  Metal: '#B8B8D0',
  Psychic: '#F85888',
  Water: '#6890F0',
};

// Card Supertypes
export const SUPERTYPES = [
  'Pokémon',
  'Trainer',
  'Energy',
] as const;

// Pokemon Subtypes
export const POKEMON_SUBTYPES = [
  'Basic',
  'Stage 1',
  'Stage 2',
  'BREAK',
  'EX',
  'ex',
  'GX',
  'V',
  'VMAX',
  'VSTAR',
  'Tag Team',
  'Mega',
  'Restored',
  'Level-Up',
  'Baby',
  'Legend',
] as const;

// Trainer Subtypes
export const TRAINER_SUBTYPES = [
  'Item',
  'Supporter',
  'Stadium',
  'Pokémon Tool',
  "Technical Machine",
] as const;

// Energy Subtypes
export const ENERGY_SUBTYPES = [
  'Basic',
  'Special',
] as const;

// Rarities
export const RARITIES = [
  'Amazing Rare',
  'Common',
  'LEGEND',
  'Promo',
  'Rare',
  'Rare ACE',
  'Rare BREAK',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo LV.X',
  'Rare Holo Star',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Holo VSTAR',
  'Rare Prime',
  'Rare Prism Star',
  'Rare Rainbow',
  'Rare Secret',
  'Rare Shining',
  'Rare Shiny',
  'Rare Shiny GX',
  'Rare Ultra',
  'Uncommon',
] as const;

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
