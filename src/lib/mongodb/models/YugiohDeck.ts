import { Collection, ObjectId, Document, UpdateFilter } from 'mongodb';
import { getDatabase } from '../connection';
import { YugiohDeck, CardInDeck, DeckZone, DECK_LIMITS, EXTRA_DECK_FRAME_TYPES } from '@/types/yugioh';

const COLLECTION_NAME = 'yugioh_decks';

async function getCollection(): Promise<Collection<Document>> {
  const db = await getDatabase();
  return db.collection(COLLECTION_NAME);
}

function toFilter(deckId: string, userId: string) {
  return { _id: new ObjectId(deckId), userId };
}

function toDeck(doc: Document): YugiohDeck {
  return { ...doc, _id: doc._id?.toString() } as unknown as YugiohDeck;
}

export async function createDeckIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ userId: 1 });
}

/**
 * Get all decks for a user
 */
export async function getUserDecks(userId: string): Promise<YugiohDeck[]> {
  const col = await getCollection();
  const docs = await col.find({ userId }).sort({ updatedAt: -1 }).toArray();
  return docs.map(toDeck);
}

/**
 * Get a single deck by ID
 */
export async function getDeckById(deckId: string, userId: string): Promise<YugiohDeck | null> {
  const col = await getCollection();
  const doc = await col.findOne(toFilter(deckId, userId));
  if (!doc) return null;
  return toDeck(doc);
}

/**
 * Create a new deck
 */
export async function createDeck(
  userId: string,
  name: string,
  description?: string
): Promise<YugiohDeck | { error: string }> {
  const col = await getCollection();

  const count = await col.countDocuments({ userId });
  if (count >= DECK_LIMITS.MAX_DECKS_PER_USER) {
    return { error: 'DECK_LIMIT_REACHED' };
  }

  const now = new Date();
  const newDeck = {
    userId,
    name,
    description,
    cards: [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(newDeck);
  return { ...newDeck, _id: result.insertedId.toString() } as YugiohDeck;
}

/**
 * Update deck metadata (name, description)
 */
export async function updateDeckMeta(
  deckId: string,
  userId: string,
  updates: { name?: string; description?: string }
): Promise<boolean> {
  const col = await getCollection();
  const setFields: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.name !== undefined) setFields.name = updates.name;
  if (updates.description !== undefined) setFields.description = updates.description;

  const result = await col.updateOne(toFilter(deckId, userId), { $set: setFields });
  return result.matchedCount > 0;
}

/**
 * Determine correct zone for a card based on its frame type
 */
export function getCardZone(frameType: string): DeckZone {
  if (EXTRA_DECK_FRAME_TYPES.includes(frameType as typeof EXTRA_DECK_FRAME_TYPES[number])) {
    return 'extra';
  }
  return 'main';
}

/**
 * Validate adding a card to a deck zone
 */
function validateAddCard(
  deck: YugiohDeck,
  card: Omit<CardInDeck, 'quantity' | 'zone'>,
  zone: DeckZone,
  quantity: number
): string | null {
  const totalCopies = deck.cards
    .filter((c) => c.cardId === card.cardId)
    .reduce((sum, c) => sum + c.quantity, 0);

  if (totalCopies + quantity > DECK_LIMITS.MAX_COPIES) {
    return 'MAX_COPIES_EXCEEDED';
  }

  const zoneCards = deck.cards
    .filter((c) => c.zone === zone)
    .reduce((sum, c) => sum + c.quantity, 0);

  if (zone === 'main' && zoneCards + quantity > DECK_LIMITS.MAIN_MAX) {
    return 'MAIN_DECK_FULL';
  }
  if (zone === 'extra' && zoneCards + quantity > DECK_LIMITS.EXTRA_MAX) {
    return 'EXTRA_DECK_FULL';
  }
  if (zone === 'side' && zoneCards + quantity > DECK_LIMITS.SIDE_MAX) {
    return 'SIDE_DECK_FULL';
  }

  return null;
}

/**
 * Add a card to a deck
 */
export async function addCardToDeck(
  deckId: string,
  userId: string,
  card: Omit<CardInDeck, 'quantity' | 'zone'>,
  zone: DeckZone,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  const deck = await getDeckById(deckId, userId);
  if (!deck) return { success: false, error: 'DECK_NOT_FOUND' };

  const validationError = validateAddCard(deck, card, zone, quantity);
  if (validationError) return { success: false, error: validationError };

  const col = await getCollection();
  const filter = toFilter(deckId, userId);

  const existingIndex = deck.cards.findIndex(
    (c) => c.cardId === card.cardId && c.zone === zone
  );

  if (existingIndex >= 0) {
    const update: UpdateFilter<Document> = {
      $inc: { [`cards.${existingIndex}.quantity`]: quantity },
      $set: { updatedAt: new Date() },
    };
    await col.updateOne(
      { ...filter, 'cards.cardId': card.cardId, 'cards.zone': zone },
      update
    );
  } else {
    await col.updateOne(filter, {
      $push: { cards: { ...card, quantity, zone } },
      $set: { updatedAt: new Date() },
    } as Document);
  }

  if (!deck.coverImage && zone === 'main') {
    await col.updateOne(
      { ...filter, coverImage: { $exists: false } },
      { $set: { coverImage: card.cardImage } }
    );
  }

  return { success: true };
}

/**
 * Remove a card from a deck zone
 */
export async function removeCardFromDeck(
  deckId: string,
  userId: string,
  cardId: number,
  zone: DeckZone
): Promise<boolean> {
  const deck = await getDeckById(deckId, userId);
  if (!deck) return false;

  const cardIndex = deck.cards.findIndex((c) => c.cardId === cardId && c.zone === zone);
  if (cardIndex === -1) return false;

  const col = await getCollection();
  const filter = toFilter(deckId, userId);
  const card = deck.cards[cardIndex];

  if (card.quantity > 1) {
    await col.updateOne(filter, {
      $set: {
        [`cards.${cardIndex}.quantity`]: card.quantity - 1,
        updatedAt: new Date(),
      },
    });
  } else {
    deck.cards.splice(cardIndex, 1);
    await col.updateOne(filter, {
      $set: { cards: deck.cards, updatedAt: new Date() },
    });
  }

  return true;
}

/**
 * Update the full cards array of a deck (for bulk operations)
 */
export async function updateDeckCards(
  deckId: string,
  userId: string,
  cards: CardInDeck[]
): Promise<boolean> {
  const col = await getCollection();
  const result = await col.updateOne(
    toFilter(deckId, userId),
    { $set: { cards, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

/**
 * Delete a deck
 */
export async function deleteDeck(deckId: string, userId: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne(toFilter(deckId, userId));
  return result.deletedCount > 0;
}

/**
 * Delete all decks for a user (used when deleting account)
 */
export async function deleteUserDecks(userId: string): Promise<boolean> {
  const col = await getCollection();
  await col.deleteMany({ userId });
  return true;
}
