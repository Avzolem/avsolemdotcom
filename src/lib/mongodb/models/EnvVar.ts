import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'env_vault';

export interface EnvVar {
  _id?: ObjectId | string;
  project: string;
  source: string; // .env / .env.local / .env.production / etc
  name: string;
  encryptedValue: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getEnvVarsCollection(): Promise<Collection<EnvVar>> {
  const db = await getDatabase();
  return db.collection<EnvVar>(COLLECTION_NAME);
}

export async function ensureEnvVarIndexes(): Promise<void> {
  const col = await getEnvVarsCollection();
  await col.createIndex({ project: 1, name: 1, source: 1 });
  await col.createIndex({ project: 1 });
}

export async function listEnvVars(): Promise<EnvVar[]> {
  const col = await getEnvVarsCollection();
  return col
    .find({})
    .sort({ project: 1, source: 1, name: 1 })
    .toArray();
}

export async function findEnvVar(
  project: string,
  source: string,
  name: string
): Promise<EnvVar | null> {
  const col = await getEnvVarsCollection();
  return col.findOne({ project, source, name });
}

export async function createEnvVar(
  input: Omit<EnvVar, '_id' | 'createdAt' | 'updatedAt'>
): Promise<EnvVar> {
  const col = await getEnvVarsCollection();
  const now = new Date();
  const doc: Omit<EnvVar, '_id'> = { ...input, createdAt: now, updatedAt: now };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function updateEnvVar(
  id: string,
  patch: Partial<Pick<EnvVar, 'project' | 'source' | 'name' | 'encryptedValue' | 'description'>>
): Promise<EnvVar | null> {
  const col = await getEnvVarsCollection();
  const _id = new ObjectId(id);
  await col.updateOne({ _id }, { $set: { ...patch, updatedAt: new Date() } });
  return col.findOne({ _id });
}

export async function deleteEnvVar(id: string): Promise<boolean> {
  const col = await getEnvVarsCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
