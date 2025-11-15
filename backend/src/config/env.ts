/**
 * Environment variable configuration and validation
 */

// Load .env file if not already loaded (for scripts)
if (!process.env.DATABASE_URL && !process.env.OPENAI_API_KEY) {
  try {
    require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });
  } catch {
    // dotenv might not be available, that's ok
  }
}

import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Pinecone
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_ENVIRONMENT: z.string().optional(),
  PINECONE_INDEX_NAME: z.string().default("game-emotions"),

  // TasteRay API
  TASTERAY_API_KEY: z.string().optional(),
  
  // Steam API (optional, for game data)
  STEAM_API_KEY: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const isScript = process.argv[1]?.includes("scripts/") || process.argv[0]?.includes("tsx");
    const isTest = process.env.NODE_ENV === "test";
    
    if (!isTest && !isScript) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        console.error(`  - ${path}: ${issue.message}`);
      });
      process.exit(1);
    }
    
    // In test or script mode, use actual process.env values with defaults
    // This allows scripts to work even if some validation fails
    env = {
      PORT: process.env.PORT || "3001",
      NODE_ENV: (process.env.NODE_ENV as any) || "development",
      DATABASE_URL: process.env.DATABASE_URL || (isTest ? "postgresql://test:test@localhost:5432/test" : ""),
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || (isTest ? "test-key" : ""),
      PINECONE_API_KEY: process.env.PINECONE_API_KEY || (isTest ? "test-key" : ""),
      PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
      PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME || "game-emotions",
      JWT_SECRET: process.env.JWT_SECRET || (isTest ? "test-secret-key-min-32-chars-long" : ""),
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
      CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
      REDIS_URL: process.env.REDIS_URL,
      TASTERAY_API_KEY: process.env.TASTERAY_API_KEY,
      STEAM_API_KEY: process.env.STEAM_API_KEY,
    } as Env;
  } else {
    throw error;
  }
}

export { env };

