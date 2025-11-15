#!/usr/bin/env tsx
/**
 * Import Popular Games Script
 * Imports a curated list of popular indie and emotional games
 */

// Load environment variables FIRST
require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });

import { batchImportGames } from "../src/services/game-import.service";
import { initializePinecone } from "../src/services/pinecone.service";

// Curated list of popular indie/emotional games
const POPULAR_GAMES = [
  // Emotional/Artistic Games (High Soul Score)
  "753640",  // Outer Wilds
  "504230",  // Celeste
  "367520",  // Hollow Knight
  "413150",  // Stardew Valley
  "683320",  // Gris
  "638230",  // Journey
  "384380",  // Abzû
  "221910",  // The Stanley Parable
  "480",     // Limbo
  "304430",  // Inside
  "257850",  // The Talos Principle
  "383870",  // Firewatch
  "239140",  // Dying Light
  "287700",  // Metro: Last Light Redux
  "271590",  // Grand Theft Auto V
  "730",     // Counter-Strike: Global Offensive
  "1174180", // Red Dead Redemption 2
  "1091500", // Cyberpunk 2077
  "570",     // Dota 2
  "440",     // Team Fortress 2
  "252490",  // Rust
  "252950",  // Rocket League
  "359550",  // Tom Clancy's Rainbow Six Siege
];

// Remove duplicates
const uniqueGames = [...new Set(POPULAR_GAMES)];

async function main() {
  console.log("🔧 Initializing Pinecone...\n");
  try {
    await initializePinecone();
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone:", error);
    process.exit(1);
  }

  console.log(`\n🎮 Importing ${uniqueGames.length} popular games...\n`);

  try {
    const results = await batchImportGames(uniqueGames);

    console.log(`\n✅ Import complete!`);
    console.log(`   Success: ${results.success}`);
    console.log(`   Failed: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      results.errors.forEach(({ appId, error }) => {
        console.log(`   ${appId}: ${error}`);
      });
    }

    console.log(`\n📊 Total games in database now: ${results.success}`);
    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

main();

