// Yu-Gi-Oh Card Types based on YGOPRODeck API

export interface YugiohCard {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  race: string;
  archetype?: string;

  // Monster attributes
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  scale?: number;
  linkval?: number;
  linkmarkers?: string[];

  // Card images
  card_images: CardImage[];

  // Card sets
  card_sets?: CardSet[];

  // Prices
  card_prices?: CardPrice[];

  // Specific set info (when searched by set code)
  specificSetInfo?: {
    setCode: string;
    setName: string;
    setRarity: string;
    setPrice: string;
  };
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface CardPrice {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
  coolstuffinc_price?: string;
}

export type ListType = 'collection' | 'for-sale' | 'wishlist';

export interface CardInList {
  cardId: number;
  cardName: string;
  cardImage: string;
  localImagePath?: string; // Path to locally stored image
  setCode: string; // Required: Set code (e.g., LOB-EN001)
  setName: string; // Required: Set name
  setRarity: string; // Required: Card rarity in this set
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
  isForSale?: boolean; // Indica si la carta está en venta (solo para collection)
}

export interface YugiohList {
  _id?: string;
  userId?: string; // Optional for backward compatibility, required for new lists
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
export type DeckZone = 'main' | 'extra' | 'side';

export interface CardInDeck {
  cardId: number;
  cardName: string;
  cardImage: string;
  cardType: string;
  frameType: string;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  race: string;
  quantity: number;
  zone: DeckZone;
}

export interface YugiohDeck {
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
  MAIN_MIN: 40,
  MAIN_MAX: 60,
  EXTRA_MAX: 15,
  SIDE_MAX: 15,
  MAX_COPIES: 3,
} as const;

// Extra deck frame types
export const EXTRA_DECK_FRAME_TYPES = ['fusion', 'synchro', 'xyz', 'link'] as const;
