import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'note_pages';

export interface NotePage {
  _id?: ObjectId | string;
  slug: string;
  title: string;
  blocks: unknown[];
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotePagesCollection(): Promise<Collection<NotePage>> {
  const db = await getDatabase();
  return db.collection<NotePage>(COLLECTION_NAME);
}

export async function ensureNotePageIndexes(): Promise<void> {
  const col = await getNotePagesCollection();
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ enabled: 1, order: 1 });
}

export async function listNotePages(opts: { onlyEnabled?: boolean } = {}): Promise<NotePage[]> {
  const col = await getNotePagesCollection();
  const filter = opts.onlyEnabled ? { enabled: true } : {};
  return col.find(filter).sort({ order: 1, createdAt: 1 }).toArray();
}

export async function findNotePageBySlug(slug: string): Promise<NotePage | null> {
  const col = await getNotePagesCollection();
  return col.findOne({ slug });
}

export async function createNotePage(
  input: Omit<NotePage, '_id' | 'createdAt' | 'updatedAt'>
): Promise<NotePage> {
  const col = await getNotePagesCollection();
  const now = new Date();
  const doc: Omit<NotePage, '_id'> = { ...input, createdAt: now, updatedAt: now };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function updateNotePageBySlug(
  slug: string,
  patch: Partial<Pick<NotePage, 'title' | 'blocks' | 'enabled' | 'order' | 'slug'>>
): Promise<NotePage | null> {
  const col = await getNotePagesCollection();
  await col.updateOne({ slug }, { $set: { ...patch, updatedAt: new Date() } });
  return col.findOne({ slug: patch.slug ?? slug });
}

export async function deleteNotePageBySlug(slug: string): Promise<boolean> {
  const col = await getNotePagesCollection();
  const result = await col.deleteOne({ slug });
  return result.deletedCount === 1;
}
