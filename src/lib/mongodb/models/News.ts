import { ObjectId, Collection } from 'mongodb';
import { getDatabase } from '../connection';

export interface NewsArticle {
  _id?: ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown content
  coverImage: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNewsCollection(): Promise<Collection<NewsArticle>> {
  const db = await getDatabase();
  return db.collection<NewsArticle>('yugioh_news');
}

// Get all published news (public)
export async function getPublishedNews(): Promise<NewsArticle[]> {
  const collection = await getNewsCollection();
  return collection
    .find({ isPublished: true })
    .sort({ isFeatured: -1, publishedAt: -1 })
    .toArray();
}

// Get all news (admin)
export async function getAllNews(): Promise<NewsArticle[]> {
  const collection = await getNewsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

// Get news by slug
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const collection = await getNewsCollection();
  return collection.findOne({ slug, isPublished: true });
}

// Get news by ID
export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const collection = await getNewsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

// Create news
export async function createNews(news: Omit<NewsArticle, '_id' | 'createdAt' | 'updatedAt'>): Promise<NewsArticle> {
  const collection = await getNewsCollection();
  const now = new Date();
  const newNews = {
    ...news,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(newNews);
  return { ...newNews, _id: result.insertedId };
}

// Update news
export async function updateNews(id: string, updates: Partial<NewsArticle>): Promise<boolean> {
  const collection = await getNewsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

// Delete news
export async function deleteNews(id: string): Promise<boolean> {
  const collection = await getNewsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
