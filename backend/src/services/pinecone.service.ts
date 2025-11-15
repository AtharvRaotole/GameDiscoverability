/**
 * Pinecone Vector Database Service
 * Handles vector storage and similarity search for game emotions
 */

import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../config/env";
import { EMBEDDING_DIMENSION } from "./embedding.service";

let pinecone: Pinecone | null = null;
let index: any = null;

/**
 * Initialize Pinecone client
 */
export async function initializePinecone(): Promise<void> {
  try {
    pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    // Get or create index
    const indexName = env.PINECONE_INDEX_NAME;
    const indexes = await pinecone.listIndexes();

    if (!indexes.indexes?.find((idx) => idx.name === indexName)) {
      console.log(`Creating Pinecone index: ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: EMBEDDING_DIMENSION,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: env.PINECONE_ENVIRONMENT || "us-west-2",
          },
        },
      });

      // Wait for index to be ready
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    index = pinecone.index(indexName);
    console.log("✅ Pinecone initialized");
  } catch (error) {
    console.error("❌ Pinecone initialization failed:", error);
    throw error;
  }
}

/**
 * Upsert game emotion vector to Pinecone
 */
export async function upsertGameVector(
  gameId: string,
  embedding: number[],
  metadata: {
    soulScore?: number;
    genres?: string[];
    price?: number;
    releaseDate?: string;
  }
): Promise<void> {
  if (!index) {
    throw new Error("Pinecone not initialized");
  }

  try {
    await index.upsert([
      {
        id: gameId,
        values: embedding,
        metadata: {
          soulScore: metadata.soulScore || 0,
          genres: metadata.genres || [],
          price: metadata.price || 0,
          releaseDate: metadata.releaseDate || "",
        },
      },
    ]);
  } catch (error) {
    console.error(`Error upserting vector for game ${gameId}:`, error);
    throw error;
  }
}

/**
 * Batch upsert game vectors
 */
export async function batchUpsertGameVectors(
  vectors: Array<{
    gameId: string;
    embedding: number[];
    metadata: {
      soulScore?: number;
      genres?: string[];
      price?: number;
      releaseDate?: string;
    };
  }>
): Promise<void> {
  if (!index) {
    throw new Error("Pinecone not initialized");
  }

  try {
    const pineconeVectors = vectors.map((v) => ({
      id: v.gameId,
      values: v.embedding,
      metadata: {
        soulScore: v.metadata.soulScore || 0,
        genres: v.metadata.genres || [],
        price: v.metadata.price || 0,
        releaseDate: v.metadata.releaseDate || "",
      },
    }));

    // Pinecone supports batches of 100
    const batchSize = 100;
    for (let i = 0; i < pineconeVectors.length; i += batchSize) {
      const batch = pineconeVectors.slice(i, i + batchSize);
      await index.upsert(batch);
    }
  } catch (error) {
    console.error("Error batch upserting vectors:", error);
    throw error;
  }
}

/**
 * Query similar games by emotion vector
 */
export async function querySimilarGames(
  embedding: number[],
  options: {
    topK?: number;
    minSoulScore?: number;
    genres?: string[];
    priceRange?: { min: number; max: number };
    excludeIds?: string[];
  } = {}
): Promise<
  Array<{
    gameId: string;
    score: number;
    metadata: any;
  }>
> {
  if (!index) {
    throw new Error("Pinecone not initialized");
  }

  const {
    topK = 20,
    minSoulScore,
    genres,
    priceRange,
    excludeIds = [],
  } = options;

  try {
    // Build filter
    const filter: any = {};

    if (minSoulScore !== undefined) {
      filter.soulScore = { $gte: minSoulScore };
    }

    if (genres && genres.length > 0) {
      filter.genres = { $in: genres };
    }

    if (priceRange) {
      filter.price = { $gte: priceRange.min, $lte: priceRange.max };
    }

    const queryResponse = await index.query({
      vector: embedding,
      topK: topK + excludeIds.length, // Get extra to account for exclusions
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    // Filter out excluded IDs and return top K
    const results = queryResponse.matches
      .filter((match: any) => !excludeIds.includes(match.id))
      .slice(0, topK)
      .map((match: any) => ({
        gameId: match.id,
        score: match.score || 0,
        metadata: match.metadata || {},
      }));

    return results;
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw error;
  }
}

/**
 * Delete game vector from Pinecone
 */
export async function deleteGameVector(gameId: string): Promise<void> {
  if (!index) {
    throw new Error("Pinecone not initialized");
  }

  try {
    await index.deleteOne(gameId);
  } catch (error) {
    console.error(`Error deleting vector for game ${gameId}:`, error);
    throw error;
  }
}

export { pinecone, index };

