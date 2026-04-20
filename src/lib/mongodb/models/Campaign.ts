import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'campaigns';

export type CampaignStatus = 'draft' | 'sending' | 'sent' | 'failed';

export interface Campaign {
  _id?: ObjectId | string;
  title: string;
  subject: string;
  body: string; // markdown
  status: CampaignStatus;
  createdAt: Date;
  sentAt?: Date | null;
  recipientsCount?: number;
  successCount?: number;
  failureCount?: number;
  failures?: Array<{ email: string; error: string }>;
}

async function getCollection(): Promise<Collection<Campaign>> {
  const db = await getDatabase();
  return db.collection<Campaign>(COLLECTION_NAME);
}

export async function createCampaignIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ status: 1 });
}

export async function listCampaigns(): Promise<Campaign[]> {
  const col = await getCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id?.toString() }));
}

export async function createCampaign(
  input: Pick<Campaign, 'title' | 'subject' | 'body'>
): Promise<Campaign> {
  const col = await getCollection();
  const doc: Omit<Campaign, '_id'> = {
    ...input,
    status: 'draft',
    createdAt: new Date(),
  };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? { ...doc, _id: doc._id?.toString() } : null;
}

export async function updateCampaign(
  id: string,
  updates: Partial<Campaign>
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
