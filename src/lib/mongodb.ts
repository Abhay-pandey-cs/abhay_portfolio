import { MongoClient, Db } from 'mongodb';
import { 
  initialProjects, 
  initialLearningTopics, 
  initialNotes, 
  initialSkills, 
  initialSiteSettings, 
  initialCommunityProjects
} from './initialData';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db('abhay_portfolio');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    return null;
  }
}

export async function seedMongoIfEmpty() {
  const db = await getDatabase();
  if (!db) return;

  try {
    const projCount = await db.collection('projects').countDocuments();
    if (projCount === 0) {
      await db.collection('projects').insertMany(initialProjects as any);
      await db.collection('learning_topics').insertMany(initialLearningTopics as any);
      await db.collection('notes').insertMany(initialNotes as any);
      await db.collection('skills').insertMany(initialSkills as any);
      await db.collection('settings').insertOne({ _id: 'site_settings' as any, ...initialSiteSettings });
      await db.collection('community').insertMany(initialCommunityProjects as any);
      console.log('MongoDB successfully seeded with Abhay Pandey initial portfolio data.');
    }
  } catch (err) {
    console.error('MongoDB seeding error:', err);
  }
}
