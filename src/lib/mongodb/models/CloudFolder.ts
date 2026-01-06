import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

export interface CloudFolder {
  _id?: ObjectId;
  userId: string;
  parentId: string | null;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'cloud_folders';

async function getCollection() {
  const db = await getDatabase();
  return db.collection<CloudFolder>(COLLECTION_NAME);
}

// Create indexes
export async function ensureFolderIndexes() {
  const collection = await getCollection();
  await collection.createIndex({ userId: 1, parentId: 1 });
  await collection.createIndex({ userId: 1, name: 1 });
}

// Create a new folder
export async function createFolder(
  userId: string,
  name: string,
  parentId: string | null = null,
  options: { description?: string; color?: string } = {}
): Promise<CloudFolder> {
  const collection = await getCollection();

  const now = new Date();
  const folder: CloudFolder = {
    userId,
    name,
    parentId,
    description: options.description,
    color: options.color,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(folder);
  return { ...folder, _id: result.insertedId };
}

// Get folders for a user
export async function getFoldersByUser(
  userId: string,
  parentId: string | null = null
): Promise<CloudFolder[]> {
  const collection = await getCollection();

  return collection
    .find({ userId, parentId })
    .sort({ name: 1 })
    .toArray();
}

// Get a single folder by ID
export async function getFolderById(folderId: string, userId: string): Promise<CloudFolder | null> {
  const collection = await getCollection();
  return collection.findOne({
    _id: new ObjectId(folderId),
    userId,
  });
}

// Update folder
export async function updateFolder(
  folderId: string,
  userId: string,
  updates: Partial<Pick<CloudFolder, 'name' | 'description' | 'color' | 'parentId'>>
): Promise<CloudFolder | null> {
  const collection = await getCollection();

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(folderId), userId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  return result;
}

// Delete folder
export async function deleteFolder(
  folderId: string,
  userId: string
): Promise<CloudFolder | null> {
  const collection = await getCollection();
  return collection.findOneAndDelete({
    _id: new ObjectId(folderId),
    userId,
  });
}

// Get folder path (breadcrumb)
export async function getFolderPath(
  folderId: string | null,
  userId: string
): Promise<CloudFolder[]> {
  if (!folderId) return [];

  const collection = await getCollection();
  const path: CloudFolder[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const foundFolder: CloudFolder | null = await collection.findOne({
      _id: new ObjectId(currentId),
      userId,
    });

    if (!foundFolder) break;
    path.unshift(foundFolder);
    currentId = foundFolder.parentId;
  }

  return path;
}

// Check if folder name exists in parent
export async function folderNameExists(
  userId: string,
  name: string,
  parentId: string | null,
  excludeId?: string
): Promise<boolean> {
  const collection = await getCollection();

  const query: Record<string, unknown> = {
    userId,
    name: { $regex: `^${name}$`, $options: 'i' },
    parentId,
  };

  if (excludeId) {
    query._id = { $ne: new ObjectId(excludeId) };
  }

  const count = await collection.countDocuments(query);
  return count > 0;
}
