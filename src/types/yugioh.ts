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
  addedAt: Date;
  quantity: number;
  price?: number;
  notes?: string;
}

export interface YugiohList {
  _id?: string;
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
