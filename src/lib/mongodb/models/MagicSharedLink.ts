import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';
import { CardInList, ListType } from '@/types/magic';

export interface MagicSharedLink {
  _id?: string;
  userId: string;
  userName?: string;
  token: string;
  listType: ListType;
  cards: CardInList[];
  createdAt: Date;
  expiresAt: Date;
}

const COLLECTION_NAME = 'magic_shared_links';

async function getCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(COLLECTION_NAME);
}

export async function createSharedLinkIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ token: 1 }, { unique: true });
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

export async function createSharedLink(data: {
  userId: string;
  userName?: string;
  token: string;
  listType: ListType;
  cards: CardInList[];
  expiresInDays?: number;
}): Promise<MagicSharedLink> {
  const col = await getCollection();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (data.expiresInDays || 7) * 24 * 60 * 60 * 1000);

  const doc = {
    userId: data.userId,
    userName: data.userName,
    token: data.token,
    listType: data.listType,
    cards: data.cards,
    createdAt: now,
    expiresAt,
  };

  await col.insertOne(doc);
  return doc as MagicSharedLink;
}

export async function getSharedLink(token: string): Promise<MagicSharedLink | null> {
  const col = await getCollection();
  const doc = await col.findOne({ token });
  if (!doc) return null;

  // Check expiration
  if (new Date() > new Date(doc.expiresAt)) {
    return null;
  }

  return { ...doc, _id: doc._id.toString() } as unknown as MagicSharedLink;
}

export async function getUserSharedLinks(userId: string): Promise<MagicSharedLink[]> {
  const col = await getCollection();
  const docs = await col
    .find({ userId, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as MagicSharedLink[];
}

export async function deleteSharedLink(id: string, userId: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}
