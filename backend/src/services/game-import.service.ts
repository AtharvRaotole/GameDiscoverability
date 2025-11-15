/**
 * Game Import Service
 * Handles importing games from various sources and processing them
 */

import { pool } from "../config/database";
import { analyzeGameEmotions } from "./emotion-analysis.service";
import { generateEmbedding } from "./embedding.service";
import { calculateSoulScoreFactors, calculateSoulScoreLegacy } from "./soul-score.service";
import { calculateSoulScore } from "./soul-score.service";
import { upsertGameVector } from "./pinecone.service";
import { steamService } from "./steam.service";
import { getSteamReviewSummary } from "./steam-reviews.service";

/**
 * Import game from Steam App ID
 */
export async function importGameFromSteam(steamAppId: string): Promise<void> {
  try {
    // 1. Fetch game details from Steam
    const steamGame = await steamService.getGameDetails(steamAppId);
    if (!steamGame) {
      throw new Error(`Game ${steamAppId} not found on Steam`);
    }

    // 2. Prepare game data
    const gameData = {
      id: steamAppId,
      name: steamGame.name,
      description: steamGame.detailed_description,
      short_description: steamGame.short_description,
      header_image: steamGame.header_image,
      capsule_image: steamGame.capsule_image,
      release_date: steamGame.release_date.date,
      price: steamGame.price_overview
        ? steamGame.price_overview.final / 100
        : 0,
      steam_url: `https://store.steampowered.com/app/${steamAppId}`,
      genres: steamGame.genres.map((g) => g.description),
      tags: steamGame.categories.map((c) => c.description),
      // Extract review data from Steam
      reviews: steamGame.reviews || null,
      recommendations: steamGame.recommendations || null,
      metacritic: steamGame.metacritic || null,
      developers: steamGame.developers || [],
      publishers: steamGame.publishers || [],
    };

    // 3. Analyze emotions (this requires reviews - for now use description)
    const emotionProfile = await analyzeGameEmotions(
      gameData.description,
      [] // Reviews would go here
    );

    // 4. Generate embedding
    const embedding = await generateEmbedding(
      `${gameData.name} ${gameData.description}`
    );

    // 5. Fetch actual review statistics from Steam Reviews API
    const reviewSummary = await getSteamReviewSummary(steamAppId);
    
    const positiveReviews = reviewSummary?.query_summary?.total_positive || 0;
    const totalReviews = reviewSummary?.query_summary?.total_reviews || (gameData.recommendations?.total || 0);
    // Steam review_score is 0-10, convert to 0-100 percentage
    const reviewScoreRaw = reviewSummary?.query_summary?.review_score || 0;
    const reviewScore = (reviewScoreRaw / 10) * 100; // Convert to 0-100
    const reviewScoreDesc = reviewSummary?.query_summary?.review_score_desc || "";
    
    // Estimate player playtimes based on review count and genre
    // Games with many reviews likely have higher engagement
    const basePlaytime = gameData.genres.some((g: string) => 
      ['RPG', 'Strategy', 'Simulation'].includes(g)
    ) ? 40 : 20;
    
    const estimatedPlaytime = totalReviews > 0 
      ? Math.min(basePlaytime + (totalReviews / 1000) * 15, 120) // Estimate based on review count
      : basePlaytime;
    
    // Estimate developer size based on publisher and genre
    const isIndie = gameData.genres.some((g: string) => g.toLowerCase().includes("indie")) ||
                    (gameData.publishers.length === 0 || 
                     gameData.publishers.some((p: string) => p.toLowerCase().includes(gameData.name.toLowerCase())));
    const developerSize = isIndie ? 5 : 20;
    
    // Create synthetic reviews for sentiment analysis
    // Use description and review score to estimate review quality
    const descriptionWords = gameData.description.split(/\s+/).length;
    
    // Estimate review word count based on review score
    // Higher scores = more engaged players = longer reviews
    const baseWordCount = reviewScore >= 90 ? 80 : reviewScore >= 80 ? 60 : reviewScore >= 70 ? 40 : 25;
    const estimatedReviewWordCount = Math.max(19, Math.min(baseWordCount + (descriptionWords * 0.1), 150));
    
    // Create multiple synthetic reviews to better simulate the distribution
    const syntheticReviews = totalReviews > 0 ? Array.from({ length: Math.min(5, Math.floor(totalReviews / 1000) + 1) }, () => ({
      text: gameData.description.substring(0, 500), // Use description as proxy
      isPositive: reviewScore >= 70,
      wordCount: estimatedReviewWordCount + (Math.random() * 20 - 10), // Add some variation
      hoursPlayed: estimatedPlaytime + (Math.random() * estimatedPlaytime * 0.3 - estimatedPlaytime * 0.15),
    })) : [];
    
    // 6. Calculate soul score using new research-backed algorithm
    const gameForSoulScore = {
      id: steamAppId,
      name: gameData.name,
      description: gameData.description,
      genres: gameData.genres,
      tags: gameData.tags,
      price: gameData.price,
      emotion_profile: emotionProfile,
      reviews: syntheticReviews,
      positiveReviews: positiveReviews,
      totalReviews: totalReviews,
      playerPlaytimes: [estimatedPlaytime, estimatedPlaytime * 0.8, estimatedPlaytime * 1.2], // Simulate distribution
      developerSize: developerSize,
      publisher: gameData.publishers[0] || "",
      primaryGenre: gameData.genres[0] || "Indie",
    };
    const soulScoreResult = await calculateSoulScore(gameForSoulScore);
    const soulScore = soulScoreResult.score;

    // 6. Insert into database
    await pool.query(
      `INSERT INTO games (
        id, name, description, short_description,
        header_image, capsule_image, release_date, price,
        steam_url, soul_score, emotion_vector, emotion_profile,
        genres, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        short_description = EXCLUDED.short_description,
        header_image = EXCLUDED.header_image,
        capsule_image = EXCLUDED.capsule_image,
        release_date = EXCLUDED.release_date,
        price = EXCLUDED.price,
        soul_score = EXCLUDED.soul_score,
        emotion_vector = EXCLUDED.emotion_vector,
        emotion_profile = EXCLUDED.emotion_profile,
        genres = EXCLUDED.genres,
        tags = EXCLUDED.tags,
        updated_at = NOW()`,
      [
        gameData.id,
        gameData.name,
        gameData.description,
        gameData.short_description,
        gameData.header_image,
        gameData.capsule_image,
        gameData.release_date,
        gameData.price,
        gameData.steam_url,
        soulScore,
        JSON.stringify(embedding),
        JSON.stringify(emotionProfile),
        gameData.genres,
        gameData.tags,
      ]
    );

    // 7. Index in Pinecone
    await upsertGameVector(steamAppId, embedding, {
      soulScore,
      genres: gameData.genres,
      price: gameData.price,
      releaseDate: gameData.release_date,
    });

    console.log(`✅ Imported game: ${gameData.name}`);
  } catch (error) {
    console.error(`Error importing game ${steamAppId}:`, error);
    throw error;
  }
}

/**
 * Batch import games
 */
export async function batchImportGames(steamAppIds: string[]): Promise<{
  success: number;
  failed: number;
  errors: Array<{ appId: string; error: string }>;
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ appId: string; error: string }>,
  };

  for (const appId of steamAppIds) {
    try {
      await importGameFromSteam(appId);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        appId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

