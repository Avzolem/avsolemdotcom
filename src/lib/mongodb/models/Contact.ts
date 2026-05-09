import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'contacts';

export interface Contact {
  _id?: ObjectId | string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  ip?: string;
  userAgent?: string;
  notes?: string;
}

export async function getContactsCollection(): Promise<Collection<Contact>> {
  const db = await getDatabase();
  return db.collection<Contact>(COLLECTION_NAME);
}

export async function createContactIndexes(): Promise<void> {
  const col = await getContactsCollection();
  await col.createIndex({ email: 1 });
  await col.createIndex({ createdAt: -1 });
}

export async function createContact(
  input: Omit<Contact, '_id' | 'createdAt'>
): Promise<Contact> {
  const col = await getContactsCollection();
  const doc: Omit<Contact, '_id'> = {
    ...input,
    email: input.email.toLowerCase(),
    createdAt: new Date(),
  };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId.toString() };
}

export async function listContacts(): Promise<Contact[]> {
  const col = await getContactsCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id?.toString() }));
}

export async function updateContact(
  id: string,
  fields: Partial<Pick<Contact, 'name' | 'email' | 'phone' | 'company' | 'notes'>>
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getContactsCollection();
  const update: Record<string, unknown> = {};
  if (typeof fields.name === 'string') update.name = fields.name.trim();
  if (typeof fields.email === 'string') update.email = fields.email.trim().toLowerCase();
  if (fields.phone !== undefined)
    update.phone = typeof fields.phone === 'string' ? fields.phone.trim() : '';
  if (fields.company !== undefined)
    update.company = typeof fields.company === 'string' ? fields.company.trim() : '';
  if (fields.notes !== undefined)
    update.notes = typeof fields.notes === 'string' ? fields.notes.trim() : '';
  if (Object.keys(update).length === 0) return false;
  const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
  return res.matchedCount > 0;
}

export async function deleteContact(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getContactsCollection();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

export async function countContactsByEmailToday(email: string): Promise<number> {
  const col = await getContactsCollection();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return col.countDocuments({
    email: email.toLowerCase(),
    createdAt: { $gte: since },
  });
}
