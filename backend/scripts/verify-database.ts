#!/usr/bin/env tsx
/**
 * Verify Database Setup
 * Checks if all tables and indexes were created correctly
 */

import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env" });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set in .env");
    process.exit(1);
  }

  // URL-encode password if needed
  let dbUrl = databaseUrl;
  const urlMatch = databaseUrl.match(/^(postgresql?:\/\/[^:]+:)([^@]+)@(.+)$/);
  if (urlMatch) {
    const [, prefix, password, rest] = urlMatch;
    const encodedPassword = encodeURIComponent(password);
    dbUrl = `${prefix}${encodedPassword}@${rest}`;
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔍 Verifying database setup...\n");

    // Check tables
    console.log("1. Checking tables...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const expectedTables = [
      "users",
      "games",
      "user_libraries",
      "emotional_searches",
      "journeys",
    ];

    const existingTables = tablesResult.rows.map((r) => r.table_name);
    console.log(`   Found ${existingTables.length} tables:`);
    
    let allTablesExist = true;
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} - MISSING`);
        allTablesExist = false;
      }
    }

    // Check extensions
    console.log("\n2. Checking extensions...");
    const extResult = await pool.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'vector')
      ORDER BY extname
    `);

    const extensions = extResult.rows.map((r) => r.extname);
    if (extensions.includes("uuid-ossp")) {
      console.log(`   ✅ uuid-ossp (${extResult.rows.find(r => r.extname === 'uuid-ossp')?.extversion})`);
    } else {
      console.log(`   ❌ uuid-ossp - MISSING`);
    }

    if (extensions.includes("vector")) {
      console.log(`   ✅ vector (${extResult.rows.find(r => r.extname === 'vector')?.extversion})`);
    } else {
      console.log(`   ❌ vector - MISSING`);
    }

    // Check indexes
    console.log("\n3. Checking indexes...");
    const indexesResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename = 'games'
      ORDER BY indexname
    `);

    const gameIndexes = indexesResult.rows.map((r) => r.indexname);
    console.log(`   Found ${gameIndexes.length} indexes on games table:`);
    gameIndexes.forEach((idx) => {
      console.log(`   ✅ ${idx}`);
    });

    // Check vector column
    console.log("\n4. Checking vector column...");
    const columnResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'games' 
      AND column_name = 'emotion_vector'
    `);

    if (columnResult.rows.length > 0) {
      console.log(`   ✅ emotion_vector column exists (type: ${columnResult.rows[0].data_type})`);
    } else {
      console.log(`   ❌ emotion_vector column - MISSING`);
    }

    console.log("\n" + "=".repeat(50));

    if (allTablesExist && extensions.length === 2) {
      console.log("✅ Database setup complete and verified!\n");
      console.log("Next steps:");
      console.log("  1. Import games: npm run import-games 753640 480 304430");
      console.log("  2. Start server: npm run dev");
    } else {
      console.log("⚠️  Some components are missing. Please check the errors above.");
    }
  } catch (error) {
    console.error("\n❌ Verification failed:");
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

