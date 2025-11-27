import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';
import { YugiohList, CardInList, ListType } from '@/types/yugioh';

const COLLECTION_NAME = 'yugioh_lists';

export async function getListsCollection(): Promise<Collection<YugiohList>> {
  const db = await getDatabase();
  return db.collection<YugiohList>(COLLECTION_NAME);
}

/**
 * Create indexes for the lists collection
 */
export async function createListIndexes(): Promise<void> {
  const collection = await getListsCollection();
  await collection.createIndex({ userId: 1, type: 1 }, { unique: true });
  await collection.createIndex({ type: 1 });
}

/**
 * Get or create a list by type and userId
 */
export async function getOrCreateList(type: ListType, userId: string): Promise<YugiohList> {
  const collection = await getListsCollection();

  let list = await collection.findOne({ type, userId });

  if (!list) {
    // Create new list for this user
    const newList: Omit<YugiohList, '_id'> = {
      type,
      userId,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newList);
    return {
      ...newList,
      _id: result.insertedId.toString(),
    };
  }

  return {
    ...list,
    _id: list._id?.toString(),
  } as YugiohList;
}

/**
 * Add a card to a list
 * Uses setCode as the unique identifier (primary key)
 */
export async function addCardToList(
  type: ListType,
  userId: string,
  card: Omit<CardInList, 'addedAt'>
): Promise<boolean> {
  const collection = await getListsCollection();

  // Ensure the list exists
  await getOrCreateList(type, userId);

  // Check if card with this setCode already exists in the user's list
  const existingList = await collection.findOne({
    type,
    userId,
    'cards.setCode': card.setCode,
  });

  if (existingList) {
    // Update quantity if card with this setCode exists
    await collection.updateOne(
      {
        type,
        userId,
        'cards.setCode': card.setCode,
      },
      {
        $inc: { 'cards.$.quantity': card.quantity || 1 },
        $set: { updatedAt: new Date() },
      }
    );
  } else {
    // Add new card (new setCode means new entry even if same cardId)
    await collection.updateOne(
      { type, userId },
      {
        $push: {
          cards: {
            ...card,
            addedAt: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );
  }

  return true;
}

/**
 * Remove a card from a list
 * Uses setCode as the unique identifier
 */
export async function removeCardFromList(
  type: ListType,
  userId: string,
  setCode: string
): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.updateOne(
    { type, userId },
    {
      $pull: { cards: { setCode } },
      $set: { updatedAt: new Date() },
    }
  );

  return true;
}

/**
 * Update card quantity in a list
 * Uses setCode as the unique identifier
 */
export async function updateCardQuantity(
  type: ListType,
  userId: string,
  setCode: string,
  quantity: number
): Promise<boolean> {
  const collection = await getListsCollection();

  if (quantity <= 0) {
    return removeCardFromList(type, userId, setCode);
  }

  await collection.updateOne(
    {
      type,
      userId,
      'cards.setCode': setCode,
    },
    {
      $set: {
        'cards.$.quantity': quantity,
        updatedAt: new Date(),
      },
    }
  );

  return true;
}

/**
 * Update card notes or price
 * Uses setCode as the unique identifier
 */
export async function updateCardDetails(
  type: ListType,
  userId: string,
  setCode: string,
  updates: { notes?: string; price?: number }
): Promise<boolean> {
  const collection = await getListsCollection();

  const setFields: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (updates.notes !== undefined) {
    setFields['cards.$.notes'] = updates.notes;
  }
  if (updates.price !== undefined) {
    setFields['cards.$.price'] = updates.price;
  }

  await collection.updateOne(
    {
      type,
      userId,
      'cards.setCode': setCode,
    },
    { $set: setFields }
  );

  return true;
}

/**
 * Get all cards from a list
 */
export async function getListCards(type: ListType, userId: string): Promise<CardInList[]> {
  const list = await getOrCreateList(type, userId);
  return list.cards || [];
}

/**
 * Clear all cards from a list
 */
export async function clearList(type: ListType, userId: string): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.updateOne(
    { type, userId },
    {
      $set: {
        cards: [],
        updatedAt: new Date(),
      },
    }
  );

  return true;
}

/**
 * Get total value of a list
 */
export async function getListValue(type: ListType, userId: string): Promise<number> {
  const cards = await getListCards(type, userId);

  return cards.reduce((total, card) => {
    const cardPrice = card.price || 0;
    const quantity = card.quantity || 1;
    return total + cardPrice * quantity;
  }, 0);
}

/**
 * Update a specific field of a card in a list
 * Uses setCode as the unique identifier
 */
export async function updateCardField(
  type: ListType,
  userId: string,
  setCode: string,
  field: string,
  value: unknown
): Promise<boolean> {
  const collection = await getListsCollection();

  const setFields: Record<string, unknown> = {
    [`cards.$.${field}`]: value,
    updatedAt: new Date(),
  };

  await collection.updateOne(
    {
      type,
      userId,
      'cards.setCode': setCode,
    },
    { $set: setFields }
  );

  return true;
}

/**
 * Delete all lists for a user (used when deleting account)
 */
export async function deleteUserLists(userId: string): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.deleteMany({ userId });

  return true;
}

/**
 * Get user statistics across all lists
 */
export async function getUserStats(userId: string): Promise<{
  totalCards: number;
  collectionValue: number;
  forSaleValue: number;
  wishlistCount: number;
}> {
  const [collection, forSale, wishlist] = await Promise.all([
    getListCards('collection', userId),
    getListCards('for-sale', userId),
    getListCards('wishlist', userId),
  ]);

  const calculateValue = (cards: CardInList[]) =>
    cards.reduce((total, card) => {
      const cardPrice = card.price || 0;
      const quantity = card.quantity || 1;
      return total + cardPrice * quantity;
    }, 0);

  const totalCardsCount = (cards: CardInList[]) =>
    cards.reduce((total, card) => total + (card.quantity || 1), 0);

  return {
    totalCards: totalCardsCount(collection),
    collectionValue: calculateValue(collection),
    forSaleValue: calculateValue(forSale),
    wishlistCount: totalCardsCount(wishlist),
  };
}
