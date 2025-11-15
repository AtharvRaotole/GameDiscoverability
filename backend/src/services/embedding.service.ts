/**
 * OpenAI Embedding Service
 * Generates embeddings using text-embedding-3-large (3072 dimensions)
 */

import OpenAI from "openai";
import { env } from "../config/env";
import { cache } from "../config/redis";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-large";
const EMBEDDING_DIMENSION = 3072;

/**
 * Generate embedding for text
 * @param text - Text to embed
 * @param useCache - Whether to use cache (default: true)
 * @returns Embedding vector (3072 dimensions)
 */
export async function generateEmbedding(
  text: string,
  useCache = true
): Promise<number[]> {
  // Check cache first
  if (useCache) {
    const cacheKey = `embedding:${hashText(text)}`;
    const cached = await cache.get<number[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSION,
    });

    const embedding = response.data[0].embedding;

    // Cache the embedding (24 hour TTL)
    if (useCache) {
      const cacheKey = `embedding:${hashText(text)}`;
      await cache.set(cacheKey, embedding, 86400);
    }

    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Generate embeddings for multiple texts (batch)
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMENSION,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("Error generating batch embeddings:", error);
    throw new Error("Failed to generate batch embeddings");
  }
}

/**
 * Simple hash function for cache keys
 */
function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export { EMBEDDING_DIMENSION, EMBEDDING_MODEL };

