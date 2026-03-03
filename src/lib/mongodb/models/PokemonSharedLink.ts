import { getDatabase } from '../connection';
import { Collection } from 'mongodb';
import { ListType } from '@/types/pokemon';

export interface SharedLink {
  token: string;
  listType: ListType;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

async function getSharedLinksCollection(): Promise<Collection<SharedLink>> {
  const db = await getDatabase();
  return db.collection<SharedLink>('pokemon_shared_links');
}

export async function createSharedLink(
  token: string,
  listType: ListType,
  userId: string,
  expiresInDays: number = 7
): Promise<SharedLink> {
  const collection = await getSharedLinksCollection();

  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const sharedLink: SharedLink = {
    token,
    listType,
    userId,
    createdAt,
    expiresAt,
  };

  await collection.insertOne(sharedLink);
  return sharedLink;
}

export async function getSharedLink(token: string): Promise<SharedLink | null> {
  const collection = await getSharedLinksCollection();
  return collection.findOne({ token });
}

export async function cleanupExpiredLinks(): Promise<number> {
  const collection = await getSharedLinksCollection();
  const result = await collection.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount;
}

export async function deleteSharedLink(token: string): Promise<boolean> {
  const collection = await getSharedLinksCollection();
  const result = await collection.deleteOne({ token });
  return result.deletedCount > 0;
}

export async function createSharedLinksIndexes(): Promise<void> {
  const collection = await getSharedLinksCollection();
  await collection.createIndex({ token: 1 }, { unique: true });
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.createIndex({ userId: 1 });
}
