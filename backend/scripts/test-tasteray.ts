#!/usr/bin/env tsx
/**
 * TasteRay API Test Script
 * Tests the TasteRay API connection and functionality
 */

import { tasterayService } from "../src/services/tasteray.service";

async function main() {
  console.log("🧪 Testing TasteRay API...\n");

  // Test 1: Health Check
  console.log("1. Testing health check...");
  try {
    const isHealthy = await tasterayService.checkHealth();
    if (isHealthy) {
      console.log("   ✅ API is healthy\n");
    } else {
      console.log("   ⚠️  API health check returned false\n");
    }
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 2: Usage Stats
  console.log("2. Checking usage statistics...");
  try {
    const usage = await tasterayService.getUsage();
    if (usage) {
      console.log(`   ✅ Usage stats retrieved:`);
      console.log(`      Tier: ${usage.tier.name}`);
      console.log(`      Rate Limit: ${usage.tier.rate_limit}`);
      console.log(`      Requests Made: ${usage.usage.requests_made}`);
      console.log(`      Requests Remaining: ${usage.usage.requests_remaining}`);
      console.log(`      Percentage Used: ${usage.usage.percentage_used.toFixed(1)}%\n`);
    } else {
      console.log("   ⚠️  Could not retrieve usage stats\n");
    }
  } catch (error) {
    console.log(`   ❌ Usage check failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 3: Get Recommendations
  console.log("3. Testing recommendations...");
  try {
    const recommendations = await tasterayService.getRecommendations(
      ["melancholic", "hopeful", "exploration"],
      { genre: "adventure" }
    );
    if (recommendations.length > 0) {
      console.log(`   ✅ Got ${recommendations.length} recommendation(s)`);
      console.log(`      First: ${recommendations[0].item.name}`);
      console.log(`      Confidence: ${(recommendations[0].confidence * 100).toFixed(1)}%\n`);
    } else {
      console.log("   ⚠️  No recommendations returned\n");
    }
  } catch (error) {
    console.log(`   ❌ Recommendations failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 4: Explain Match
  console.log("4. Testing match explanation...");
  try {
    const explanation = await tasterayService.explainMatch("Outer Wilds", [
      "wonder",
      "nostalgia",
      "melancholy",
    ]);
    if (explanation) {
      console.log(`   ✅ Explanation retrieved`);
      console.log(`      Confidence: ${(explanation.confidence * 100).toFixed(1)}%`);
      console.log(`      Summary: ${explanation.explanation.summary.substring(0, 100)}...\n`);
    } else {
      console.log("   ⚠️  No explanation returned\n");
    }
  } catch (error) {
    console.log(`   ❌ Explanation failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  console.log("✨ Test complete!\n");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

