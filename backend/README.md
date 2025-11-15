# GameSoul Backend API

Backend API for emotion-based game discovery platform.

## 🚀 Phase 2: Emotion Engine - COMPLETE

### What's Been Implemented

✅ **Express + TypeScript** backend server
✅ **PostgreSQL** database schema with pgvector extension
✅ **OpenAI Integration** - Embedding service (text-embedding-3-large)
✅ **Emotion Analysis** - GPT-4 powered emotion extraction
✅ **Pinecone** vector database for similarity search
✅ **TasteRay API** service integration
✅ **Recommendation Engine** - Vector search + emotion matching
✅ **Soul Score Algorithm** - Emotional depth calculation

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts          # Environment validation
│   │   ├── database.ts     # PostgreSQL connection
│   │   ├── redis.ts        # Redis caching
│   │   └── schema.sql      # Database schema
│   ├── services/
│   │   ├── embedding.service.ts        # OpenAI embeddings
│   │   ├── emotion-analysis.service.ts # GPT-4 emotion extraction
│   │   ├── pinecone.service.ts          # Vector database
│   │   ├── tasteray.service.ts         # Game data API
│   │   ├── recommendation.service.ts   # Game matching
│   │   └── soul-score.service.ts       # Soul score calculation
│   ├── controllers/
│   │   └── discovery.controller.ts     # API handlers
│   ├── routes/
│   │   └── discovery.routes.ts         # Route definitions
│   └── index.ts                        # Server entry point
├── package.json
└── tsconfig.json
```

### API Endpoints

#### POST `/api/discover`
Discover games based on emotional query.

**Request:**
```json
{
  "query": "I want to feel the way Outer Wilds made me feel...",
  "limit": 20,
  "offset": 0,
  "filters": {
    "minSoulScore": 60,
    "genres": ["adventure", "indie"],
    "priceRange": { "min": 0, "max": 30 }
  }
}
```

**Response:**
```json
{
  "emotionVector": {
    "embedding": [0.123, ...],
    "emotions": {
      "joy": 0.3,
      "melancholy": 0.7,
      ...
    }
  },
  "results": [...],
  "total": 24,
  "hasMore": true
}
```

#### POST `/api/emotions/extract`
Extract emotional keywords from text (real-time).

**Request:**
```json
{
  "text": "Looking for something melancholic but hopeful..."
}
```

**Response:**
```json
[
  {
    "word": "melancholic",
    "intensity": 0.8,
    "category": "melancholy"
  },
  {
    "word": "hopeful",
    "intensity": 0.6,
    "category": "joy"
  }
]
```

#### GET `/health`
Health check endpoint.

### Environment Variables

Create a `.env` file with:

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gamesoul

# Redis (optional)
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=game-emotions

# TasteRay (optional)
TASTERAY_API_KEY=...
TASTERAY_API_URL=https://api.tasteray.com

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Database Setup

1. **Install PostgreSQL with pgvector extension:**
   ```bash
   # On macOS with Homebrew
   brew install postgresql
   brew install pgvector
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE gamesoul;
   ```

3. **Run schema:**
   ```bash
   psql -d gamesoul -f src/config/schema.sql
   ```

### Running the Server

**Development:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
npm start
```

**Type Check:**
```bash
npm run type-check
```

### Services Overview

#### 1. Embedding Service
- Generates 3072-dimensional embeddings using OpenAI
- Caches embeddings in Redis
- Supports batch processing

#### 2. Emotion Analysis Service
- Extracts 8 core emotions using GPT-4
- Real-time keyword extraction for UI
- Analyzes game emotions from reviews

#### 3. Pinecone Service
- Vector similarity search
- Metadata filtering (soul score, genres, price)
- Batch operations

#### 4. Recommendation Engine
- Combines vector similarity + emotion matching
- Weighted scoring algorithm
- Indie game boosting

#### 5. Soul Score Service
- Calculates emotional depth score (0-100)
- Factors: community depth, artistic intent, emotional range, player impact
- Indie bonus

### Next Steps

- [ ] Game controller and routes
- [ ] User authentication
- [ ] Library management
- [ ] Journey system
- [ ] Batch game processing
- [ ] Error monitoring (Sentry)
- [ ] Rate limiting
- [ ] API documentation (Swagger)

---

**Status**: Phase 2 Complete ✅
**Ready for**: Phase 3 - Discovery Interface Components

