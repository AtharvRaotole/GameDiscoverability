/**
 * Discovery Controller
 * Handles emotion-based game discovery requests
 */

import { Request, Response } from "express";
import { analyzeUserInput, extractEmotionalKeywords } from "../services/emotion-analysis.service";
import { findSimilarGames } from "../services/recommendation.service";
import { transformGame } from "../utils/game-transform";
import { cache } from "../config/redis";
import { z } from "zod";

const discoverSchema = z.object({
  query: z.string().min(20).max(500),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
  filters: z
    .object({
      minSoulScore: z.number().min(0).max(100).optional(),
      genres: z.array(z.string()).optional(),
      priceRange: z
        .object({
          min: z.number().min(0),
          max: z.number().min(0),
        })
        .optional(),
    })
    .optional(),
});

/**
 * POST /api/discover
 * Discover games based on emotional query
 */
export async function discoverGames(req: Request, res: Response) {
  try {
    const body = discoverSchema.parse(req.body);
    const { query, limit = 20, offset = 0, filters } = body;

    // Create cache key
    const cacheKey = `discover:${query}:${limit}:${offset}:${JSON.stringify(filters || {})}`;
    
    // Check cache (cache for 1 hour)
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // 1. Analyze user input to get emotion vector
    const emotionVector = await analyzeUserInput(query);

    // 2. Find similar games
    const matches = await findSimilarGames(emotionVector, {
      limit: limit + offset,
      minSoulScore: filters?.minSoulScore,
      genres: filters?.genres,
      priceRange: filters?.priceRange,
    });

    // 3. Apply offset
    const paginatedMatches = matches.slice(offset, offset + limit);

    // 4. Save search to database (optional, for analytics)
    // await saveEmotionalSearch(userId, query, emotionVector);

    // Transform games to frontend format
    const transformedMatches = paginatedMatches.map(match => ({
      ...match,
      game: transformGame(match.game),
    }));

    const response = {
      emotionVector: {
        embedding: emotionVector.embedding,
        emotions: emotionVector.emotions,
      },
      results: transformedMatches,
      total: matches.length,
      hasMore: matches.length > offset + limit,
    };

    // Cache response for 1 hour
    await cache.set(cacheKey, response, 3600);

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Discovery error:", error);
    return res.status(500).json({
      error: "Failed to discover games",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/emotions/extract
 * Extract emotional keywords from text (for real-time UI)
 */
export async function extractEmotions(req: Request, res: Response) {
  try {
    const { text } = z
      .object({
        text: z.string().min(1).max(500),
      })
      .parse(req.body);

    const tags = await extractEmotionalKeywords(text);

    return res.json(tags);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    console.error("Emotion extraction error:", error);
    return res.status(500).json({
      error: "Failed to extract emotions",
    });
  }
}

