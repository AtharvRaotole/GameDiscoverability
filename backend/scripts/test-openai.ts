#!/usr/bin/env tsx
/**
 * Test OpenAI Connection
 */

import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env" });

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY not set in .env");
    process.exit(1);
  }

  console.log("🧪 Testing OpenAI connection...\n");
  console.log(`API Key: ${apiKey.substring(0, 20)}...\n`);

  try {
    const openai = new OpenAI({ apiKey });

    // Test 1: Generate embedding
    console.log("1. Testing embedding generation...");
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: "test embedding",
    });

    const embedding = embeddingResponse.data[0].embedding;
    console.log(`   ✅ Embedding generated!`);
    console.log(`      Dimensions: ${embedding.length}`);
    console.log(`      First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(", ")}...]\n`);

    if (embedding.length !== 3072) {
      console.log(`   ⚠️  Warning: Expected 3072 dimensions, got ${embedding.length}`);
    }

    // Test 2: GPT-4 call (emotion analysis)
    console.log("2. Testing GPT-4 (emotion analysis)...");
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an emotion analysis expert. Analyze the emotional content of game descriptions.",
        },
        {
          role: "user",
          content: "Analyze this game description: 'A peaceful exploration game set in space'",
        },
      ],
      max_tokens: 100,
    });

    console.log(`   ✅ GPT-4 response received!`);
    console.log(`      Response: ${chatResponse.choices[0].message.content?.substring(0, 80)}...\n`);

    console.log("✨ OpenAI test complete!\n");
    console.log("✅ All OpenAI services working correctly!");
  } catch (error) {
    console.error("\n❌ OpenAI connection failed:");
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    console.error("\nCheck:");
    console.error("   1. OPENAI_API_KEY is correct");
    console.error("   2. You have credits in your OpenAI account");
    console.error("   3. API key has proper permissions");
    process.exit(1);
  }
}

main();

