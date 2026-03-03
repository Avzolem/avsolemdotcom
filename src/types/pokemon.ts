// Pokemon TCG Card Types based on TCGdex API v2

// Summary card returned by search endpoints
export interface PokemonCardSummary {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

// Full card returned by /cards/{id}
export interface PokemonCard {
  id: string; // e.g., "swsh4-25"
  localId: string;
  name: string;
  category: string; // "Pokemon", "Trainer", "Energy"
  hp?: number;
  types?: string[]; // ["Fire", "Water", etc.]
  evolveFrom?: string;
  stage?: string; // "Basic", "Stage1", "Stage2", "VMAX", "V", etc.

  // Rules text (for special cards like V, VMAX, EX)
  rules?: string[];

  // Abilities
  abilities?: PokemonAbility[];

  // Attacks
  attacks?: PokemonAttack[];

  // Weaknesses & Resistances
  weaknesses?: PokemonWeakness[];
  resistances?: PokemonResistance[];

  // Retreat cost
  retreat?: number;

  // Set info
  set: PokemonSet;
  rarity?: string;
  illustrator?: string;
  dexId?: number[];
  regulationMark?: string;

  // Legalities
  legal?: {
    standard?: boolean;
    expanded?: boolean;
  };

  // Images
  image?: string; // base URL, append /high.png or /low.png
  // Compat fields for components
  images: {
    small: string;
    large: string;
  };

  // Variants
  variants?: {
    firstEdition?: boolean;
    holo?: boolean;
    normal?: boolean;
    reverse?: boolean;
  };

  // Prices (TCGdex includes these on individual cards)
  pricing?: {
    cardmarket?: {
      updated?: string;
      unit?: string;
      avg?: number;
      low?: number;
      trend?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
    };
    tcgplayer?: {
      updated?: string;
      unit?: string;
      holofoil?: PokemonPriceData;
      normal?: PokemonPriceData;
      reverseHolofoil?: PokemonPriceData;
      '1stEditionHolofoil'?: PokemonPriceData;
      '1stEditionNormal'?: PokemonPriceData;
    };
  };

  // Compat aliases (mapped from TCGdex format)
  supertype: string;
  subtypes?: string[];
  number: string;
  artist?: string;
  flavorText?: string;
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      normal?: PokemonPriceData;
      holofoil?: PokemonPriceData;
      reverseHolofoil?: PokemonPriceData;
      '1stEditionHolofoil'?: PokemonPriceData;
      '1stEditionNormal'?: PokemonPriceData;
    };
  };
  cardmarket?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
    };
  };
}

export interface PokemonAbility {
  name: string;
  effect?: string;
  text?: string; // compat alias
  type: string; // "Ability", "Pokemon Power", etc.
}

export interface PokemonAttack {
  name: string;
  cost?: string[]; // Energy types required
  damage?: number | string;
  effect?: string;
  text?: string; // compat alias
  convertedEnergyCost?: number;
}

export interface PokemonWeakness {
  type: string;
  value: string; // e.g., "×2"
}

export interface PokemonResistance {
  type: string;
  value: string; // e.g., "-30"
}

export interface PokemonSet {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount?: {
    total: number;
    official: number;
  };
  // Compat fields
  series?: string;
  printedTotal?: number;
  total?: number;
  releaseDate?: string;
  updatedAt?: string;
  images?: {
    symbol?: string;
    logo?: string;
  };
}

export interface PokemonPriceData {
  low?: number;
  lowPrice?: number;
  mid?: number;
  midPrice?: number;
  high?: number;
  highPrice?: number;
  market?: number;
  marketPrice?: number;
  directLow?: number;
  directLowPrice?: number;
  productId?: number;
}

export type ListType = 'collection' | 'for-sale' | 'wishlist';

export interface CardInList {
  cardId: string; // Pokemon card IDs are strings (e.g., "swsh4-25")
  cardName: string;
  cardImage: string;
  localImagePath?: string;
  setCode: string; // Set ID (e.g., "swsh4")
  setName: string;
  setRarity: string;
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
  isForSale?: boolean;
}

export interface PokemonList {
  _id?: string;
  userId?: string;
  type: ListType;
  cards: CardInList[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListStats {
  totalCards: number;
  totalValue: number;
  mostExpensiveCard?: CardInList;
  lastUpdated?: Date;
}

// Deck Builder Types
export type DeckZone = 'pokemon' | 'trainer' | 'energy';

export interface CardInDeck {
  cardId: string;
  cardName: string;
  cardImage: string;
  cardType: string; // category: "Pokemon", "Trainer", "Energy"
  subtypes: string[];
  hp?: string;
  types?: string[];
  quantity: number;
  zone: DeckZone;
}

export interface PokemonDeck {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  cards: CardInDeck[];
  createdAt: Date;
  updatedAt: Date;
}

export const DECK_LIMITS = {
  MAX_DECKS_PER_USER: 3,
  DECK_SIZE: 60,
  SIDE_MAX: 15,
  MAX_COPIES: 4,
} as const;

export const BASIC_ENERGY_NAMES = [
  'Fire Energy',
  'Water Energy',
  'Grass Energy',
  'Lightning Energy',
  'Psychic Energy',
  'Fighting Energy',
  'Darkness Energy',
  'Metal Energy',
  'Fairy Energy',
] as const;

// Helper to determine deck zone from category/supertype
export function getCardZone(categoryOrSupertype: string): DeckZone {
  const normalized = categoryOrSupertype.toLowerCase().replace('é', 'e');
  if (normalized.includes('pokemon') || normalized === 'pokémon') return 'pokemon';
  if (normalized === 'trainer') return 'trainer';
  if (normalized === 'energy') return 'energy';
  return 'pokemon';
}

export function isBasicEnergy(cardName: string, subtypes?: string[]): boolean {
  if (subtypes?.includes('Basic') && BASIC_ENERGY_NAMES.some(e => cardName.includes(e.replace(' Energy', '')))) {
    return true;
  }
  return BASIC_ENERGY_NAMES.includes(cardName as typeof BASIC_ENERGY_NAMES[number]);
}

// pokemontcg.io CDN for fallback images
const POKEMONTCG_CDN = 'https://images.pokemontcg.io';

// Some TCGdex set IDs differ from pokemontcg.io CDN
const SET_ID_MAP: Record<string, string> = {
  'sm7.5': 'sm75',
  'sm11.5': 'sm115',
  'sm3.5': 'sm35',
  'ex5.5': 'ex55',
  'swsh10.5': 'swsh105',
  'swsh12.5': 'swsh125',
  'sv03.5': 'sv3pt5',
  'sv04.5': 'sv4pt5',
  'sv05.5': 'sv5pt5',
  'sv06.5': 'sv6pt5',
};

function getFallbackImageUrl(setId: string, localId: string): string {
  const mappedSet = SET_ID_MAP[setId] || setId;
  return `${POKEMONTCG_CDN}/${mappedSet}/${localId}.png`;
}

// Transform raw TCGdex card to our PokemonCard format
export function transformTcgdexCard(raw: any): PokemonCard {
  const category = raw.category || 'Pokemon';
  const imageBase = raw.image || '';
  const setId = raw.set?.id || '';
  const localId = raw.localId || '';

  // If TCGdex has no image, use pokemontcg.io CDN as fallback
  let smallImage = imageBase ? `${imageBase}/low.png` : '';
  let largeImage = imageBase ? `${imageBase}/high.png` : '';

  if (!imageBase && setId && localId) {
    const fallback = getFallbackImageUrl(setId, localId);
    smallImage = fallback;
    largeImage = fallback;
  }

  return {
    ...raw,
    id: raw.id,
    localId,
    name: raw.name,
    category,
    supertype: category === 'Pokemon' ? 'Pokémon' : category,
    subtypes: raw.stage ? [raw.stage] : [],
    hp: raw.hp,
    types: raw.types || [],
    evolveFrom: raw.evolveFrom,
    stage: raw.stage,
    abilities: raw.abilities?.map((a: any) => ({
      ...a,
      text: a.effect || a.text || '',
    })),
    attacks: raw.attacks?.map((a: any) => ({
      ...a,
      text: a.effect || a.text || '',
      damage: a.damage != null ? String(a.damage) : '',
      convertedEnergyCost: a.cost?.length || 0,
    })),
    weaknesses: raw.weaknesses,
    resistances: raw.resistances,
    retreat: raw.retreat,
    set: {
      id: setId,
      name: raw.set?.name || '',
      logo: raw.set?.logo,
      symbol: raw.set?.symbol,
      cardCount: raw.set?.cardCount,
      images: {
        symbol: raw.set?.symbol || '',
        logo: raw.set?.logo || '',
      },
    },
    number: localId,
    rarity: raw.rarity,
    artist: raw.illustrator,
    illustrator: raw.illustrator,
    regulationMark: raw.regulationMark,
    legal: raw.legal,
    image: imageBase,
    images: {
      small: smallImage,
      large: largeImage,
    },
    variants: raw.variants,
    pricing: raw.pricing,
    tcgplayer: raw.pricing?.tcgplayer ? {
      updatedAt: raw.pricing.tcgplayer.updated,
      prices: {
        holofoil: raw.pricing.tcgplayer.holofoil,
        normal: raw.pricing.tcgplayer.normal,
        reverseHolofoil: raw.pricing.tcgplayer.reverseHolofoil,
        '1stEditionHolofoil': raw.pricing.tcgplayer['1stEditionHolofoil'],
        '1stEditionNormal': raw.pricing.tcgplayer['1stEditionNormal'],
      },
    } : undefined,
    cardmarket: raw.pricing?.cardmarket ? {
      updatedAt: raw.pricing.cardmarket.updated,
      prices: {
        averageSellPrice: raw.pricing.cardmarket.avg,
        lowPrice: raw.pricing.cardmarket.low,
        trendPrice: raw.pricing.cardmarket.trend,
        avg1: raw.pricing.cardmarket.avg1,
        avg7: raw.pricing.cardmarket.avg7,
        avg30: raw.pricing.cardmarket.avg30,
      },
    } : undefined,
  };
}
