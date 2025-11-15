#!/usr/bin/env tsx
/**
 * Standalone TasteRay API Test
 * Tests TasteRay API without requiring full environment setup
 */

const TASTERAY_API_KEY = process.env.TASTERAY_API_KEY;
if (!TASTERAY_API_KEY) {
  throw new Error("TASTERAY_API_KEY environment variable is required");
}
const BASE_URL = "https://api.tasteray.com";

async function makeRequest(endpoint: string, options: { method?: string; body?: string } = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": TASTERAY_API_KEY,
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  return response.json();
}

async function main() {
  console.log("🧪 Testing TasteRay API...\n");
  console.log(`API Key: ${TASTERAY_API_KEY.substring(0, 20)}...\n`);

  // Test 1: Health Check
  console.log("1. Testing health check...");
  try {
    const health = await makeRequest("/v1/health");
    if (health.status === "healthy") {
      console.log("   ✅ API is healthy");
      console.log(`   Version: ${health.version}`);
      console.log(`   Checks: ${JSON.stringify(health.checks)}\n`);
    } else {
      console.log(`   ⚠️  API returned: ${health.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 2: Usage Stats
  console.log("2. Checking usage statistics...");
  try {
    const usage = await makeRequest("/v1/usage");
    console.log(`   ✅ Usage stats retrieved:`);
    console.log(`      Tier: ${usage.tier.name}`);
    console.log(`      Rate Limit: ${usage.tier.rate_limit}`);
    console.log(`      Requests Made: ${usage.usage.requests_made}`);
    console.log(`      Requests Remaining: ${usage.usage.requests_remaining}`);
    console.log(`      Percentage Used: ${usage.usage.percentage_used.toFixed(1)}%\n`);
  } catch (error) {
    console.log(`   ❌ Usage check failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 3: Get Recommendations
  console.log("3. Testing recommendations...");
  try {
    const response = await makeRequest("/v1/recommend", {
      method: "POST",
      body: JSON.stringify({
        vertical: "entertainment",
        context: {
          preferences: ["melancholic", "hopeful", "exploration"],
          constraints: { genre: "adventure" },
        },
        options: {
          count: 3,
          explanation_depth: "detailed",
        },
      }),
    });

    if (response.recommendations && response.recommendations.length > 0) {
      console.log(`   ✅ Got ${response.recommendations.length} recommendation(s)`);
      const first = response.recommendations[0];
      console.log(`      First: ${first.item.name}`);
      console.log(`      Confidence: ${(first.confidence * 100).toFixed(1)}%`);
      console.log(`      Why: ${first.explanation.why_match.substring(0, 80)}...\n`);
    } else {
      console.log("   ⚠️  No recommendations returned\n");
    }
  } catch (error) {
    console.log(`   ❌ Recommendations failed: ${error instanceof Error ? error.message : String(error)}\n`);
  }

  // Test 4: Explain Match
  console.log("4. Testing match explanation...");
  try {
    const response = await makeRequest("/v1/explain", {
      method: "POST",
      body: JSON.stringify({
        vertical: "entertainment",
        item: {
          name: "Outer Wilds",
          type: "game",
        },
        context: {
          user_preferences: ["wonder", "nostalgia", "melancholy"],
        },
        options: {
          depth: "detailed",
        },
      }),
    });

    if (response.explanation) {
      console.log(`   ✅ Explanation retrieved`);
      console.log(`      Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      console.log(`      Summary: ${response.explanation.summary.substring(0, 100)}...\n`);
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

