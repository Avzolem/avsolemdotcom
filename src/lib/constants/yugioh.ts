// Yu-Gi-Oh Constants and Configuration

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
  BASE_URL: 'https://db.ygoprodeck.com/api/v7',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 500, // 500ms
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 100,
} as const;

// Card Types
export const CARD_TYPES = [
  'Monster',
  'Spell',
  'Trap',
] as const;

export const MONSTER_TYPES = [
  'Normal Monster',
  'Effect Monster',
  'Fusion Monster',
  'Synchro Monster',
  'XYZ Monster',
  'Link Monster',
  'Pendulum Monster',
  'Ritual Monster',
] as const;

export const SPELL_TYPES = [
  'Normal',
  'Continuous',
  'Quick-Play',
  'Field',
  'Equip',
  'Ritual',
] as const;

export const TRAP_TYPES = [
  'Normal',
  'Continuous',
  'Counter',
] as const;

export const ATTRIBUTES = [
  'DARK',
  'LIGHT',
  'EARTH',
  'WATER',
  'FIRE',
  'WIND',
  'DIVINE',
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
