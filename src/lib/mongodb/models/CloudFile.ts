import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

export interface CloudFile {
  _id?: ObjectId;
  userId: string;
  folderId: string | null;

  // File info
  name: string;
  originalName: string;
  description?: string;

  // Cloudinary data
  cloudinaryPublicId: string;
  cloudinaryResourceType: 'video' | 'image' | 'raw';
  cloudinaryFormat: string;
  cloudinarySecureUrl: string;
  cloudinaryVersion: number;

  // Metadata
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  mimeType: string;

  // Thumbnail
  thumbnailUrl?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
}

const COLLECTION_NAME = 'cloud_files';

async function getCollection() {
  const db = await getDatabase();
  return db.collection<CloudFile>(COLLECTION_NAME);
}

// Create indexes
export async function ensureIndexes() {
  const collection = await getCollection();
  await collection.createIndex({ userId: 1, folderId: 1 });
  await collection.createIndex({ userId: 1, createdAt: -1 });
  await collection.createIndex({ cloudinaryPublicId: 1 }, { unique: true });
}

// Create a new file record
export async function createFile(fileData: Omit<CloudFile, '_id' | 'createdAt' | 'updatedAt'>): Promise<CloudFile> {
  const collection = await getCollection();

  const now = new Date();
  const file: CloudFile = {
    ...fileData,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(file);
  return { ...file, _id: result.insertedId };
}

// Get files for a user
export async function getFilesByUser(
  userId: string,
  options: {
    folderId?: string | null;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<{ files: CloudFile[]; total: number }> {
  const collection = await getCollection();

  const {
    folderId = null,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query: Record<string, unknown> = { userId };
  if (folderId !== undefined) {
    query.folderId = folderId;
  }

  const [files, total] = await Promise.all([
    collection
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    collection.countDocuments(query),
  ]);

  return { files, total };
}

// Get a single file by ID
export async function getFileById(fileId: string, userId: string): Promise<CloudFile | null> {
  const collection = await getCollection();
  return collection.findOne({
    _id: new ObjectId(fileId),
    userId,
  });
}

// Get file by Cloudinary public ID
export async function getFileByPublicId(publicId: string): Promise<CloudFile | null> {
  const collection = await getCollection();
  return collection.findOne({ cloudinaryPublicId: publicId });
}

// Update file
export async function updateFile(
  fileId: string,
  userId: string,
  updates: Partial<Pick<CloudFile, 'name' | 'description' | 'folderId'>>
): Promise<CloudFile | null> {
  const collection = await getCollection();

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(fileId), userId },
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

// Update last accessed time
export async function updateLastAccessed(fileId: string): Promise<void> {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: new ObjectId(fileId) },
    { $set: { lastAccessedAt: new Date() } }
  );
}

// Delete file
export async function deleteFile(fileId: string, userId: string): Promise<CloudFile | null> {
  const collection = await getCollection();
  return collection.findOneAndDelete({
    _id: new ObjectId(fileId),
    userId,
  });
}

// Get total storage used by user
export async function getStorageUsed(userId: string): Promise<{
  totalSize: number;
  fileCount: number;
  breakdown: { video: number; image: number; other: number };
}> {
  const collection = await getCollection();

  const pipeline = [
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$size' },
        fileCount: { $sum: 1 },
        videoSize: {
          $sum: {
            $cond: [{ $eq: ['$cloudinaryResourceType', 'video'] }, '$size', 0],
          },
        },
        imageSize: {
          $sum: {
            $cond: [{ $eq: ['$cloudinaryResourceType', 'image'] }, '$size', 0],
          },
        },
      },
    },
  ];

  const result = await collection.aggregate(pipeline).toArray();

  if (result.length === 0) {
    return {
      totalSize: 0,
      fileCount: 0,
      breakdown: { video: 0, image: 0, other: 0 },
    };
  }

  const data = result[0];
  return {
    totalSize: data.totalSize || 0,
    fileCount: data.fileCount || 0,
    breakdown: {
      video: data.videoSize || 0,
      image: data.imageSize || 0,
      other: (data.totalSize || 0) - (data.videoSize || 0) - (data.imageSize || 0),
    },
  };
}

// Search files by name
export async function searchFiles(
  userId: string,
  query: string,
  limit: number = 20
): Promise<CloudFile[]> {
  const collection = await getCollection();

  return collection
    .find({
      userId,
      name: { $regex: query, $options: 'i' },
    })
    .limit(limit)
    .toArray();
}

// Move files to folder
export async function moveFilesToFolder(
  fileIds: string[],
  userId: string,
  targetFolderId: string | null
): Promise<number> {
  const collection = await getCollection();

  const result = await collection.updateMany(
    {
      _id: { $in: fileIds.map(id => new ObjectId(id)) },
      userId,
    },
    {
      $set: {
        folderId: targetFolderId,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
}
