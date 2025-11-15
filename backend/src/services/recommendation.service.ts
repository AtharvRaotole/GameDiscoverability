/**
 * Recommendation Engine
 * Combines vector search with emotion matching and soul score
 */

import { pool } from "../config/database";
import { querySimilarGames } from "./pinecone.service";
import { calculateEmotionSimilarity, EmotionProfile } from "./emotion-analysis.service";
import { transformGame } from "../utils/game-transform";

export interface GameMatch {
  game: any;
  matchScore: number; // 0-100
  soulScore: number;
  emotionAlignment: number; // 0-100
}

export interface SearchOptions {
  limit?: number;
  minSoulScore?: number;
  genres?: string[];
  priceRange?: { min: number; max: number };
  excludeGameIds?: string[];
  boostIndie?: boolean;
}

/**
 * Find similar games based on emotion vector
 */
export async function findSimilarGames(
  emotionVector: {
    embedding: number[];
    emotions: EmotionProfile;
  },
  options: SearchOptions = {}
): Promise<GameMatch[]> {
  const {
    limit = 20,
    minSoulScore,
    genres,
    priceRange,
    excludeGameIds = [],
    boostIndie = false,
  } = options;

  try {
    // 1. Query Pinecone for similar vectors
    const vectorResults = await querySimilarGames(emotionVector.embedding, {
      topK: limit + excludeGameIds.length + 20, // Get extra for filtering
      minSoulScore,
      genres,
      priceRange,
      excludeIds: excludeGameIds,
    });

    if (vectorResults.length === 0) {
      return [];
    }

    // 2. Fetch full game data from database
    const gameIds = vectorResults.map((r) => r.gameId);
    const games = await fetchGamesByIds(gameIds);

    // 3. Calculate comprehensive match scores
    const matches: GameMatch[] = [];

    for (const vectorResult of vectorResults) {
      const game = games.find((g) => g.id === vectorResult.gameId);
      if (!game) continue;

      // Calculate emotion alignment
      const emotionAlignment = game.emotion_profile
        ? calculateEmotionSimilarity(
            emotionVector.emotions,
            game.emotion_profile as EmotionProfile
          ) * 100
        : vectorResult.score * 100;

      // Calculate final match score
      // Improved formula: Better scaling for low scores, more weight on emotion alignment
      const embeddingScore = vectorResult.score; // 0-1 from Pinecone (cosine similarity)
      const emotionAlignmentScore = emotionAlignment / 100; // Convert back to 0-1
      const soulScore = game.soul_score || 50;
      const indieBoost = boostIndie && isIndieGame(game) ? 0.05 : 0;

      // Primary match: weighted combination of semantic and emotion similarity
      // Emotion alignment is more important for "emotional" matching
      const primaryMatch = 
        embeddingScore * 0.4 +      // 40% semantic similarity
        emotionAlignmentScore * 0.6; // 60% emotion alignment (more important!)
      
      // Scale primary match to 0-100 range, but use better scaling
      // Low scores (0.3) should map to ~50%, medium (0.5) to ~70%, high (0.8) to ~90%
      const scaledPrimary = primaryMatch < 0.3 
        ? 40 + (primaryMatch / 0.3) * 20  // 0.0-0.3 maps to 40-60%
        : primaryMatch < 0.6
        ? 60 + ((primaryMatch - 0.3) / 0.3) * 20  // 0.3-0.6 maps to 60-80%
        : 80 + ((primaryMatch - 0.6) / 0.4) * 15; // 0.6-1.0 maps to 80-95%

      // Add soul score as quality boost (0-10 points)
      const soulBoost = soulScore >= 90 ? 10 : soulScore >= 80 ? 7 : soulScore >= 70 ? 5 : soulScore >= 60 ? 3 : 0;
      
      // Final score: primary match + soul boost + indie boost
      const matchScore = Math.min(100, Math.round(scaledPrimary + soulBoost + (indieBoost * 100)));

      matches.push({
        game,
        matchScore: Math.round(matchScore),
        soulScore,
        emotionAlignment: Math.round(emotionAlignment),
      });
    }

    // 4. Sort by match score and return top N
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  } catch (error) {
    console.error("Error finding similar games:", error);
    throw error;
  }
}

/**
 * Fetch games by IDs from database
 */
async function fetchGamesByIds(gameIds: string[]): Promise<any[]> {
  if (gameIds.length === 0) return [];

  const placeholders = gameIds.map((_, i) => `$${i + 1}`).join(",");
  const query = `
    SELECT 
      id, name, description, short_description,
      header_image, capsule_image, release_date, price,
      steam_url, soul_score, emotion_profile, genres, tags
    FROM games
    WHERE id IN (${placeholders})
  `;

  try {
    const result = await pool.query(query, gameIds);
    return result.rows;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

/**
 * Check if game is indie (heuristic: low price, small team indicators)
 */
function isIndieGame(game: any): boolean {
  // Simple heuristic - can be improved with actual data
  const price = parseFloat(game.price) || 0;
  return price < 30; // Indie games typically cheaper
}

/**
 * Get similar games to a specific game
 */
export async function getSimilarToGame(
  gameId: string,
  limit = 10
): Promise<GameMatch[]> {
  try {
    // Fetch game's emotion vector
    const gameResult = await pool.query(
      "SELECT emotion_vector, emotion_profile FROM games WHERE id = $1",
      [gameId]
    );

    if (gameResult.rows.length === 0) {
      return [];
    }

    const game = gameResult.rows[0];
    if (!game.emotion_vector) {
      return [];
    }

    const emotionVector = {
      embedding: game.emotion_vector,
      emotions: (game.emotion_profile || {}) as EmotionProfile,
    };

    return findSimilarGames(emotionVector, {
      limit,
      excludeGameIds: [gameId],
    });
  } catch (error) {
    console.error(`Error getting similar games to ${gameId}:`, error);
    return [];
  }
}

