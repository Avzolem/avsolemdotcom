import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'soundtracks';

export interface Soundtrack {
  _id?: ObjectId | string;
  month: string; // YYYY-MM
  title: string;
  artist: string;
  youtubeId: string;
  description?: string;
  createdAt: Date;
}

async function getCollection(): Promise<Collection<Soundtrack>> {
  const db = await getDatabase();
  return db.collection<Soundtrack>(COLLECTION_NAME);
}

export async function createSoundtrackIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ month: -1 }, { unique: true });
}

export async function listSoundtracks(): Promise<Soundtrack[]> {
  const col = await getCollection();
  const docs = await col.find({}).sort({ month: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id?.toString() }));
}

export async function getCurrentSoundtrack(): Promise<Soundtrack | null> {
  const col = await getCollection();
  const doc = await col.find({}).sort({ month: -1 }).limit(1).next();
  return doc ? { ...doc, _id: doc._id?.toString() } : null;
}

export async function upsertSoundtrack(
  input: Omit<Soundtrack, '_id' | 'createdAt'>
): Promise<Soundtrack> {
  const col = await getCollection();
  const now = new Date();
  await col.updateOne(
    { month: input.month },
    { $set: { ...input }, $setOnInsert: { createdAt: now } },
    { upsert: true }
  );
  const updated = await col.findOne({ month: input.month });
  return { ...(updated as Soundtrack), _id: updated?._id?.toString() };
}

export async function deleteSoundtrackByMonth(month: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne({ month });
  return result.deletedCount > 0;
}
