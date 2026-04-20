import { Collection } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'settings';

export interface ProfileSettings {
  _id?: string;
  key: 'profile';
  avatar?: string;
  availability?: 'available' | 'busy' | 'not-available';
  availabilityNote?: string;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<ProfileSettings>> {
  const db = await getDatabase();
  return db.collection<ProfileSettings>(COLLECTION_NAME);
}

export async function getProfileSettings(): Promise<ProfileSettings | null> {
  const col = await getCollection();
  const doc = await col.findOne({ key: 'profile' });
  return doc ? { ...doc, _id: doc._id?.toString() } : null;
}

export async function upsertProfileSettings(
  patch: Partial<Omit<ProfileSettings, '_id' | 'key' | 'updatedAt'>>
): Promise<ProfileSettings> {
  const col = await getCollection();
  await col.updateOne(
    { key: 'profile' },
    { $set: { ...patch, updatedAt: new Date() }, $setOnInsert: { key: 'profile' } },
    { upsert: true }
  );
  const updated = await col.findOne({ key: 'profile' });
  return { ...(updated as ProfileSettings), _id: updated?._id?.toString() };
}
