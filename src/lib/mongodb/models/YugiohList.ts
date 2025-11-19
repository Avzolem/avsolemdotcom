import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';
import { YugiohList, CardInList, ListType } from '@/types/yugioh';

const COLLECTION_NAME = 'yugioh_lists';

export async function getListsCollection(): Promise<Collection<YugiohList>> {
  const db = await getDatabase();
  return db.collection<YugiohList>(COLLECTION_NAME);
}

/**
 * Get or create a list by type
 */
export async function getOrCreateList(type: ListType): Promise<YugiohList> {
  const collection = await getListsCollection();

  let list = await collection.findOne({ type });

  if (!list) {
    // Create new list
    const newList: Omit<YugiohList, '_id'> = {
      type,
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
    _id: list._id.toString(),
  } as YugiohList;
}

/**
 * Add a card to a list
 */
export async function addCardToList(
  type: ListType,
  card: Omit<CardInList, 'addedAt'>
): Promise<boolean> {
  const collection = await getListsCollection();

  // Check if card already exists in the list
  const existingList = await collection.findOne({
    type,
    'cards.cardId': card.cardId,
  });

  if (existingList) {
    // Update quantity if card exists
    await collection.updateOne(
      {
        type,
        'cards.cardId': card.cardId,
      },
      {
        $inc: { 'cards.$.quantity': card.quantity || 1 },
        $set: { updatedAt: new Date() },
      }
    );
  } else {
    // Add new card
    await collection.updateOne(
      { type },
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
 */
export async function removeCardFromList(
  type: ListType,
  cardId: number
): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.updateOne(
    { type },
    {
      $pull: { cards: { cardId } },
      $set: { updatedAt: new Date() },
    }
  );

  return true;
}

/**
 * Update card quantity in a list
 */
export async function updateCardQuantity(
  type: ListType,
  cardId: number,
  quantity: number
): Promise<boolean> {
  const collection = await getListsCollection();

  if (quantity <= 0) {
    return removeCardFromList(type, cardId);
  }

  await collection.updateOne(
    {
      type,
      'cards.cardId': cardId,
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
 */
export async function updateCardDetails(
  type: ListType,
  cardId: number,
  updates: { notes?: string; price?: number }
): Promise<boolean> {
  const collection = await getListsCollection();

  const setFields: any = {
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
      'cards.cardId': cardId,
    },
    { $set: setFields }
  );

  return true;
}

/**
 * Get all cards from a list
 */
export async function getListCards(type: ListType): Promise<CardInList[]> {
  const list = await getOrCreateList(type);
  return list.cards || [];
}

/**
 * Clear all cards from a list
 */
export async function clearList(type: ListType): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.updateOne(
    { type },
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
export async function getListValue(type: ListType): Promise<number> {
  const cards = await getListCards(type);

  return cards.reduce((total, card) => {
    const cardPrice = card.price || 0;
    const quantity = card.quantity || 1;
    return total + cardPrice * quantity;
  }, 0);
}
