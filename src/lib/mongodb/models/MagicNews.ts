import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

export interface MagicNewsArticle {
  _id?: string;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  author: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'magic_news';

async function getCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(COLLECTION_NAME);
}

export async function getPublishedNews(limit: number = 20): Promise<MagicNewsArticle[]> {
  const col = await getCollection();
  const docs = await col
    .find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as MagicNewsArticle[];
}

export async function getAllNews(): Promise<MagicNewsArticle[]> {
  const col = await getCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as MagicNewsArticle[];
}

export async function createNews(article: Omit<MagicNewsArticle, '_id' | 'createdAt' | 'updatedAt'>): Promise<MagicNewsArticle> {
  const col = await getCollection();
  const now = new Date();
  const doc = { ...article, createdAt: now, updatedAt: now };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function updateNews(id: string, updates: Partial<MagicNewsArticle>): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function deleteNews(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
