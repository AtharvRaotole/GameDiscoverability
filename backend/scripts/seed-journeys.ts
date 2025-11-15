#!/usr/bin/env tsx
/**
 * Seed Curated Journeys
 * Creates sample journeys using games that exist in the database
 */

require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });

import { pool } from "../src/config/database";

async function seedJourneys() {
  console.log("🌱 Seeding curated journeys...\n");

  try {
    // Get some games from the database
    const gamesResult = await pool.query(`
      SELECT id, name, soul_score 
      FROM games 
      ORDER BY soul_score DESC 
      LIMIT 20
    `);

    const games = gamesResult.rows;
    console.log(`Found ${games.length} games to use in journeys\n`);

    if (games.length < 4) {
      console.log("❌ Need at least 4 games to create journeys");
      return;
    }

    // Create journeys using actual game IDs
    const journeys = [
      {
        title: "Emotional Masterpieces",
        description: "A journey through the most emotionally impactful games",
        gameIds: games.slice(0, 5).map((g: any) => g.id),
      },
      {
        title: "From Melancholy to Joy",
        description: "Experience the full spectrum of emotions",
        gameIds: games.slice(5, 10).map((g: any) => g.id),
      },
      {
        title: "Indie Gems",
        description: "Discover the best indie games with soul",
        gameIds: games.filter((g: any) => g.soul_score >= 70).slice(0, 4).map((g: any) => g.id),
      },
    ];

    for (const journey of journeys) {
      if (journey.gameIds.length < 2) {
        console.log(`⚠️  Skipping "${journey.title}" - not enough games`);
        continue;
      }

      const gameSequence = journey.gameIds.map((gameId: string, index: number) => ({
        gameId,
        order: index + 1,
      }));

      await pool.query(
        `INSERT INTO journeys (title, description, game_sequence, emotional_arc, is_curated, created_by)
         VALUES ($1, $2, $3::jsonb, $4::jsonb, true, NULL)
         ON CONFLICT DO NOTHING`,
        [
          journey.title,
          journey.description,
          JSON.stringify(gameSequence),
          JSON.stringify({ emotions: [], transitions: [] }),
        ]
      );

      console.log(`✅ Created journey: "${journey.title}" with ${journey.gameIds.length} games`);
    }

    // Check how many journeys we have now
    const countResult = await pool.query(
      "SELECT COUNT(*) as count FROM journeys WHERE is_curated = true"
    );
    console.log(`\n📊 Total curated journeys: ${countResult.rows[0].count}`);

    console.log("\n✅ Journey seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding journeys:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedJourneys();

