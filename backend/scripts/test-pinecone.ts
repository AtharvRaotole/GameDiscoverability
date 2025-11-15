#!/usr/bin/env tsx
/**
 * Test Pinecone Connection
 */

import * as dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config({ path: ".env" });

async function main() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || "game-emotions";

  if (!apiKey) {
    console.error("❌ PINECONE_API_KEY not set in .env");
    process.exit(1);
  }

  console.log("🧪 Testing Pinecone connection...\n");
  console.log(`API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`Index Name: ${indexName}\n`);

  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: apiKey,
    });

    // List indexes to verify connection
    console.log("1. Listing indexes...");
    const indexes = await pinecone.listIndexes();
    console.log(`   ✅ Connected! Found ${indexes.indexes?.length || 0} index(es)`);
    
    if (indexes.indexes && indexes.indexes.length > 0) {
      indexes.indexes.forEach((idx) => {
        console.log(`      - ${idx.name} (${idx.dimension} dimensions)`);
      });
    }

    // Check if our index exists
    console.log(`\n2. Checking index '${indexName}'...`);
    const indexExists = indexes.indexes?.some((idx) => idx.name === indexName);
    
    if (indexExists) {
      console.log(`   ✅ Index '${indexName}' exists!`);
      
      // Try to connect to the index
      const index = pinecone.index(indexName);
      
      // Get index stats
      console.log(`\n3. Getting index stats...`);
      try {
        const stats = await index.describeIndexStats();
        console.log(`   ✅ Index stats retrieved:`);
        console.log(`      Total vectors: ${stats.totalRecordCount || 0}`);
        console.log(`      Dimension: ${stats.dimension || 'N/A'}`);
      } catch (error) {
        console.log(`   ⚠️  Could not get stats: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Test upsert (small test vector)
      console.log(`\n4. Testing upsert (test vector)...`);
      try {
        const testVector = {
          id: "test-vector-" + Date.now(),
          values: new Array(3072).fill(0).map(() => Math.random()),
          metadata: { test: true },
        };

        await index.upsert([testVector]);
        console.log(`   ✅ Test vector upserted successfully!`);

        // Clean up - delete test vector
        await index.deleteOne(testVector.id);
        console.log(`   ✅ Test vector deleted (cleanup)`);
      } catch (error) {
        console.log(`   ⚠️  Upsert test failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      console.log(`   ❌ Index '${indexName}' not found!`);
      console.log(`   Please create the index in Pinecone dashboard.`);
    }

    console.log("\n✨ Pinecone test complete!\n");
  } catch (error) {
    console.error("\n❌ Pinecone connection failed:");
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    console.error("\nCheck:");
    console.error("   1. PINECONE_API_KEY is correct");
    console.error("   2. Index name matches");
    console.error("   3. Index exists in Pinecone dashboard");
    process.exit(1);
  }
}

main();

