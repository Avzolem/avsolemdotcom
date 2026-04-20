import { Collection } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'ask_rate_limits';

export interface AskRateLimitEntry {
  _id?: string;
  ip: string;
  createdAt: Date;
}

async function getCollection(): Promise<Collection<AskRateLimitEntry>> {
  const db = await getDatabase();
  return db.collection<AskRateLimitEntry>(COLLECTION_NAME);
}

export async function createAskRateLimitIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ ip: 1, createdAt: -1 });
  // TTL: entries auto-expire 24h after createdAt
  await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86_400 });
}

export async function countAskRequestsToday(ip: string): Promise<number> {
  const col = await getCollection();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return col.countDocuments({ ip, createdAt: { $gte: since } });
}

export async function recordAskRequest(ip: string): Promise<void> {
  const col = await getCollection();
  await col.insertOne({ ip, createdAt: new Date() });
}
