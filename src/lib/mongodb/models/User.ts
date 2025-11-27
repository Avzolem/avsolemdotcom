import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';
import bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'yugioh_users';

export interface YugiohUser {
  _id?: string | ObjectId;
  email: string;
  name: string;
  password?: string; // Hashed, only for email/password auth
  image?: string;
  provider: 'credentials' | 'google' | 'github';
  providerId?: string; // ID from OAuth provider
  emailVerified?: Date;
  newsletterSubscribed: boolean;
  language: 'es' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsersCollection(): Promise<Collection<YugiohUser>> {
  const db = await getDatabase();
  return db.collection<YugiohUser>(COLLECTION_NAME);
}

/**
 * Create indexes for the users collection
 */
export async function createUserIndexes(): Promise<void> {
  const collection = await getUsersCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ provider: 1, providerId: 1 });
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<YugiohUser | null> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ email: email.toLowerCase() });

  if (user) {
    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  return null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<YugiohUser | null> {
  const collection = await getUsersCollection();

  try {
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (user) {
      return {
        ...user,
        _id: user._id.toString(),
      };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Find user by OAuth provider
 */
export async function findUserByProvider(
  provider: 'credentials' | 'google' | 'github',
  providerId: string
): Promise<YugiohUser | null> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ provider, providerId });

  if (user) {
    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  return null;
}

/**
 * Create a new user with email/password
 */
export async function createUserWithCredentials(
  email: string,
  password: string,
  name: string,
  language: 'es' | 'en' = 'es',
  newsletterSubscribed: boolean = false
): Promise<YugiohUser> {
  const collection = await getUsersCollection();

  // Check if email already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser: Omit<YugiohUser, '_id'> = {
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    provider: 'credentials',
    newsletterSubscribed,
    language,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);

  return {
    ...newUser,
    _id: result.insertedId.toString(),
  };
}

/**
 * Create or update user from OAuth provider
 */
export async function upsertOAuthUser(
  email: string,
  name: string,
  image: string | undefined,
  provider: 'google' | 'github',
  providerId: string
): Promise<YugiohUser> {
  const collection = await getUsersCollection();

  // Check if user exists by email
  let user = await findUserByEmail(email);

  if (user) {
    // Update existing user with OAuth info if needed
    await collection.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          name: name || user.name,
          image: image || user.image,
          provider,
          providerId,
          updatedAt: new Date(),
        },
      }
    );

    return {
      ...user,
      name: name || user.name,
      image: image || user.image,
      provider,
      providerId,
    };
  }

  // Create new user
  const newUser: Omit<YugiohUser, '_id'> = {
    email: email.toLowerCase(),
    name,
    image,
    provider,
    providerId,
    emailVerified: new Date(),
    newsletterSubscribed: false,
    language: 'es',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);

  return {
    ...newUser,
    _id: result.insertedId.toString(),
  };
}

/**
 * Verify user password
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<YugiohUser | null> {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  updates: {
    name?: string;
    newsletterSubscribed?: boolean;
    language?: 'es' | 'en';
    image?: string;
  }
): Promise<boolean> {
  const collection = await getUsersCollection();

  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Delete user account
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const collection = await getUsersCollection();

  const result = await collection.deleteOne({ _id: new ObjectId(userId) });

  return result.deletedCount > 0;
}

/**
 * Get all users subscribed to newsletter
 */
export async function getNewsletterSubscribers(): Promise<YugiohUser[]> {
  const collection = await getUsersCollection();

  const users = await collection
    .find({ newsletterSubscribed: true })
    .toArray();

  return users.map(user => ({
    ...user,
    _id: user._id.toString(),
  }));
}
