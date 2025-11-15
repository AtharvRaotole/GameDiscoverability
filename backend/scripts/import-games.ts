#!/usr/bin/env tsx
/**
 * Game Import Script
 * Imports games from Steam App IDs
 * 
 * Usage:
 *   npm run import-games 753640 480 304430
 *   or
 *   tsx scripts/import-games.ts 753640 480 304430
 */

// Load environment variables FIRST using require (executes before imports)
require("dotenv").config({ path: require("path").join(process.cwd(), ".env") });

// Now import services (which will use env.ts)
import { importGameFromSteam, batchImportGames } from "../src/services/game-import.service";
import { initializePinecone } from "../src/services/pinecone.service";

async function main() {
  const appIds = process.argv.slice(2);
  
  // Initialize Pinecone before importing
  console.log("🔧 Initializing Pinecone...\n");
  try {
    await initializePinecone();
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone:", error);
    process.exit(1);
  }

  if (appIds.length === 0) {
    console.log("Usage: npm run import-games <steam-app-id> [<steam-app-id> ...]");
    console.log("\nExample popular games:");
    console.log("  753640  - Outer Wilds");
    console.log("  480     - Limbo");
    console.log("  304430  - Inside");
    console.log("  413150  - Stardew Valley");
    console.log("  504230  - Celeste");
    console.log("  367520  - Hollow Knight");
    console.log("  683320  - Gris");
    console.log("  638230  - Journey");
    console.log("  384380  - Abzû");
    console.log("  221910  - The Stanley Parable");
    process.exit(1);
  }

  console.log(`\n🎮 Importing ${appIds.length} game(s)...\n`);

  try {
    const results = await batchImportGames(appIds);

    console.log(`\n✅ Import complete!`);
    console.log(`   Success: ${results.success}`);
    console.log(`   Failed: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      results.errors.forEach(({ appId, error }) => {
        console.log(`   ${appId}: ${error}`);
      });
    }

    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

main();

