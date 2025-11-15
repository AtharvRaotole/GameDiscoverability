# Import More Games

You currently have **4 games** in your database. To import more games:

## Quick Import (Popular Games)

Run this script to import 20+ popular indie and emotional games:

```bash
cd backend
npm run import-popular-games
```

Or manually import specific games:

```bash
cd backend
npm run import-games 753640 504230 367520 413150 683320
```

## Popular Game IDs

Here are some popular emotional/indie games you can import:

- **753640** - Outer Wilds (highly emotional, space exploration)
- **504230** - Celeste (emotional platformer)
- **367520** - Hollow Knight (atmospheric metroidvania)
- **413150** - Stardew Valley (cozy farming sim)
- **683320** - Gris (beautiful emotional journey)
- **638230** - Journey (emotional multiplayer experience)
- **384380** - Abzû (underwater exploration)
- **221910** - The Stanley Parable (narrative experience)
- **480** - Limbo (atmospheric puzzle platformer)
- **304430** - Inside (emotional puzzle platformer)
- **257850** - The Talos Principle (philosophical puzzle)
- **383870** - Firewatch (narrative adventure)

## Import Many Games at Once

```bash
cd backend
npm run import-games 753640 504230 367520 413150 683320 638230 384380 221910 480 304430 257850 383870
```

## Check Game Count

After importing, check how many games you have:

```sql
SELECT COUNT(*) FROM games;
```

Or run:
```bash
cd backend
node -e "const { Pool } = require('pg'); require('dotenv').config(); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT COUNT(*) as count FROM games').then(r => { console.log('Total games:', r.rows[0].count); pool.end(); });"
```

## Note

- Each game import takes a few seconds (fetches from Steam, analyzes emotions, generates embeddings, calculates soul score)
- Games are automatically indexed in Pinecone for vector search
- Duplicate imports will update existing games

