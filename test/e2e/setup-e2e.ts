import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Carregar variáveis de ambiente específicas para E2E
config({ path: '.env.e2e' });

// Fallback para .env se .env.e2e não existir
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  config({ path: '.env' });
}

// Configurar NODE_ENV para test
process.env.NODE_ENV = 'test';

// Log de verificação
console.log('✅ E2E Setup: Environment loaded');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   DATABASE: ${process.env.DATABASE_POSTGRES_NAME}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   MONGO_URI: ${process.env.MONGO_URI ? '✓ Configured' : '✗ Not configured'}`);

// MongoDB cleanup setup
let mongoClient: MongoClient | null = null;

// Connect to MongoDB before all tests
beforeAll(async () => {
  if (process.env.MONGO_URI && process.env.DATABASE_MONGO_SKIP !== 'true') {
    try {
      console.log('🔌 Connecting to MongoDB for E2E cleanup...');
      mongoClient = new MongoClient(process.env.MONGO_URI);
      await mongoClient.connect();
      console.log('✅ MongoDB connected for E2E cleanup');
    } catch (error) {
      console.warn('⚠️  Could not connect to MongoDB:', (error as Error).message);
    }
  }
});

// Clear MongoDB collections after each test
afterEach(async () => {
  if (mongoClient && mongoClient.topology?.isConnected()) {
    try {
      const db = mongoClient.db();
      const collections = await db.collections();

      for (const collection of collections) {
        await collection.deleteMany({});
      }

      if (collections.length > 0) {
        console.log(`🧹 Cleared ${collections.length} MongoDB collections`);
      }
    } catch (error) {
      console.warn('⚠️  Error clearing MongoDB collections:', (error as Error).message);
    }
  }
});

// Disconnect from MongoDB after all tests
afterAll(async () => {
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('🔌 MongoDB connection closed');
    } catch (error) {
      console.warn('⚠️  Error closing MongoDB connection:', (error as Error).message);
    }
  }
});
