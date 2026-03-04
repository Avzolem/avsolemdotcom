// Magic: The Gathering Card Types based on Scryfall API

// Raw Scryfall card response
export interface ScryfallCard {
  id: string; // UUID
  oracle_id?: string;
  name: string;
  lang: string;
  released_at?: string;
  uri: string;
  scryfall_uri: string;
  layout: string; // normal, transform, modal_dfc, split, flip, adventure, etc.

  // Images
  image_uris?: ScryfallImageUris;

  // Mana
  mana_cost?: string; // e.g., "{2}{W}{U}"
  cmc: number; // Converted mana cost
  type_line: string; // e.g., "Creature — Human Wizard"
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;

  // Colors
  colors?: string[]; // ["W", "U", "B", "R", "G"]
  color_identity: string[];
  keywords?: string[];

  // Legalities
  legalities: Record<string, string>; // { standard: "legal", modern: "legal", ... }

  // Set info
  set: string;
  set_name: string;
  set_type?: string;
  collector_number: string;
  rarity: string; // common, uncommon, rare, mythic

  // Prices
  prices: {
    usd?: string | null;
    usd_foil?: string | null;
    usd_etched?: string | null;
    eur?: string | null;
    eur_foil?: string | null;
    tix?: string | null;
  };

  // Related
  artist?: string;
  flavor_text?: string;
  watermark?: string;
  border_color?: string;
  frame?: string;
  full_art?: boolean;
  textless?: boolean;
  booster?: boolean;
  edhrec_rank?: number;

  // Double-faced cards
  card_faces?: ScryfallCardFace[];

  // Purchase URIs
  purchase_uris?: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };

  // Related URIs
  related_uris?: Record<string, string>;
}

export interface ScryfallCardFace {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors?: string[];
  image_uris?: ScryfallImageUris;
  artist?: string;
  flavor_text?: string;
}

export interface ScryfallImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export interface ScryfallSearchResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

// Transformed card for our app
export interface MagicCard {
  id: string; // Scryfall UUID
  name: string;
  manaCost: string;
  cmc: number;
  typeLine: string;
  oracleText: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors: string[];
  colorIdentity: string[];
  keywords: string[];
  legalities: Record<string, string>;
  set: string;
  setName: string;
  collectorNumber: string;
  rarity: string;
  artist: string;
  flavorText: string;
  layout: string;

  // Images
  images: {
    small: string;
    large: string;
    artCrop: string;
    png: string;
  };

  // Double-faced
  cardFaces?: MagicCardFace[];
  isDoubleFaced: boolean;

  // Prices
  prices: {
    usd: number;
    usdFoil: number;
    eur: number;
    eurFoil: number;
  };

  // Purchase links
  purchaseUris?: {
    tcgplayer?: string;
    cardmarket?: string;
  };

  // Compat fields for shared components
  supertype: string; // Creature, Instant, Sorcery, etc.
  subtypes: string[];
  number: string;
}

export interface MagicCardFace {
  name: string;
  manaCost: string;
  typeLine: string;
  oracleText: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors: string[];
  images?: {
    small: string;
    large: string;
    artCrop: string;
    png: string;
  };
  artist?: string;
  flavorText?: string;
}

export type ListType = 'collection' | 'for-sale' | 'wishlist';

export interface CardInList {
  cardId: string; // Scryfall UUID
  cardName: string;
  cardImage: string;
  localImagePath?: string;
  setCode: string;
  setName: string;
  setRarity: string;
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
  isForSale?: boolean;
}

export interface MagicList {
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
export type DeckZone = 'main' | 'sideboard';

export interface CardInDeck {
  cardId: string;
  cardName: string;
  cardImage: string;
  cardType: string; // type_line
  subtypes: string[];
  manaCost?: string;
  cmc?: number;
  colors?: string[];
  power?: string;
  toughness?: string;
  quantity: number;
  zone: DeckZone;
}

export interface MagicDeck {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  format?: string;
  coverImage?: string;
  cards: CardInDeck[];
  createdAt: Date;
  updatedAt: Date;
}

export const DECK_LIMITS = {
  MAX_DECKS_PER_USER: 3,
  MAIN_MIN: 60,
  SIDEBOARD_MAX: 15,
  MAX_COPIES: 4,
} as const;

export const BASIC_LAND_NAMES = [
  'Plains',
  'Island',
  'Swamp',
  'Mountain',
  'Forest',
  'Wastes',
  'Snow-Covered Plains',
  'Snow-Covered Island',
  'Snow-Covered Swamp',
  'Snow-Covered Mountain',
  'Snow-Covered Forest',
] as const;

// Helper to determine deck zone from type_line
export function getCardZone(typeLine: string): DeckZone {
  return 'main';
}

// Check if a card is a basic land (unlimited copies allowed)
export function isBasicLand(cardName: string): boolean {
  return BASIC_LAND_NAMES.some(
    (land) => cardName === land || cardName.toLowerCase() === land.toLowerCase()
  );
}

// Parse mana symbols from mana cost string like "{2}{W}{U}"
export function parseManaSymbols(manaCost: string): string[] {
  if (!manaCost) return [];
  const matches = manaCost.match(/\{[^}]+\}/g);
  return matches ? matches.map((m) => m.replace(/[{}]/g, '')) : [];
}

// Get the primary type from type_line
export function getPrimaryType(typeLine: string): string {
  if (!typeLine) return 'Unknown';
  const mainType = typeLine.split('—')[0].trim().split(' // ')[0].trim();

  if (mainType.includes('Creature')) return 'Creature';
  if (mainType.includes('Instant')) return 'Instant';
  if (mainType.includes('Sorcery')) return 'Sorcery';
  if (mainType.includes('Enchantment')) return 'Enchantment';
  if (mainType.includes('Artifact')) return 'Artifact';
  if (mainType.includes('Planeswalker')) return 'Planeswalker';
  if (mainType.includes('Land')) return 'Land';
  if (mainType.includes('Battle')) return 'Battle';
  return mainType;
}

// Transform Scryfall card to our MagicCard format
export function transformScryfallCard(raw: ScryfallCard): MagicCard {
  const isDoubleFaced = !!(
    raw.card_faces &&
    raw.card_faces.length > 0 &&
    !raw.image_uris
  );

  const frontFace = raw.card_faces?.[0];

  // For double-faced cards without top-level image_uris, use face images
  const imageUris = raw.image_uris || frontFace?.image_uris;

  const images = {
    small: imageUris?.small || '',
    large: imageUris?.large || imageUris?.normal || '',
    artCrop: imageUris?.art_crop || '',
    png: imageUris?.png || '',
  };

  const cardFaces: MagicCardFace[] | undefined = raw.card_faces?.map((face) => ({
    name: face.name,
    manaCost: face.mana_cost || '',
    typeLine: face.type_line || '',
    oracleText: face.oracle_text || '',
    power: face.power,
    toughness: face.toughness,
    loyalty: face.loyalty,
    colors: face.colors || [],
    images: face.image_uris
      ? {
          small: face.image_uris.small,
          large: face.image_uris.large || face.image_uris.normal,
          artCrop: face.image_uris.art_crop || '',
          png: face.image_uris.png || '',
        }
      : undefined,
    artist: face.artist,
    flavorText: face.flavor_text,
  }));

  const typeLine = raw.type_line || frontFace?.type_line || '';
  const primaryType = getPrimaryType(typeLine);

  const subtypeParts = typeLine.split('—');
  const subtypes = subtypeParts.length > 1
    ? subtypeParts[1].trim().split(' ').filter(Boolean)
    : [];

  return {
    id: raw.id,
    name: raw.name,
    manaCost: raw.mana_cost || frontFace?.mana_cost || '',
    cmc: raw.cmc,
    typeLine,
    oracleText: raw.oracle_text || frontFace?.oracle_text || '',
    power: raw.power || frontFace?.power,
    toughness: raw.toughness || frontFace?.toughness,
    loyalty: raw.loyalty || frontFace?.loyalty,
    colors: raw.colors || frontFace?.colors || [],
    colorIdentity: raw.color_identity || [],
    keywords: raw.keywords || [],
    legalities: raw.legalities || {},
    set: raw.set,
    setName: raw.set_name,
    collectorNumber: raw.collector_number,
    rarity: raw.rarity,
    artist: raw.artist || frontFace?.artist || '',
    flavorText: raw.flavor_text || frontFace?.flavor_text || '',
    layout: raw.layout,
    images,
    cardFaces,
    isDoubleFaced,
    prices: {
      usd: parseFloat(raw.prices?.usd || '0') || 0,
      usdFoil: parseFloat(raw.prices?.usd_foil || '0') || 0,
      eur: parseFloat(raw.prices?.eur || '0') || 0,
      eurFoil: parseFloat(raw.prices?.eur_foil || '0') || 0,
    },
    purchaseUris: raw.purchase_uris
      ? {
          tcgplayer: raw.purchase_uris.tcgplayer,
          cardmarket: raw.purchase_uris.cardmarket,
        }
      : undefined,
    supertype: primaryType,
    subtypes,
    number: raw.collector_number,
  };
}
