# GameSoul: Emotion-Based Game Discovery Platform
## Complete Production-Level Specification for Cursor

---

## 🎯 UNIQUE CONCEPT (Stand Out Factor)

**GameSoul** discovers games through **emotional fingerprinting** - not tags, not genres, but the actual *feelings* games evoke. Users don't search by "roguelike" or "metroidvania" - they search by "games that make me feel the way Outer Wilds made me feel" or describe their current emotional state.

### Core Differentiators:
1. **Emotion-First Discovery**: ML model analyzing game reviews, descriptions, and community sentiment to create emotional profiles
2. **Vibe Matching**: Users describe feelings/moods, AI matches to games with similar emotional signatures
3. **Memory Lane**: Users describe a gaming memory or feeling, system finds similar experiences
4. **Soul Score**: Proprietary metric measuring a game's emotional depth vs commercial appeal
5. **Emotional Journey Paths**: Curated sequences of games that take you on emotional arcs (melancholy → hope, tension → catharsis)

---

## 🏗️ TECHNICAL STACK

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Animations**: Framer Motion
- **API Client**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Vector DB**: Pinecone (for emotion embeddings)
- **Caching**: Redis
- **API**: RESTful + TasteRay API integration

### AI/ML
- **Embeddings**: OpenAI text-embedding-3-large
- **LLM**: GPT-4 Turbo for natural language processing
- **Sentiment Analysis**: Custom fine-tuned model on game reviews
- **Vector Search**: Pinecone for similarity matching

### DevOps
- **Hosting**: Vercel (frontend) + Railway (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Analytics**: Posthog

---

## 🎨 UI/UX DESIGN PHILOSOPHY

### Visual Style (Claude-Inspired Minimalism)
```
Color Palette:
- Primary: #2D2D2D (Deep Charcoal)
- Secondary: #F5F5F5 (Soft White)
- Accent: #6366F1 (Indigo - for emotional highlights)
- Success: #10B981 (Emerald)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Rose)

Typography:
- Headings: Inter (500-700 weight)
- Body: Inter (400 weight)
- Monospace: JetBrains Mono (for game IDs/metadata)

Spacing System:
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

Border Radius:
- Small: 6px
- Medium: 12px
- Large: 16px
- XL: 24px
```

### Component Design Principles
1. **Generous Whitespace**: Minimum 24px between major sections
2. **Subtle Interactions**: Hover states with 150ms transitions
3. **Micro-animations**: Scale(1.02) on hover, smooth opacity changes
4. **Focus States**: Clear 2px indigo ring on keyboard navigation
5. **Loading States**: Skeleton screens, never spinners
6. **Empty States**: Thoughtful illustrations with helpful CTAs
7. **Error Handling**: Inline, contextual, never modal unless critical

---

## 📁 PROJECT STRUCTURE

```
gamesoul/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (main)/
│   │   │   │   ├── discover/
│   │   │   │   ├── explore/
│   │   │   │   ├── library/
│   │   │   │   └── journeys/
│   │   │   ├── api/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/ (shadcn components)
│   │   │   ├── discovery/
│   │   │   │   ├── EmotionInput.tsx
│   │   │   │   ├── VibeSelector.tsx
│   │   │   │   ├── GameCard.tsx
│   │   │   │   └── EmotionalProfile.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── utils.ts
│   │   │   ├── constants.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── discovery.controller.ts
│   │   │   ├── game.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── services/
│   │   │   ├── emotion-analysis.service.ts
│   │   │   ├── tasteray.service.ts
│   │   │   ├── embedding.service.ts
│   │   │   └── recommendation.service.ts
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── shared/
    └── types/
        └── index.ts
```

---

## 🔧 DETAILED FEATURE SPECIFICATIONS

### 1. Emotion Input Interface

**Component**: `EmotionInput.tsx`

```typescript
Features:
- Natural language textarea (min 20 chars, max 500 chars)
- Real-time emotion detection as user types
- Visual emotion tags appearing below input
- Suggested prompts: "I want to feel...", "Looking for games that make me...", "Recommend something..."
- Auto-save drafts to localStorage
- Character count with color indicator (green → amber → red)

User Flow:
1. User lands on discover page
2. Large, centered input appears with subtle animation
3. Placeholder text cycles through examples
4. As user types, AI extracts emotional keywords
5. Tags appear as chips below input (e.g., "melancholic", "hopeful", "tense")
6. User can click tags to refine or remove
7. "Discover" button pulses when input is valid
8. On submit, smooth transition to results
```

### 2. Game Card Design

**Component**: `GameCard.tsx`

```typescript
Layout:
┌─────────────────────────────┐
│     [Game Cover Image]      │
│         (16:9 ratio)        │
├─────────────────────────────┤
│ Game Title                  │
│ ⭐ Soul Score: 87/100       │
│                             │
│ 🎭 Emotions:                │
│ [melancholic] [beautiful]   │
│ [contemplative]             │
│                             │
│ 💭 "A meditation on..."     │
│    (AI-generated summary)   │
│                             │
│ 🕐 ~6 hours | 👥 Solo      │
│ 💰 $19.99 | 📅 2023        │
└─────────────────────────────┘

Interactions:
- Hover: Lift effect (translateY: -4px, shadow expansion)
- Click: Expands to detailed modal
- Heart icon (top-right): Add to wishlist
- Quick actions: View on Steam, Add to Library
- Emotion match percentage shown on hover
```

### 3. Emotional Profile Visualization

**Component**: `EmotionalProfile.tsx`

```typescript
Visual: Radar/Spider chart showing 8 emotion axes
- Joy
- Melancholy  
- Tension
- Wonder
- Nostalgia
- Catharsis
- Comfort
- Challenge

Each game gets plotted on this chart
User can see their own emotional preferences vs game profile
Overlap area indicates match quality
```

### 4. Journey Paths

**Feature**: Curated emotional arc sequences

```typescript
Example Journeys:
1. "From Darkness to Light"
   - Limbo → Inside → Gris → Journey → Abzu
   
2. "The Cozy Escapist"
   - Stardew Valley → A Short Hike → Unpacking → Coffee Talk
   
3. "Existential Exploration"
   - Outer Wilds → Return of the Obra Dinn → Disco Elysium

UI: Horizontal scrollable timeline
- Each node is a game
- Lines connect showing emotional progression
- Color gradient shows emotional shift
- Estimated total time displayed
- Save/fork journey feature
```

### 5. Soul Score Algorithm

```typescript
Soul Score Calculation:
1. Community Depth (30%): Review sentiment depth, not quantity
2. Artistic Intent (25%): Deviation from genre conventions
3. Emotional Range (20%): Breadth of emotions evoked
4. Player Impact (15%): Life-changing experience mentions
5. Indie Bonus (10%): Smaller team/budget weighted positively

Formula:
SoulScore = (
  CommunityDepth * 0.3 +
  ArtisticIntent * 0.25 +
  EmotionalRange * 0.2 +
  PlayerImpact * 0.15 +
  IndieBonus * 0.1
) * 100

Display:
- 90-100: "Transcendent" (gold)
- 75-89: "Profound" (purple)
- 60-74: "Moving" (blue)
- 45-59: "Engaging" (green)
- 0-44: "Standard" (gray)
```

---

## 🔌 API INTEGRATION

### TasteRay API Integration

```typescript
// services/tasteray.service.ts

interface TasteRayGame {
  id: string;
  name: string;
  description: string;
  genres: string[];
  tags: string[];
  releaseDate: string;
  price: number;
  steamUrl: string;
  images: {
    header: string;
    capsule: string;
  };
}

class TasteRayService {
  private baseUrl = process.env.TASTERAY_API_URL;
  private apiKey = process.env.TASTERAY_API_KEY;

  async searchGames(query: string): Promise<TasteRayGame[]> {
    // Implement TasteRay API call
  }

  async getGameDetails(gameId: string): Promise<TasteRayGame> {
    // Fetch detailed game info
  }

  async getReviews(gameId: string): Promise<Review[]> {
    // Fetch game reviews for emotion analysis
  }
}
```

### Emotion Analysis Pipeline

```typescript
// services/emotion-analysis.service.ts

class EmotionAnalysisService {
  async analyzeUserInput(text: string): Promise<EmotionVector> {
    // 1. Generate embedding using OpenAI
    const embedding = await this.generateEmbedding(text);
    
    // 2. Extract explicit emotions using GPT-4
    const emotions = await this.extractEmotions(text);
    
    // 3. Combine into emotion vector
    return this.createEmotionVector(embedding, emotions);
  }

  async analyzeGameEmotions(game: TasteRayGame): Promise<EmotionVector> {
    // 1. Fetch and analyze reviews
    const reviews = await this.tasterayService.getReviews(game.id);
    
    // 2. Sentiment analysis on aggregated reviews
    const sentiment = await this.analyzeSentiment(reviews);
    
    // 3. Extract emotional keywords from description
    const descEmotions = await this.extractEmotions(game.description);
    
    // 4. Combine into game emotion profile
    return this.createEmotionVector(sentiment, descEmotions);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });
    return response.data[0].embedding;
  }
}
```

### Vector Search with Pinecone

```typescript
// services/recommendation.service.ts

class RecommendationService {
  private pinecone: Pinecone;

  async findSimilarGames(
    emotionVector: EmotionVector,
    limit: number = 20
  ): Promise<GameMatch[]> {
    // 1. Query Pinecone with user's emotion embedding
    const results = await this.pinecone.index('game-emotions').query({
      vector: emotionVector.embedding,
      topK: limit,
      includeMetadata: true,
    });

    // 2. Fetch full game details from DB
    const games = await this.fetchGamesById(
      results.matches.map(m => m.id)
    );

    // 3. Calculate soul score and emotion match
    return games.map((game, idx) => ({
      game,
      matchScore: results.matches[idx].score,
      soulScore: this.calculateSoulScore(game),
      emotionAlignment: this.calculateAlignment(
        emotionVector,
        game.emotionVector
      ),
    }));
  }
}
```

---

## 🗄️ DATABASE SCHEMA

```sql
-- PostgreSQL Schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY, -- Steam App ID
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  header_image TEXT,
  capsule_image TEXT,
  release_date DATE,
  price DECIMAL(10,2),
  steam_url TEXT,
  soul_score INTEGER CHECK (soul_score >= 0 AND soul_score <= 100),
  emotion_vector VECTOR(3072), -- OpenAI embedding dimension
  emotion_profile JSONB, -- {joy: 0.8, melancholy: 0.6, ...}
  genres TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) REFERENCES games(id) ON DELETE CASCADE,
  status VARCHAR(20), -- 'playing', 'completed', 'wishlist'
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

CREATE TABLE emotional_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  emotion_vector VECTOR(3072),
  extracted_emotions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  game_sequence JSONB, -- [{gameId, order, emotionState}]
  emotional_arc JSONB, -- [{emotion, intensity, position}]
  created_by UUID REFERENCES users(id),
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_games_soul_score ON games(soul_score DESC);
CREATE INDEX idx_games_emotion_vector ON games USING ivfflat (emotion_vector vector_cosine_ops);
CREATE INDEX idx_emotional_searches_user ON emotional_searches(user_id, created_at DESC);
CREATE INDEX idx_user_libraries_user ON user_libraries(user_id, status);
```

---

## 🎯 PAGE SPECIFICATIONS

### 1. Home/Discover Page (`/`)

```typescript
Layout:
┌─────────────────────────────────────────────┐
│              [Logo: GameSoul]               │
│                                             │
│         Discover games through emotion      │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │ "I want to feel..."                │   │
│  │ [Large textarea input]             │   │
│  │                                    │   │
│  └────────────────────────────────────┘   │
│                                             │
│  [melancholic] [hopeful] [nostalgic]      │
│                                             │
│         [Discover Games →]                 │
│                                             │
│  ────────── or ──────────                  │
│                                             │
│  [Explore Journeys] [Browse by Vibe]      │
│                                             │
│  Featured Soul Games:                      │
│  [Card] [Card] [Card] [Card]              │
└─────────────────────────────────────────────┘

Key Features:
- Hero section with large emotion input
- Real-time emotion tag extraction
- Quick action buttons
- Featured high-soul-score games carousel
- Subtle particle animation background
```

### 2. Discovery Results Page (`/discover`)

```typescript
Layout:
┌─────────────────────────────────────────────┐
│ [Back] Your Emotional Match               │
│                                             │
│ Based on: "I want to feel the same way...│
│ [Edit Search]                              │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │   Your Emotion Profile              │   │
│ │   [Radar Chart Visualization]       │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ 24 Games Found                             │
│ [Filter: Soul Score] [Sort: Match]        │
│                                             │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐                  │
│ │ G │ │ G │ │ G │ │ G │  [GameCards]     │
│ └───┘ └───┘ └───┘ └───┘                  │
│ [... more cards in grid ...]              │
│                                             │
│ [Load More]                                │
└─────────────────────────────────────────────┘

Features:
- Sticky header with search query
- Emotion profile visualization at top
- Grid of game cards (3-4 columns responsive)
- Match percentage on each card
- Infinite scroll/load more
- Filter sidebar (collapsible on mobile)
```

### 3. Game Detail Modal/Page

```typescript
Layout:
┌─────────────────────────────────────────────┐
│                    [×]                      │
│  ┌────────────────────────────────────┐   │
│  │     [Large Game Banner Image]      │   │
│  └────────────────────────────────────┘   │
│                                             │
│  Game Title                    [♡ Wishlist]│
│  ⭐ Soul Score: 87/100  |  95% Match       │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Emotional Profile                  │  │
│  │  [Radar Chart]                      │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  "A meditation on loss and hope..."        │
│  [Full AI-generated emotional description] │
│                                             │
│  🎭 Core Emotions:                         │
│  [melancholic] [beautiful] [contemplative] │
│                                             │
│  📖 Description:                           │
│  [Game description from Steam]             │
│                                             │
│  💰 $19.99  |  🕐 ~6 hours  |  👥 Solo    │
│  📅 Released: 2023                         │
│                                             │
│  [View on Steam →]  [Add to Library]      │
│                                             │
│  Similar Emotional Experiences:            │
│  [Card] [Card] [Card]                     │
└─────────────────────────────────────────────┘
```

### 4. Journeys Page (`/journeys`)

```typescript
Layout:
┌─────────────────────────────────────────────┐
│              Emotional Journeys             │
│  Curated sequences that take you places    │
│                                             │
│  [Curated] [Community] [My Journeys]      │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ From Darkness to Light              │  │
│  │ ●────●────●────●────●  (~20 hours) │  │
│  │ [Img][Img][Img][Img][Img]          │  │
│  │ A journey from despair to hope      │  │
│  │ [Start Journey →]                   │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  [More journey cards...]                   │
└─────────────────────────────────────────────┘

Features:
- Tab navigation for journey types
- Journey cards with game sequence preview
- Emotional arc visualization
- Total time estimate
- Progress tracking for started journeys
- Fork/customize feature
```

### 5. Library Page (`/library`)

```typescript
Layout:
┌─────────────────────────────────────────────┐
│              Your Game Library              │
│                                             │
│  [Playing] [Completed] [Wishlist] [All]   │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │   Your Emotional Journey            │  │
│  │   [Timeline visualization showing   │  │
│  │    emotional arc of games played]   │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Currently Playing (3)                     │
│  [Game Cards with progress indicators]     │
│                                             │
│  Completed (12)                            │
│  [Game Cards with completion date]         │
│                                             │
│  Wishlist (8)                              │
│  [Game Cards with quick actions]           │
└─────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Core Infrastructure (Days 1-2)
- [ ] Initialize Next.js + TypeScript project
- [ ] Set up Tailwind + shadcn/ui
- [ ] Configure Supabase database
- [ ] Set up Pinecone vector database
- [ ] Implement TasteRay API client
- [ ] Create base layout components (Header, Sidebar, Footer)
- [ ] Set up authentication (Supabase Auth)

### Phase 2: Emotion Engine (Days 3-4)
- [ ] Implement OpenAI embedding service
- [ ] Build emotion extraction pipeline
- [ ] Create emotion vector storage system
- [ ] Develop game emotion analysis batch processor
- [ ] Build recommendation engine with vector search
- [ ] Implement Soul Score calculation algorithm

### Phase 3: Discovery Interface (Days 5-6)
- [ ] Build EmotionInput component with real-time analysis
- [ ] Create GameCard component with all interactions
- [ ] Implement discovery results page with filters
- [ ] Build emotional profile visualization (radar chart)
- [ ] Create game detail modal/page
- [ ] Implement infinite scroll for results

### Phase 4: Journeys Feature (Day 7)
- [ ] Create journey data model
- [ ] Build journey cards and timeline UI
- [ ] Implement curated journey system
- [ ] Add journey progress tracking
- [ ] Create journey fork/customize feature

### Phase 5: Library & User Features (Day 8)
- [ ] Build user library with status tracking
- [ ] Implement wishlist functionality
- [ ] Create emotional timeline visualization
- [ ] Add user preferences/settings
- [ ] Build search history feature

### Phase 6: Polish & Optimization (Days 9-10)
- [ ] Implement loading states and skeletons
- [ ] Add error boundaries and error handling
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Add animations and micro-interactions
- [ ] Implement responsive design for all screens
- [ ] Add keyboard navigation
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Final UI polish and consistency check

### Phase 7: Testing & Deployment (Day 11)
- [ ] Unit testing critical paths
- [ ] Integration testing API flows
- [ ] User acceptance testing
- [ ] Performance testing and optimization
- [ ] Deploy to Vercel (frontend) + Railway (backend)
- [ ] Set up monitoring and error tracking
- [ ] Create documentation

---

## 🛠️ CURSOR IMPLEMENTATION PROMPTS

### Prompt 1: Project Initialization

```
Create a Next.js 14 production-ready project with the following exact specifications:

REQUIREMENTS:
- Next.js 14 with App Router and TypeScript (strict mode)
- Tailwind CSS with custom config for Claude-inspired minimalist design
- Install and configure shadcn/ui components
- Set up Zustand for state management
- Configure TanStack Query for API calls
- Install Framer Motion for animations
- Set up ESLint and Prettier with strict rules

FOLDER STRUCTURE:
Create this exact structure:
/src
  /app
    /(auth)
      /login
      /signup
    /(main)
      /discover
      /explore
      /library
      /journeys
    /api
    layout.tsx
    page.tsx
  /components
    /ui (shadcn components)
    /discovery
    /layout
    /shared
  /lib
  /hooks
  /stores
  /styles

TAILWIND CONFIG:
Use this exact color scheme:
- Primary: #2D2D2D
- Secondary: #F5F5F5  
- Accent: #6366F1
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

Font: Inter for everything
Spacing: 4px base unit
Border radius: 6px (sm), 12px (md), 16px (lg), 24px (xl)

NEXT CONFIG:
- Enable image optimization
- Set up environment variables structure
- Configure API routes properly

Create all files with proper TypeScript types. Include detailed comments explaining each configuration choice.
```

### Prompt 2: Database & Backend Setup

```
Set up the complete backend infrastructure for GameSoul:

DATABASE (PostgreSQL with Supabase):
Create these exact tables with this schema:

1. users table:
   - id (UUID, primary key)
   - email (VARCHAR, unique, not null)
   - username (VARCHAR, unique, not null)
   - created_at, updated_at (TIMESTAMP)

2. games table:
   - id (VARCHAR - Steam App ID, primary key)
   - name, description, short_description (TEXT fields)
   - header_image, capsule_image (TEXT - URLs)
   - release_date (DATE)
   - price (DECIMAL)
   - steam_url (TEXT)
   - soul_score (INTEGER 0-100)
   - emotion_vector (VECTOR(3072) for OpenAI embeddings)
   - emotion_profile (JSONB with emotion keys/values)
   - genres, tags (TEXT arrays)
   - created_at, updated_at

3. user_libraries table:
   - id, user_id (FK to users), game_id (FK to games)
   - status (ENUM: 'playing', 'completed', 'wishlist')
   - added_at timestamp
   - UNIQUE constraint on (user_id, game_id)

4. emotional_searches table:
   - id, user_id, query_text
   - emotion_vector (VECTOR)
   - extracted_emotions (JSONB)
   - created_at

5. journeys table:
   - id, title, description
   - game_sequence (JSONB array)
   - emotional_arc (JSONB)
   - created_by (FK to users)
   - is_curated (BOOLEAN)

Create all necessary indexes for performance, especially vector indexes.

BACKEND API (Express + TypeScript):
Create /backend folder with:
- src/controllers/ (discovery, game, user)
- src/services/ (emotion-analysis, tasteray, embedding, recommendation)
- src/models/
- src/routes/
- src/middleware/ (auth, error handling, validation)
- src/config/

Implement proper error handling, request validation with Zod, and JWT authentication.
Include detailed JSDoc comments for all functions.
```

### Prompt 3: TasteRay API Integration

```
Create a complete TasteRay API integration service:

FILE: /backend/src/services/tasteray.service.ts

Implement TasteRayService class with these methods:

1. searchGames(query: string, filters?: GameFilters): Promise<TasteRayGame[]>
   - Search games by text query
   - Support genre, tag, price range filters
   - Handle pagination
   - Implement error handling and retry logic

2. getGameDetails(gameId: string): Promise<TasteRayGame>
   - Fetch complete game information
   - Include all metadata (description, images, price, etc.)
   - Cache results for 24 hours

3. getReviews(gameId: string, limit?: number): Promise<Review[]>
   - Fetch user reviews for emotion analysis
   - Parse and structure review data
   - Handle missing/incomplete reviews

4. getSimilarGames(gameId: string, limit?: number): Promise<TasteRayGame[]>
   - Get games similar to a given game
   - Use for "Similar Emotional Experiences" feature

TYPES:
Define complete TypeScript interfaces for:
- TasteRayGame (all game properties)
- Review (reviewer, text, sentiment, date)
- GameFilters (genres, tags, priceRange, releaseYear)

CONFIGURATION:
- Use environment variables for API key/URL
- Implement rate limiting (respect API limits)
- Add request/response logging
- Implement caching layer with Redis

ERROR HANDLING:
- Network errors → retry with exponential backoff
- 404 errors → return empty array or null
- Rate limit errors → queue requests
- All errors logged with context

Include comprehensive tests for all methods.
```

### Prompt 4: Emotion Analysis Engine

```
Build the core emotion analysis engine that powers game discovery:

FILE: /backend/src/services/emotion-analysis.service.ts

Create EmotionAnalysisService with these exact features:

1. analyzeUserInput(text: string): Promise<EmotionVector>
   Process user's emotional query:
   - Generate OpenAI text-embedding-3-large embedding (3072 dimensions)
   - Use GPT-4 to extract explicit emotions (joy, melancholy, tension, wonder, nostalgia, catharsis, comfort, challenge)
   - Return normalized emotion vector with scores 0-1 for each emotion
   - Cache embeddings to avoid duplicate API calls

2. analyzeGameEmotions(game: TasteRayGame): Promise<EmotionVector>
   Analyze game's emotional profile:
   - Fetch reviews using TasteRay API
   - Perform sentiment analysis on aggregated reviews
   - Extract emotional keywords from description using GPT-4
   - Weight recent reviews more heavily (exponential decay by date)
   - Combine review sentiment + description analysis
   - Store in games table emotion_vector and emotion_profile fields

3. extractEmotionalKeywords(text: string): Promise<EmotionTag[]>
   Real-time emotion tag extraction for UI:
   - Use GPT-4 with specific prompt to extract 3-7 emotion words
   - Return array of {word, intensity, category} objects
   - < 500ms response time requirement
   - Implement streaming for live updates as user types

4. calculateEmotionSimilarity(vector1: EmotionVector, vector2: EmotionVector): number
   Compare two emotion vectors:
   - Use cosine similarity for embedding comparison
   - Weight emotion profile overlap (joy, melancholy, etc.)
   - Return 0-100 match score
   - Penalize if core emotions mismatch even if embeddings similar

EMOTION CATEGORIES (8 core emotions):
Define exact scoring system:
- Joy: Uplifting, fun, delightful experiences
- Melancholy: Bittersweet, reflective, somber
- Tension: Stress, anxiety, high-stakes
- Wonder: Awe-inspiring, mysterious, magical
- Nostalgia: Memory-evoking, sentimental, familiar
- Catharsis: Emotional release, resolution, closure
- Comfort: Cozy, safe, relaxing, wholesome
- Challenge: Difficulty, mastery, achievement

GPT-4 PROMPTS:
Create precise prompts for:
- Emotion extraction from user input
- Game description emotional analysis
- Review sentiment analysis
- Emotional keyword generation

OPENAI INTEGRATION:
- Use openai package
- Implement retry logic (3 attempts)
- Handle rate limits gracefully
- Stream responses when possible for better UX
- Total error handling with fallbacks

PERFORMANCE:
- Batch process game emotions (100 games at a time)
- Cache all embeddings in database
- Use Redis for frequently accessed emotion vectors
- Optimize GPT-4 prompts to minimize tokens

Include unit tests for similarity calculations and emotion extraction.
```

### Prompt 5: Core UI Components

```
Create the foundational UI components following Claude's minimalist design:

COMPONENT 1: EmotionInput.tsx
Location: /src/components/discovery/EmotionInput.tsx

Requirements:
- Large textarea (min-height: 120px, grows up to 300px)
- Placeholder text that cycles through examples every 3 seconds:
  * "I want to feel the way Outer Wilds made me feel..."
  * "Looking for something melancholic but hopeful..."
  * "Games that capture the feeling of a rainy Sunday..."
  * "Something that makes me think about life..."
- Character counter (20-500 chars required)
- Real-time emotion tag extraction (debounce 800ms)
- Emotion tags appear as dismissible chips below input
- "Discover" button: disabled until 20+ chars, pulses when ready
- Smooth animations using Framer Motion
- Auto-save draft to localStorage every 2 seconds
- Restore draft on page load with "Continue previous search" option

Styling:
- Border: 1px solid #E5E5E5, focus: 2px solid #6366F1
- Padding: 16px
- Border radius: 12px
- Font: Inter 16px
- Transition: all 150ms ease
- Emotion tags: #F3F4F6 background, #6366F1 text, 6px radius

TypeScript: Full type safety, props interface, proper event handlers

COMPONENT 2: GameCard.tsx  
Location: /src/components/discovery/GameCard.tsx

Props interface:
```typescript
interface GameCardProps {
  game: {
    id: string;
    name: string;
    headerImage: string;
    soulScore: number;
    emotions: string[];
    price: number;
    releaseYear: number;
    estimatedHours: number;
    playerMode: 'Solo' | 'Co-op' | 'Multiplayer';
  };
  matchScore?: number;
  onWishlistAdd?: (gameId: string) => void;
  onViewDetails?: (gameId: string) => void;
}
```

Design:
- Card size: 320px width, auto height
- Image aspect ratio: 16:9 with object-fit: cover
- Hover effect: translateY(-4px), shadow-lg, transition 200ms
- Soul score badge: top-left, gradient based on score tier
- Heart icon: top-right, animated on click
- Emotion tags: max 3 visible, "+2 more" if exceeds
- AI summary: 2 line max with ellipsis
- Bottom metadata: icons + text, muted color

Interactions:
- Click card → open detail modal
- Click heart → add to wishlist with animation
- Hover emotion tag → tooltip with description
- Lazy load images with blur-up placeholder

Accessibility:
- Keyboard navigable
- ARIA labels on all interactive elements
- Focus visible with 2px ring

COMPONENT 3: EmotionalProfile.tsx
Location: /src/components/discovery/EmotionalProfile.tsx

Radar chart showing 8 emotion dimensions:
- Use recharts library
- 8 axes in circular layout
- User's emotion in blue (#6366F1)
- Game's emotion in purple (#8B5CF6)  
- Overlap area highlighted
- Interactive: hover shows exact values
- Legend explaining colors
- Responsive: scales down on mobile
- Smooth animations on data changes

Chart config:
- Size: 400x400px desktop, 300x300px mobile
- Grid circles: 5 levels (0, 25, 50, 75, 100)
- Axis labels outside chart
- Values displayed as percentages

COMPONENT 4: Header.tsx
Location: /src/components/layout/Header.tsx

Features:
- Logo: "GameSoul" with custom icon (game controller + heart)
- Nav links: Discover | Explore | Journeys | Library
- Search bar (compact, expands on click)
- User avatar dropdown (top-right)
- Sticky positioning on scroll
- Background blur when scrolling
- Smooth transitions between states

Styling:
- Height: 64px
- Padding: 0 32px
- Background: rgba(255, 255, 255, 0.8) with backdrop-blur
- Border bottom: 1px solid rgba(0, 0, 0, 0.1)
- Logo: 24px height
- Nav items: 14px font, 500 weight, hover underline animation

Mobile:
- Hamburger menu for nav links
- Slide-in drawer animation
- Preserve all functionality

COMPONENT 5: GameDetailModal.tsx
Location: /src/components/discovery/GameDetailModal.tsx

Full-screen modal with:
- Backdrop blur + click outside to close
- Close button (top-right)
- Large banner image at top
- Scrollable content area
- Emotional profile chart
- AI-generated emotional description
- Full game description
- Metadata grid (price, hours, mode, release date)
- Action buttons: "View on Steam", "Add to Library", "Add to Wishlist"
- "Similar Emotional Experiences" carousel at bottom

Animations:
- Modal slides up from bottom (mobile) or scales in (desktop)
- Content fades in sequentially
- Exit animation in reverse

Accessibility:
- Trap focus within modal
- ESC key to close
- Focus management (returns to trigger)
- Proper ARIA attributes

All components must:
- Use TypeScript with strict types
- Include error boundaries
- Have loading states with skeletons
- Be fully responsive
- Support dark mode (future-proof)
- Include JSDoc comments
- Follow accessibility best practices
- Have consistent spacing (multiples of 4px)
```

### Prompt 6: Recommendation Engine

```
Build the core recommendation engine using vector search:

FILE: /backend/src/services/recommendation.service.ts

Setup:
- Initialize Pinecone client with API key
- Create index: 'game-emotions' with dimension 3072 (OpenAI embedding size)
- Use cosine similarity metric
- Configure metadata filters

Core Methods:

1. findSimilarGames(emotionVector: EmotionVector, options: SearchOptions): Promise<GameMatch[]>
   
   Options interface:
   ```typescript
   interface SearchOptions {
     limit?: number; // default 20
     minSoulScore?: number; // filter by minimum soul score
     genres?: string[]; // filter by genres
     priceRange?: { min: number; max: number };
     excludeGameIds?: string[]; // exclude already owned/played
     boostIndie?: boolean; // boost indie games in results
   }
   ```

   Algorithm:
   - Query Pinecone with emotion embedding
   - Apply metadata filters (soul score, genres, price)
   - Fetch top K+50 results (to account for filters)
   - Retrieve full game data from PostgreSQL
   - Calculate comprehensive match scores:
     * Embedding similarity (40%)
     * Emotion profile overlap (30%)
     * Soul score alignment (20%)
     * Indie boost if enabled (10%)
   - Re-rank results by final score
   - Return top N games with match details

2. indexGameEmotion(game: Game): Promise<void>
   - Convert game emotion data to Pinecone vector
   - Include metadata: soul_score, genres, price, release_date
   - Upsert to Pinecone index
   - Handle errors gracefully (retry 3x)

3. batchIndexGames(games: Game[]): Promise<BatchResult>
   - Process games in chunks of 100
   - Parallel processing with promise.all
   - Progress tracking and logging
   - Error aggregation and reporting
   - Return success/failure counts

4. findEmotionalJourney(startEmotion: EmotionVector, targetEmotion: EmotionVector, steps: number): Promise<Game[]>
   - Create interpolated emotion vectors between start and target
   - Query each interpolation point
   - Ensure smooth emotional progression
   - Avoid duplicates in sequence
   - Return ordered array of games forming a journey

5. getSimilarToGame(gameId: string, limit: number): Promise<Game[]>
   - Fetch game's emotion vector from DB
   - Use as query to find similar games
   - Exclude the source game
   - Return ranked results

SOUL SCORE CALCULATION:
Implement detailed algorithm:
```typescript
function calculateSoulScore(game: Game): number {
  // 1. Community Depth (30%): Analyze review sentiment depth
  const reviewDepth = analyzeReviewDepth(game.reviews);
  
  // 2. Artistic Intent (25%): Deviation from genre norms
  const artisticIntent = measureArtisticIntent(game);
  
  // 3. Emotional Range (20%): Breadth of emotions
  const emotionalRange = calculateEmotionalRange(game.emotionProfile);
  
  // 4. Player Impact (15%): Life-changing mentions
  const playerImpact = analyzePlayerImpact(game.reviews);
  
  // 5. Indie Bonus (10%): Small team/budget boost
  const indieBonus = game.isIndie ? 0.1 : 0;
  
  return Math.round(
    (reviewDepth * 0.3 +
     artisticIntent * 0.25 +
     emotionalRange * 0.2 +
     playerImpact * 0.15) * 100 +
    indieBonus * 10
  );
}
```

CACHING STRATEGY:
- Cache popular emotion queries in Redis (TTL: 1 hour)
- Cache individual game vectors in memory (LRU cache, max 10000 entries)
- Precompute similar games for top 1000 games (update daily)

PERFORMANCE OPTIMIZATION:
- Implement connection pooling for Pinecone
- Use batch operations whenever possible
- Lazy load game images and metadata
- Implement request debouncing on frontend

ERROR HANDLING:
- Pinecone connection errors → fallback to SQL similarity search
- Missing embeddings → generate on-the-fly
- Timeout handling (max 5s per query)
- Comprehensive logging for debugging

METRICS & MONITORING:
- Track query latency
- Monitor cache hit rates
- Log recommendation quality feedback
- A/B test different scoring weights

Include integration tests with mock Pinecone client.
```

### Prompt 7: Discovery Page Implementation

```
Build the complete discovery/results page:

PAGE: /src/app/(main)/discover/page.tsx

Layout structure:
```tsx
<div className="min-h-screen bg-[#F5F5F5]">
  <SearchHeader /> {/* Sticky header with search query */}
  <div className="container mx-auto px-6 py-8">
    <EmotionalProfileSection /> {/* User's emotion visualization */}
    <ResultsSection /> {/* Grid of game cards */}
  </div>
</div>
```

SearchHeader Component:
- Display user's original query
- "Edit" button → reopens emotion input with current text
- Match count: "24 games found matching your emotions"
- Filter/sort dropdowns
- Sticky positioning with backdrop blur on scroll

EmotionalProfileSection:
- Card with white background, rounded corners
- Heading: "Your Emotional Profile"
- Radar chart showing user's extracted emotions
- Brief explanation text
- Collapsible on mobile to save space

ResultsSection:
- Responsive grid: 4 cols desktop, 3 tablet, 2 mobile
- Gap: 24px between cards
- Each GameCard includes match percentage badge
- Skeleton loading states (show 12 skeletons initially)
- Infinite scroll implementation:
  * Load 20 games initially
  * When user scrolls to 80% of page, load next 20
  * Show loading indicator at bottom
  * Handle end of results gracefully

Filter Sidebar (Desktop) / Bottom Sheet (Mobile):
Filters:
- Soul Score range (slider 0-100)
- Price range (slider $0-$60)
- Genres (multi-select checkboxes)
- Release year range
- Player mode (Solo/Co-op/Multiplayer)
- Game length (<5h, 5-15h, 15-30h, 30h+)

Sort options:
- Best Match (default)
- Highest Soul Score
- Most Recent
- Price: Low to High
- Price: High to Low

State Management (Zustand):
```typescript
interface DiscoveryStore {
  query: string;
  emotionVector: EmotionVector;
  results: GameMatch[];
  filters: FilterState;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  
  setQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  loadMore: () => Promise<void>;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}
```

API Integration:
- POST /api/discover with emotion text
- Response includes emotion vector + initial results
- GET /api/discover/results?offset=20&limit=20 for pagination
- All requests include current filters as query params
- Optimistic UI updates
- Error handling with retry mechanism

Empty States:
- No results found: 
  * Friendly message: "We couldn't find games matching that emotion"
  * Suggestions: "Try describing the feeling differently" 
  * Button to clear filters
  * Show 3-5 "Popular Soul Games" as fallback

Error States:
- Network error: Retry button with error message
- API error: Friendly explanation + support link
- Timeout: "This is taking longer than expected" with cancel option

Animations:
- Results fade in sequentially (stagger 50ms)
- Filter sidebar slides from left
- Smooth scroll to top when applying new filters
- Skeleton to content crossfade

Performance:
- Virtualize list if > 100 games
- Lazy load images with IntersectionObserver
- Debounce filter changes (500ms)
- Memoize expensive calculations
- Code split filter components

Accessibility:
- Keyboard navigation through results
- Announce result count to screen readers
- Focus management when filters applied
- Clear focus indicators
- Semantic HTML structure

SEO:
- Dynamic meta tags based on search query
- Structured data for games
- Proper heading hierarchy
- Descriptive alt text for images
```

### Prompt 8: Journey System

```
Implement the emotional journey feature:

DATABASE ADDITIONS:
Already defined in schema, implement business logic.

BACKEND: /backend/src/services/journey.service.ts

Methods:

1. createJourney(data: JourneyCreationData): Promise<Journey>
   ```typescript
   interface JourneyCreationData {
     title: string;
     description: string;
     gameIds: string[]; // ordered array
     userId: string;
     isCurated?: boolean;
   }
   ```
   - Validate all game IDs exist
   - Calculate emotional arc from game sequences
   - Estimate total playtime
   - Store in database
   - Return complete journey object

2. getEmotionalArc(gameIds: string[]): Promise<EmotionalArc>
   - Fetch emotion profiles for all games
   - Plot progression through 8 emotion dimensions
   - Identify peaks, valleys, transitions
   - Return visualization data structure

3. getCuratedJourneys(): Promise<Journey[]>
   - Fetch hand-curated journeys
   - Include game details for each
   - Sort by popularity/ratings
   - Return with preview images

4. getUserJourneys(userId: string): Promise<Journey[]>
   - Fetch user's created/saved journeys
   - Include progress tracking
   - Calculate completion percentage

5. forkJourney(journeyId: string, userId: string, modifications?: GameModification[]): Promise<Journey>
   - Clone existing journey
   - Apply optional modifications (swap games, reorder)
   - Create new journey owned by user

CURATED JOURNEYS (Seed Data):
Create these specific journeys:

1. "From Darkness to Light"
   Games: Limbo → Inside → Little Nightmares → Gris → Journey → Abzû
   Arc: Despair → Fear → Unease → Hope → Wonder → Peace
   Time: ~18 hours
   Description: "A transformative journey through shadow into luminescence"

2. "The Cozy Escapist"
   Games: Stardew Valley → A Short Hike → Unpacking → Coffee Talk → Spirit farer
   Arc: Stress → Calm → Nostalgia → Comfort → Bittersweet
   Time: ~60 hours
   Description: "Gentle games for when the world feels too loud"

3. "Existential Explorer"
   Games: The Stanley Parable → Outer Wilds → Return of the Obra Dinn → Disco Elysium
   Arc: Confusion → Wonder → Challenge → Catharsis
   Time: ~45 hours
   Description: "Games that make you question everything"

4. "Indie Masterclass"
   Games: Celeste → Hollow Knight → Hades → Tunic → Inscryption
   Arc: Challenge → Mastery → Flow → Mystery → Mind-blown
   Time: ~80 hours
   Description: "The cream of indie game design"

5. "Narrative Wonders"
   Games: What Remains of Edith Finch → Firewatch → The Beginner's Guide → To the Moon
   Arc: Curiosity → Tension → Introspection → Tears
   Time: ~12 hours
   Description: "Stories that stay with you forever"

FRONTEND: /src/app/(main)/journeys/page.tsx

Layout:
```tsx
<div className="min-h-screen bg-[#F5F5F5] py-12">
  <div className="container mx-auto px-6">
    <JourneyHeader />
    <JourneyTabs /> {/* Curated | Community | My Journeys */}
    <JourneyGrid />
  </div>
</div>
```

JourneyCard Component:
```tsx
interface JourneyCardProps {
  journey: {
    id: string;
    title: string;
    description: string;
    games: Game[];
    emotionalArc: EmotionalArc;
    totalHours: number;
    creator?: User;
    completionCount: number;
  };
}
```

Card design:
- White background, 16px rounded corners
- Title (24px, weight 600)
- Description (2 lines max, ellipsis)
- Horizontal game preview strip (5 game covers)
- Emotional arc mini-visualization (gradient line showing journey)
- Metadata: ⏱️ Total time | 👥 Completed by X players
- Hover: Lift effect, "Start Journey →" button appears
- Click: Navigate to journey detail page

Journey Detail Page: /journeys/[id]

Full journey visualization:
- Hero section with title and description
- Large emotional arc chart (line graph with 8 dimensions over time)
- Vertical timeline showing each game:
  ```
  1. [Game Cover] Game Title
     ⭐ Soul Score: 85
     🕐 ~6 hours
     🎭 Melancholic, Beautiful
     "Brief emotional description"
     [View Details] [Mark as Played]
     
  2. [Next game...]
  ```
- Progress tracker if user started journey
- Sidebar: 
  * Total stats
  * Emotional summary
  * "Start Journey" / "Continue" button
  * "Fork & Customize" option
  * Share buttons

Journey Progress Tracking:
- Store user progress in user_journey_progress table
- Update as games marked complete
- Show completion percentage
- Celebrate completion with animation
- Generate shareable "I completed X journey" card

Journey Customization Modal:
- Opened when "Fork & Customize" clicked
- Drag-and-drop to reorder games
- Search to add/replace games
- Preview updated emotional arc in real-time
- Save as new journey

Community Journeys:
- User-created journeys made public
- Upvote/downvote system
- Comment section
- Filter by emotion tags, length, popularity
- "Remix" button to fork

Analytics:
- Track journey completion rates
- Most popular journeys
- Average time to complete
- Drop-off points (which game people stop at)
```

### Prompt 9: Polish & Production Ready

```
Final production preparation and polish:

LOADING STATES:
Create skeleton components for:
1. GameCard skeleton: Gray placeholders with shimmer animation
2. EmotionalProfile skeleton: Circular placeholder for chart
3. Journey timeline skeleton: Vertical list of placeholders

Implementation:
- Use @keyframes for shimmer effect
- Match exact dimensions of real components
- Show 12 skeletons initially on discovery page
- Transition smoothly to real content (crossfade)

ERROR HANDLING:
Create ErrorBoundary component:
- Catch React errors
- Display friendly error message
- "Try again" button
- Log error to Sentry
- Show fallback UI, not crash

API error handling:
- Network errors → Toast notification with retry
- 404 → "Game not found" empty state
- 500 → "Something went wrong" with support link
- Timeout → Cancel ongoing request, show timeout message
- Rate limit → Queue requests, show "Please wait" message

ANIMATIONS & MICRO-INTERACTIONS:
Using Framer Motion:

1. Page transitions:
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: -20 }}
     transition={{ duration: 0.3 }}
   >
   ```

2. Card hover:
   ```tsx
   <motion.div
     whileHover={{ y: -4, scale: 1.02 }}
     transition={{ duration: 0.2 }}
   >
   ```

3. Button click:
   ```tsx
   <motion.button
     whileTap={{ scale: 0.95 }}
   >
   ```

4. Emotion tag appearance:
   - Stagger animation (50ms delay between tags)
   - Scale in from 0.8 to 1
   - Fade in opacity

5. Modal animations:
   - Backdrop fade in (200ms)
   - Content scale + fade in (300ms with spring)
   - Exit in reverse

RESPONSIVE DESIGN:
Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Mobile optimizations:
- Stack game cards (1 column)
- Collapse filters to bottom sheet
- Hamburger menu for navigation
- Larger touch targets (min 44x44px)
- Simplified emotional profile chart
- Horizontal scroll for journey game list

Tablet:
- 2-3 column grid for games
- Side drawer for filters
- Keep all functionality

Desktop:
- 4 column grid
- Side-by-side filter sidebar
- Hover states prominent

TEST ALL VIEWS IN:
- iPhone SE (375px)
- iPhone 14 Pro (393px)
- iPad (768px)
- Desktop (1920px)

ACCESSIBILITY AUDIT:
1. Keyboard navigation:
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modals
   - Arrow keys for carousel navigation

2. Screen reader support:
   - ARIA labels on all icons
   - ARIA-live regions for dynamic content
   - Proper heading hierarchy (h1 → h2 → h3)
   - Alt text for all images
   - Form labels associated with inputs

3. Focus management:
   - Visible focus indicators (2px ring, #6366F1)
   - Focus trap in modals
   - Return focus on close
   - Skip to content link

4. Color contrast:
   - All text meets WCAG AA (4.5:1)
   - Important elements meet AAA (7:1)
   - Don't rely solely on color for meaning

PERFORMANCE OPTIMIZATION:
1. Code splitting:
   - Lazy load route components
   - Dynamic imports for heavy components
   - Split vendor bundles

2. Image optimization:
   - Next.js Image component everywhere
   - WebP format with fallback
   - Responsive srcset
   - Lazy loading with blur placeholder
   - Proper sizing (no oversized images)

3. Bundle optimization:
   - Tree shaking enabled
   - Remove unused dependencies
   - Analyze bundle with @next/bundle-analyzer
   - Target < 200KB initial JS bundle

4. API optimization:
   - Implement request deduplication
   - Batch similar requests
   - Use SWR for caching
   - Prefetch on hover (Link prefetch)

5. Database optimization:
   - Index all foreign keys
   - Add indexes for common queries
   - Use connection pooling
   - Implement query caching

MONITORING & ANALYTICS:
1. Sentry setup:
   - Error tracking for frontend + backend
   - Performance monitoring
   - User feedback widget
   - Source maps for debugging

2. Posthog analytics:
   - Track key user flows
   - Conversion funnels
   - Heatmaps on key pages
   - Session recordings (privacy compliant)

3. Custom metrics:
   - API response times
   - Search result relevance (implicit feedback)
   - Journey completion rates
   - Feature usage statistics

ENVIRONMENT VARIABLES:
Create .env.example:
```
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# APIs
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
TASTERAY_API_KEY=...
TASTERAY_API_URL=https://...

# Auth
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# Monitoring
SENTRY_DSN=...
POSTHOG_KEY=...

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

DEPLOYMENT:
1. Frontend (Vercel):
   - Connect GitHub repo
   - Set environment variables
   - Configure custom domain
   - Enable automatic deployments
   - Preview deployments for PRs

2. Backend (Railway):
   - Deploy from GitHub
   - Provision PostgreSQL + Redis
   - Set environment variables
   - Configure health checks
   - Set up auto-scaling

3. Pinecone:
   - Create production index
   - Configure pod type (s1 or p1)
   - Set up monitoring alerts

4. Monitoring:
   - Configure Sentry alerts
   - Set up Uptime monitoring
   - Create status page

PRE-LAUNCH CHECKLIST:
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Lighthouse score > 90 (all categories)
- [ ] Tested on all target browsers
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] API rate limiting tested
- [ ] Error scenarios handled
- [ ] Loading states implemented
- [ ] Analytics tracking verified
- [ ] SEO meta tags added
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Security headers set
- [ ] CORS configured properly
- [ ] Environment variables documented
- [ ] Backup strategy defined
- [ ] Monitoring alerts configured
- [ ] Documentation complete
```

---

## 📊 SUCCESS METRICS

Track these KPIs:
1. **Discovery Success Rate**: % of searches returning satisfying results
2. **Emotion Match Accuracy**: User feedback on match quality
3. **Journey Completion**: % of started journeys completed
4. **Time to Discovery**: Average time from search to game found
5. **Soul Game Visibility**: Increase in indie game discoveries
6. **User Engagement**: Return rate, session duration
7. **API Performance**: Average response time < 1s

---

## 🎨 FINAL DESIGN TOUCHES

1. **Custom Cursor**: Game controller cursor on interactive elements
2. **Particle Background**: Subtle floating particles on hero section
3. **Smooth Scrolling**: Implement smooth scroll behavior globally
4. **Sound Effects**: Optional subtle UI sounds (toggle in settings)
5. **Easter Eggs**: Hidden games for specific emotional queries
6. **Sharing Cards**: Beautiful OG images for shared journeys/games
7. **Onboarding**: First-time user tutorial (skip-able)
8. **Keyboard Shortcuts**: Power user shortcuts (press ? to show)

---

This specification provides everything needed to build GameSoul from scratch. Start with Prompt 1 and work sequentially through Prompt 9. Each prompt is production-ready and includes all necessary details, types, and implementation guidance.