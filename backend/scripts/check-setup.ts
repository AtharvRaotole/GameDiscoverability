#!/usr/bin/env tsx
/**
 * Setup Check Script
 * Checks what's configured and what's missing
 */

import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

const required = {
  DATABASE_URL: process.env.DATABASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  TASTERAY_API_KEY: process.env.TASTERAY_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
};

const optional = {
  REDIS_URL: process.env.REDIS_URL,
  STEAM_API_KEY: process.env.STEAM_API_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

console.log("🔍 Checking setup...\n");

console.log("Required Configuration:");
let allRequired = true;
for (const [key, value] of Object.entries(required)) {
  if (value) {
    const display = key.includes("KEY") || key.includes("SECRET") 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`  ✅ ${key}: ${display}`);
  } else {
    console.log(`  ❌ ${key}: NOT SET`);
    allRequired = false;
  }
}

console.log("\nOptional Configuration:");
for (const [key, value] of Object.entries(optional)) {
  if (value) {
    console.log(`  ✅ ${key}: Set`);
  } else {
    console.log(`  ⚪ ${key}: Not set (optional)`);
  }
}

console.log("\n" + "=".repeat(50));

if (allRequired) {
  console.log("✅ All required configuration is set!");
  console.log("\nYou can now:");
  console.log("  1. Test TasteRay: npm run test-tasteray");
  console.log("  2. Import games: npm run import-games 753640 480 304430");
  console.log("  3. Start server: npm run dev");
} else {
  console.log("❌ Missing required configuration");
  console.log("\nPlease edit .env and add:");
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      console.log(`  - ${key}`);
    }
  }
  console.log("\nSee QUICK_START.md for details.");
}

console.log("");

