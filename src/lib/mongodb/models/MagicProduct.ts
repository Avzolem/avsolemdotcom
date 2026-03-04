import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

export interface MagicProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'magic_products';

async function getCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(COLLECTION_NAME);
}

export async function getProducts(category?: string): Promise<MagicProduct[]> {
  const col = await getCollection();
  const filter = category ? { category, inStock: true } : { inStock: true };
  const docs = await col.find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as MagicProduct[];
}

export async function getAllProducts(): Promise<MagicProduct[]> {
  const col = await getCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() })) as unknown as MagicProduct[];
}

export async function createProduct(product: Omit<MagicProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<MagicProduct> {
  const col = await getCollection();
  const now = new Date();
  const doc = { ...product, createdAt: now, updatedAt: now };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function updateProduct(id: string, updates: Partial<MagicProduct>): Promise<boolean> {
  const col = await getCollection();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.matchedCount > 0;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
