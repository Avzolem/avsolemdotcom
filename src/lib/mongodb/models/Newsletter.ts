import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../connection';

const COLLECTION_NAME = 'yugioh_newsletter';

export interface NewsletterSubscriber {
  _id?: string | ObjectId;
  email: string;
  userId?: string; // Optional, links to registered user
  language: 'es' | 'en';
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export async function getNewsletterCollection(): Promise<Collection<NewsletterSubscriber>> {
  const db = await getDatabase();
  return db.collection<NewsletterSubscriber>(COLLECTION_NAME);
}

/**
 * Create indexes for the newsletter collection
 */
export async function createNewsletterIndexes(): Promise<void> {
  const collection = await getNewsletterCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ isActive: 1 });
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  language: 'es' | 'en' = 'es',
  userId?: string
): Promise<NewsletterSubscriber> {
  const collection = await getNewsletterCollection();

  // Check if already subscribed
  const existing = await collection.findOne({ email: email.toLowerCase() });

  if (existing) {
    // Reactivate if unsubscribed
    if (!existing.isActive) {
      await collection.updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            isActive: true,
            language,
            userId: userId || existing.userId,
            subscribedAt: new Date(),
          },
          $unset: { unsubscribedAt: '' },
        }
      );
    }

    return {
      ...existing,
      _id: existing._id.toString(),
      isActive: true,
      language,
    };
  }

  // Create new subscription
  const newSubscriber: Omit<NewsletterSubscriber, '_id'> = {
    email: email.toLowerCase(),
    userId,
    language,
    isActive: true,
    subscribedAt: new Date(),
  };

  const result = await collection.insertOne(newSubscriber);

  return {
    ...newSubscriber,
    _id: result.insertedId.toString(),
  };
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const collection = await getNewsletterCollection();

  const result = await collection.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

/**
 * Check if email is subscribed
 */
export async function isSubscribed(email: string): Promise<boolean> {
  const collection = await getNewsletterCollection();
  const subscriber = await collection.findOne({
    email: email.toLowerCase(),
    isActive: true,
  });

  return !!subscriber;
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers(language?: 'es' | 'en'): Promise<NewsletterSubscriber[]> {
  const collection = await getNewsletterCollection();

  const filter: any = { isActive: true };
  if (language) {
    filter.language = language;
  }

  const subscribers = await collection.find(filter).toArray();

  return subscribers.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
  }));
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount(): Promise<number> {
  const collection = await getNewsletterCollection();
  return collection.countDocuments({ isActive: true });
}

/**
 * Update subscriber language
 */
export async function updateSubscriberLanguage(
  email: string,
  language: 'es' | 'en'
): Promise<boolean> {
  const collection = await getNewsletterCollection();

  const result = await collection.updateOne(
    { email: email.toLowerCase() },
    { $set: { language } }
  );

  return result.modifiedCount > 0;
}

/**
 * Link subscriber to user account
 */
export async function linkSubscriberToUser(
  email: string,
  userId: string
): Promise<boolean> {
  const collection = await getNewsletterCollection();

  const result = await collection.updateOne(
    { email: email.toLowerCase() },
    { $set: { userId } }
  );

  return result.modifiedCount > 0;
}
