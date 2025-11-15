#!/usr/bin/env tsx
/**
 * Supabase Setup Helper
 * Helps configure Supabase connection string
 */

import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env");

console.log("🔧 Supabase Setup Helper\n");

console.log("Your Supabase connection string format:");
console.log("postgresql://postgres:[YOUR_PASSWORD]@db.dwxbohwllsmfkpaxcsaz.supabase.co:5432/postgres\n");

console.log("To set this up:");
console.log("1. Replace [YOUR_PASSWORD] with your actual database password");
console.log("2. If you don't know your password, reset it in Supabase Dashboard → Database Settings\n");

const password = process.argv[2];

if (password) {
  const connectionString = `postgresql://postgres:${password}@db.dwxbohwllsmfkpaxcsaz.supabase.co:5432/postgres`;
  
  // Read current .env
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }
  
  // Update DATABASE_URL
  if (envContent.includes("DATABASE_URL=")) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${connectionString}`
    );
  } else {
    envContent += `\nDATABASE_URL=${connectionString}\n`;
  }
  
  // Write back
  fs.writeFileSync(envPath, envContent);
  
  console.log("✅ Updated DATABASE_URL in .env");
  console.log(`   Connection: postgresql://postgres:***@db.dwxbohwllsmfkpaxcsaz.supabase.co:5432/postgres\n`);
  
  console.log("Next steps:");
  console.log("1. Test connection: psql $DATABASE_URL -c 'SELECT version();'");
  console.log("2. Run schema: psql $DATABASE_URL -f src/config/schema.sql");
} else {
  console.log("Usage:");
  console.log("  npm run setup-supabase <your-password>");
  console.log("\nOr manually edit .env and set:");
  console.log("  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.dwxbohwllsmfkpaxcsaz.supabase.co:5432/postgres\n");
  
  console.log("⚠️  Important Notes:");
  console.log("- Replace YOUR_PASSWORD with your actual database password");
  console.log("- If you see 'Not IPv4 compatible' warning, you may need to use Session Pooler");
  console.log("- Session Pooler connection string format:");
  console.log("  postgresql://postgres:YOUR_PASSWORD@db.dwxbohwllsmfkpaxcsaz.supabase.co:6543/postgres");
  console.log("  (Note: port 6543 instead of 5432)\n");
}

