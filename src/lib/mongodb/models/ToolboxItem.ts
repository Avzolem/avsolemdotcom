import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'toolbox_items';

export interface ToolboxItem {
  _id?: ObjectId | string;
  name: string;
  icon: string;
  href: string;
  isExternal: boolean;
  order: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ToolboxItemInput = Pick<ToolboxItem, 'name' | 'icon' | 'href' | 'enabled'>;

const DEFAULT_SEED: Array<Omit<ToolboxItem, '_id' | 'createdAt' | 'updatedAt'>> = [
  { name: 'GitHub', icon: 'github', href: 'https://github.com/Avzolem', isExternal: true, order: 10, enabled: true },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/avsolem/', isExternal: true, order: 20, enabled: true },
  { name: 'Twitter', icon: 'x', href: 'https://twitter.com/avsolem', isExternal: true, order: 30, enabled: true },
  { name: 'Email', icon: 'email', href: 'mailto:andresaguilar.exe@gmail.com', isExternal: true, order: 40, enabled: true },
  { name: 'TCG Hub', icon: 'cards', href: '/tcg', isExternal: false, order: 50, enabled: true },
  { name: 'ROMs Index', icon: 'save', href: '/roms', isExternal: false, order: 60, enabled: true },
  { name: 'Diablo', icon: 'diablo', href: '/diablo', isExternal: false, order: 70, enabled: true },
  { name: 'Cloudsolem', icon: 'cloud', href: '/cloud', isExternal: false, order: 80, enabled: true },
  { name: 'ASCII Studio', icon: 'type', href: '/ascii', isExternal: false, order: 90, enabled: true },
];

export function detectExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(href.trim());
}

async function getCollection(): Promise<Collection<ToolboxItem>> {
  const db = await getDatabase();
  return db.collection<ToolboxItem>(COLLECTION_NAME);
}

export async function ensureToolboxSeed(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ order: 1 });
  const count = await col.estimatedDocumentCount();
  if (count > 0) return;
  const now = new Date();
  await col.insertMany(
    DEFAULT_SEED.map((item) => ({ ...item, createdAt: now, updatedAt: now }))
  );
}

function serialize(doc: ToolboxItem): ToolboxItem {
  return { ...doc, _id: doc._id?.toString() };
}

export async function listEnabledToolboxItems(): Promise<ToolboxItem[]> {
  await ensureToolboxSeed();
  const col = await getCollection();
  const docs = await col.find({ enabled: true }).sort({ order: 1 }).toArray();
  return docs.map(serialize);
}

export async function listAllToolboxItems(): Promise<ToolboxItem[]> {
  await ensureToolboxSeed();
  const col = await getCollection();
  const docs = await col.find({}).sort({ order: 1 }).toArray();
  return docs.map(serialize);
}

export async function createToolboxItem(input: ToolboxItemInput): Promise<ToolboxItem> {
  const col = await getCollection();
  const last = await col.find({}).sort({ order: -1 }).limit(1).next();
  const order = (last?.order ?? 0) + 10;
  const now = new Date();
  const doc: Omit<ToolboxItem, '_id'> = {
    name: input.name.trim(),
    icon: input.icon.trim(),
    href: input.href.trim(),
    isExternal: detectExternal(input.href),
    order,
    enabled: input.enabled,
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc as ToolboxItem);
  return serialize({ ...doc, _id: result.insertedId } as ToolboxItem);
}

export async function updateToolboxItem(
  id: string,
  patch: Partial<ToolboxItemInput>
): Promise<ToolboxItem | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection();
  const $set: Partial<ToolboxItem> = { updatedAt: new Date() };
  if (patch.name !== undefined) $set.name = patch.name.trim();
  if (patch.icon !== undefined) $set.icon = patch.icon.trim();
  if (patch.href !== undefined) {
    $set.href = patch.href.trim();
    $set.isExternal = detectExternal(patch.href);
  }
  if (patch.enabled !== undefined) $set.enabled = patch.enabled;
  await col.updateOne({ _id: new ObjectId(id) }, { $set });
  const updated = await col.findOne({ _id: new ObjectId(id) });
  return updated ? serialize(updated) : null;
}

export async function deleteToolboxItem(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await getCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function reorderToolboxItems(ids: string[]): Promise<void> {
  const col = await getCollection();
  const ops = ids
    .filter((id) => ObjectId.isValid(id))
    .map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: (index + 1) * 10, updatedAt: new Date() } },
      },
    }));
  if (ops.length === 0) return;
  await col.bulkWrite(ops);
}
