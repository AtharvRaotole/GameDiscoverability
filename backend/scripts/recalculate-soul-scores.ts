#!/usr/bin/env tsx
/**
 * Recalculate Soul Scores for All Games
 * Fetches real review data from Steam and recalculates soul scores
 */

require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });

import { pool } from "../src/config/database";
import { getSteamReviewSummary } from "../src/services/steam-reviews.service";
import { calculateSoulScore } from "../src/services/soul-score.service";
import { analyzeGameEmotions } from "../src/services/emotion-analysis.service";

async function main() {
  console.log("🔄 Recalculating soul scores for all games...\n");

  try {
    // Get all games
    const result = await pool.query(`
      SELECT id, name, description, genres, tags, price, emotion_profile
      FROM games
    `);

    const games = result.rows;
    console.log(`Found ${games.length} games to update\n`);

    let updated = 0;
    let failed = 0;

    for (const game of games) {
      try {
        console.log(`Processing: ${game.name}...`);

        // Fetch review summary from Steam
        const reviewSummary = await getSteamReviewSummary(game.id);
        
        if (!reviewSummary || !reviewSummary.query_summary) {
          console.log(`  ⚠️  No review data found, skipping...`);
          failed++;
          continue;
        }

        const { total_positive, total_reviews, review_score: review_score_raw } = reviewSummary.query_summary;
        // Steam review_score is 0-10, convert to 0-100 percentage
        const review_score = (review_score_raw / 10) * 100;

        // Estimate playtime based on genre and review count
        const genres = Array.isArray(game.genres) ? game.genres : [];
        const isLongGame = genres.some((g: string) => 
          ['RPG', 'Strategy', 'Simulation'].includes(g)
        );
        const basePlaytime = isLongGame ? 40 : 20;
        const estimatedPlaytime = Math.min(
          basePlaytime + (total_reviews / 1000) * 15, 
          120
        );

        // Estimate developer size
        const isIndie = genres.some((g: string) => 
          g.toLowerCase().includes("indie")
        );
        const developerSize = isIndie ? 5 : 20;

        // Create synthetic reviews
        const baseWordCount = review_score >= 90 ? 80 : review_score >= 80 ? 60 : review_score >= 70 ? 40 : 25;
        const descriptionWords = (game.description || "").split(/\s+/).length;
        const estimatedWordCount = Math.max(19, Math.min(baseWordCount + (descriptionWords * 0.1), 150));

        const syntheticReviews = Array.from({ length: Math.min(5, Math.floor(total_reviews / 1000) + 1) }, () => ({
          text: (game.description || "").substring(0, 500),
          isPositive: review_score >= 70,
          wordCount: estimatedWordCount + (Math.random() * 20 - 10),
          hoursPlayed: estimatedPlaytime + (Math.random() * estimatedPlaytime * 0.3 - estimatedPlaytime * 0.15),
        }));

        // Re-analyze emotions if needed
        const emotionProfile = game.emotion_profile || await analyzeGameEmotions(
          game.description || "",
          []
        );

        // Calculate new soul score
        const soulScoreResult = await calculateSoulScore({
          id: game.id,
          name: game.name,
          description: game.description || "",
          genres: genres,
          tags: Array.isArray(game.tags) ? game.tags : [],
          price: game.price || 0,
          emotion_profile: emotionProfile,
          reviews: syntheticReviews,
          positiveReviews: total_positive,
          totalReviews: total_reviews,
          playerPlaytimes: [
            estimatedPlaytime,
            estimatedPlaytime * 0.8,
            estimatedPlaytime * 1.2
          ],
          developerSize: developerSize,
          publisher: "",
          primaryGenre: genres[0] || "Indie",
        });

        // Update database
        await pool.query(
          `UPDATE games 
           SET soul_score = $1, 
               emotion_profile = $2,
               updated_at = NOW()
           WHERE id = $3`,
          [
            soulScoreResult.score,
            JSON.stringify(emotionProfile),
            game.id
          ]
        );

        console.log(`  ✅ Updated: ${game.name} - Soul Score: ${soulScoreResult.score}/100`);
        updated++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Error updating ${game.name}:`, error instanceof Error ? error.message : error);
        failed++;
      }
    }

    console.log(`\n✅ Recalculation complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);
  } catch (error) {
    console.error("\n❌ Recalculation failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

