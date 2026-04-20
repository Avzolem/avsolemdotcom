import { Collection, ObjectId, Document, UpdateFilter } from 'mongodb';
import { getDatabase } from '../connection';
import { MagicDeck, CardInDeck, DeckZone, DECK_LIMITS, isBasicLand } from '@/types/magic';

const COLLECTION_NAME = 'magic_decks';

async function getCollection(): Promise<Collection<Document>> {
  const db = await getDatabase();
  return db.collection(COLLECTION_NAME);
}

function toFilter(deckId: string, userId: string) {
  if (!ObjectId.isValid(deckId)) {
    throw new Error('Invalid deck id');
  }
  return { _id: new ObjectId(deckId), userId };
}

function toDeck(doc: Document): MagicDeck {
  return { ...doc, _id: doc._id?.toString() } as unknown as MagicDeck;
}

export async function createDeckIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ userId: 1 });
}

export async function getUserDecks(userId: string): Promise<MagicDeck[]> {
  const col = await getCollection();
  const docs = await col.find({ userId }).sort({ updatedAt: -1 }).toArray();
  return docs.map(toDeck);
}

export async function getDeckById(deckId: string, userId: string): Promise<MagicDeck | null> {
  const col = await getCollection();
  const doc = await col.findOne(toFilter(deckId, userId));
  if (!doc) return null;
  return toDeck(doc);
}

export async function createDeck(
  userId: string,
  name: string,
  description?: string,
  format?: string
): Promise<MagicDeck | { error: string }> {
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
    format,
    cards: [],
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(newDeck);
  return { ...newDeck, _id: result.insertedId.toString() } as MagicDeck;
}

export async function updateDeckMeta(
  deckId: string,
  userId: string,
  updates: { name?: string; description?: string; format?: string }
): Promise<boolean> {
  const col = await getCollection();
  const setFields: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.name !== undefined) setFields.name = updates.name;
  if (updates.description !== undefined) setFields.description = updates.description;
  if (updates.format !== undefined) setFields.format = updates.format;

  const result = await col.updateOne(toFilter(deckId, userId), { $set: setFields });
  return result.matchedCount > 0;
}

/**
 * Validate adding a card to a deck
 * MTG rules: 60+ main, 15 sideboard, max 4 copies (Basic Lands unlimited)
 */
function validateAddCard(
  deck: MagicDeck,
  card: Omit<CardInDeck, 'quantity' | 'zone'>,
  zone: DeckZone,
  quantity: number
): string | null {
  // Check zone limits
  const zoneCards = deck.cards.filter((c) => c.zone === zone);
  const zoneTotal = zoneCards.reduce((sum, c) => sum + c.quantity, 0);

  if (zone === 'sideboard' && zoneTotal + quantity > DECK_LIMITS.SIDEBOARD_MAX) {
    return 'SIDEBOARD_FULL';
  }

  // Basic Lands have no copy limit
  if (isBasicLand(card.cardName)) {
    return null;
  }

  // Check max copies across all zones (4 for non-Basic Lands)
  const totalCopies = deck.cards
    .filter((c) => c.cardName === card.cardName)
    .reduce((sum, c) => sum + c.quantity, 0);

  if (totalCopies + quantity > DECK_LIMITS.MAX_COPIES) {
    return 'MAX_COPIES_EXCEEDED';
  }

  return null;
}

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

  if (!deck.coverImage) {
    await col.updateOne(
      { ...filter, coverImage: { $exists: false } },
      { $set: { coverImage: card.cardImage } }
    );
  }

  return { success: true };
}

export async function removeCardFromDeck(
  deckId: string,
  userId: string,
  cardId: string,
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

export async function deleteDeck(deckId: string, userId: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne(toFilter(deckId, userId));
  return result.deletedCount > 0;
}

export async function deleteUserDecks(userId: string): Promise<boolean> {
  const col = await getCollection();
  await col.deleteMany({ userId });
  return true;
}
