// Jest setup for backend tests

// Mock environment variables for tests
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test-key";
process.env.PINECONE_API_KEY = process.env.PINECONE_API_KEY || "test-key";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key-min-32-chars-long-for-testing";
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
process.env.CORS_ORIGIN = "http://localhost:3000";
