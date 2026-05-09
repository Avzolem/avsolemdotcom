import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Vercel cold start + Atlas TLS + replica set discovery can take >5s.
  // Default is 30s; 15s is a safe middle ground that still fails fast.
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Cache the client promise on `global` in BOTH dev and prod.
// In Vercel serverless, this lets warm invocations of the same container
// reuse the existing connection instead of re-handshaking on every cold module load.
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('yugioh');
}

export default clientPromise;
