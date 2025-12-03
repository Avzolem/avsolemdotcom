import { ObjectId, Collection } from 'mongodb';
import { getDatabase } from '../connection';

export interface Product {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  currency: 'MXN' | 'USD';
  images: string[];
  category: 'cards' | 'accessories' | 'decks' | 'other';
  condition: 'mint' | 'near-mint' | 'excellent' | 'good' | 'played';
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getProductsCollection(): Promise<Collection<Product>> {
  const db = await getDatabase();
  return db.collection<Product>('yugioh_products');
}

// Get all active products (public)
export async function getActiveProducts(): Promise<Product[]> {
  const collection = await getProductsCollection();
  return collection
    .find({ isActive: true })
    .sort({ isFeatured: -1, createdAt: -1 })
    .toArray();
}

// Get all products (admin)
export async function getAllProducts(): Promise<Product[]> {
  const collection = await getProductsCollection();
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const collection = await getProductsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

// Create product
export async function createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const collection = await getProductsCollection();
  const now = new Date();
  const newProduct = {
    ...product,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(newProduct);
  return { ...newProduct, _id: result.insertedId };
}

// Update product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  const collection = await getProductsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  const collection = await getProductsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
