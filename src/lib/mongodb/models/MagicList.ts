import { Collection } from 'mongodb';
import { getDatabase } from '../connection';
import { MagicList, CardInList, ListType } from '@/types/magic';

const COLLECTION_NAME = 'magic_lists';

export async function getListsCollection(): Promise<Collection<MagicList>> {
  const db = await getDatabase();
  return db.collection<MagicList>(COLLECTION_NAME);
}

export async function createListIndexes(): Promise<void> {
  const collection = await getListsCollection();
  await collection.createIndex({ userId: 1, type: 1 }, { unique: true });
  await collection.createIndex({ type: 1 });
}

export async function getOrCreateList(type: ListType, userId: string): Promise<MagicList> {
  const collection = await getListsCollection();

  let list = await collection.findOne({ type, userId });

  if (!list) {
    const newList: Omit<MagicList, '_id'> = {
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
  } as MagicList;
}

export async function addCardToList(
  type: ListType,
  userId: string,
  card: Omit<CardInList, 'addedAt'>
): Promise<boolean> {
  const collection = await getListsCollection();

  await getOrCreateList(type, userId);

  const existingList = await collection.findOne({
    type,
    userId,
    'cards.cardId': card.cardId,
  });

  if (existingList) {
    await collection.updateOne(
      {
        type,
        userId,
        'cards.cardId': card.cardId,
      },
      {
        $inc: { 'cards.$.quantity': card.quantity || 1 },
        $set: { updatedAt: new Date() },
      }
    );
  } else {
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

export async function removeCardFromList(
  type: ListType,
  userId: string,
  cardId: string
): Promise<boolean> {
  const collection = await getListsCollection();

  await collection.updateOne(
    { type, userId },
    {
      $pull: { cards: { cardId } },
      $set: { updatedAt: new Date() },
    }
  );

  return true;
}

export async function updateCardQuantity(
  type: ListType,
  userId: string,
  cardId: string,
  quantity: number
): Promise<boolean> {
  const collection = await getListsCollection();

  if (quantity <= 0) {
    return removeCardFromList(type, userId, cardId);
  }

  await collection.updateOne(
    {
      type,
      userId,
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

export async function updateCardDetails(
  type: ListType,
  userId: string,
  cardId: string,
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
      'cards.cardId': cardId,
    },
    { $set: setFields }
  );

  return true;
}

export async function getListCards(type: ListType, userId: string): Promise<CardInList[]> {
  const list = await getOrCreateList(type, userId);
  return list.cards || [];
}

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

export async function getListValue(type: ListType, userId: string): Promise<number> {
  const cards = await getListCards(type, userId);

  return cards.reduce((total, card) => {
    const cardPrice = card.price || 0;
    const quantity = card.quantity || 1;
    return total + cardPrice * quantity;
  }, 0);
}

export async function updateCardField(
  type: ListType,
  userId: string,
  cardId: string,
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
      'cards.cardId': cardId,
    },
    { $set: setFields }
  );

  return true;
}

export async function deleteUserLists(userId: string): Promise<boolean> {
  const collection = await getListsCollection();
  await collection.deleteMany({ userId });
  return true;
}

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
