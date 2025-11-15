#!/usr/bin/env tsx
/**
 * Setup Database Schema
 * Runs the schema.sql file against the database
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";

dotenv.config({ path: ".env" });

async function main() {
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set in .env");
    process.exit(1);
  }

  // URL-encode special characters in password (especially #)
  // Replace password in connection string
  const urlMatch = databaseUrl.match(/^(postgresql?:\/\/[^:]+:)([^@]+)@(.+)$/);
  if (urlMatch) {
    const [, prefix, password, rest] = urlMatch;
    const encodedPassword = encodeURIComponent(password);
    databaseUrl = `${prefix}${encodedPassword}@${rest}`;
  }

  console.log("🔧 Setting up database schema...\n");

  // Read schema file
  const schemaPath = path.join(process.cwd(), "src", "config", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Connect to database
  // Use connectionString directly - pg handles URL encoding
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Supabase requires SSL
    },
  });

  try {
    console.log("1. Connecting to database...");
    await pool.query("SELECT 1");
    console.log("   ✅ Connected!\n");

    console.log("2. Running schema...");
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (!error.message.includes("already exists") && !error.message.includes("duplicate")) {
            console.error(`   ⚠️  Error: ${error.message}`);
          }
        }
      }
    }

    console.log("   ✅ Schema applied!\n");

    // Verify tables
    console.log("3. Verifying tables...");
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map((r) => r.table_name);
    console.log(`   ✅ Found ${tables.length} tables:`);
    tables.forEach((table) => {
      console.log(`      - ${table}`);
    });

    // Check for pgvector extension
    const extResult = await pool.query(`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `);
    
    if (extResult.rows.length > 0) {
      console.log("\n   ✅ pgvector extension installed");
    } else {
      console.log("\n   ⚠️  pgvector extension not found (may need manual installation)");
    }

    console.log("\n✨ Database setup complete!\n");
  } catch (error) {
    console.error("\n❌ Database setup failed:");
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

