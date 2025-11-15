<div align="center">

# 🎮 GameSoul

### Discover Games Through Emotion, Not Just Genres

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

**A revolutionary game discovery platform that matches games based on the emotions they evoke, powered by AI and vector embeddings.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

GameSoul is a cutting-edge game discovery platform that revolutionizes how players find their next favorite game. Instead of searching by genre, tags, or ratings, users describe **how they want to feel**, and our AI-powered system finds games with matching emotional profiles.

### The Problem We Solve

Traditional game discovery relies on metadata (genres, tags, ratings) which often fails to capture the emotional experience a game provides. Two games in the same genre can evoke completely different feelings. GameSoul bridges this gap by analyzing the emotional depth and player experiences to create meaningful matches.

### How It Works

1. **User Input**: Users describe their desired emotional experience in natural language
2. **AI Analysis**: GPT-4 extracts emotions and creates a 3072-dimensional emotion vector
3. **Vector Matching**: Pinecone finds games with similar emotional profiles using cosine similarity
4. **Soul Score**: Proprietary algorithm ranks games by emotional depth, review quality, and player engagement
5. **Personalized Results**: Results are ranked by emotional alignment and soul score

---

## ✨ Features

### 🎨 Core Features

- **🧠 Emotion-First Discovery**: Search games by describing feelings, not genres
- **🤖 AI-Powered Matching**: GPT-4 and vector embeddings for accurate emotional matching
- **⭐ Soul Score**: Proprietary metric (0-100) measuring emotional depth, review quality, and player engagement
- **📚 Emotional Journeys**: Curated sequences of games designed to create emotional arcs
- **📖 Personal Library**: Track your gaming journey with status (playing/completed/wishlist)
- **📊 Emotional Timeline**: Visualize your emotional journey through completed games
- **🔍 Search History**: Save and revisit your emotional searches
- **🎯 Guest Mode**: Explore without signing up

### 🎨 User Experience

- **Beautiful UI**: Minimalist, modern design inspired by Claude
- **Smooth Animations**: Framer Motion for delightful interactions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Real-time Feedback**: Live emotion extraction as you type

### 🔧 Technical Features

- **Type-Safe**: Full TypeScript coverage
- **Performance Optimized**: Redis caching, query optimization, lazy loading
- **Error Handling**: Graceful degradation when services are unavailable
- **Monitoring**: Sentry integration for error tracking
- **Analytics**: PostHog for user behavior insights

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 16.0.3 |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Tailwind CSS** | Utility-first CSS framework | 4.x |
| **Framer Motion** | Animation library | 12.x |
| **Zustand** | Lightweight state management | 5.x |
| **TanStack Query** | Data fetching and caching | 5.x |
| **shadcn/ui** | Component library | Latest |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript runtime | 20+ |
| **Express** | Web framework | 4.x |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **PostgreSQL** | Primary database | Latest |
| **pgvector** | Vector extension for PostgreSQL | Latest |
| **Pinecone** | Vector database for embeddings | 3.x |
| **Redis** | Caching layer | Latest |
| **OpenAI** | GPT-4 and embeddings | 4.x |

### Infrastructure & Tools

- **Supabase**: PostgreSQL hosting with pgvector
- **Railway**: Backend deployment
- **Vercel**: Frontend deployment
- **Sentry**: Error tracking
- **PostHog**: Analytics

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   Next.js App   │  (Frontend - Port 3000)
│   (React 19)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express API    │  (Backend - Port 3001)
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌─────────┐ ┌──────┐
│Postgres│ │Redis │ │Pinecone │ │OpenAI│
│(Supabase)│ │Cache │ │Vectors  │ │GPT-4 │
└────────┘ └──────┘ └─────────┘ └──────┘
```

### Data Flow

1. **User Query** → Frontend captures emotional description
2. **Emotion Extraction** → OpenAI GPT-4 extracts emotions from text
3. **Vector Creation** → OpenAI creates 3072-dim embedding
4. **Vector Search** → Pinecone finds similar game embeddings
5. **Soul Score Calculation** → Backend calculates emotional depth score
6. **Result Ranking** → Results sorted by match score + soul score
7. **Response** → Frontend displays personalized game recommendations

### Key Algorithms

#### Soul Score Calculation
```
Soul Score = (
  Emotional Depth Weight × Review Sentiment +
  Engagement Weight × Player Hours +
  Quality Weight × Review Rating
) / Total Weight
```

#### Emotion Matching
```
Match Score = Cosine Similarity(
  User Emotion Vector,
  Game Emotion Vector
) × 100
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **PostgreSQL** 14+ with pgvector extension
- **Redis** (optional, for caching)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Pinecone API Key** ([Get one here](https://www.pinecone.io/))
- **Supabase Account** (for PostgreSQL hosting, optional)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/AtharvRaotole/GameDiscoverability.git
cd GameDiscoverability
```

#### 2. Set Up Backend

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Required:
# - DATABASE_URL (PostgreSQL connection string)
# - OPENAI_API_KEY
# - PINECONE_API_KEY
# - JWT_SECRET (min 32 characters)
# Optional:
# - REDIS_URL
# - TASTERAY_API_KEY
# - STEAM_API_KEY
```

#### 3. Set Up Database

```bash
# Option 1: Using Supabase (Recommended)
npm run setup-supabase

# Option 2: Local PostgreSQL
createdb gamesoul
psql gamesoul -f src/config/schema.sql
```

#### 4. Set Up Frontend

```bash
cd ../frontend
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

#### 6. Import Games (Optional)

```bash
cd backend
npm run import-popular-games
```

### Verify Installation

1. **Backend Health**: http://localhost:3001/health
   ```json
   {
     "status": "ok",
     "database": "connected",
     "redis": "connected"
   }
   ```

2. **Frontend**: Open http://localhost:3000

3. **Test API**: 
   ```bash
   curl http://localhost:3001/api
   ```

---

## 📁 Project Structure

```
GameDiscoverability/
├── 📂 frontend/                 # Next.js frontend application
│   ├── 📂 src/
│   │   ├── 📂 app/             # App Router pages
│   │   │   ├── (auth)/         # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── welcome/
│   │   │   └── (main)/         # Main application pages
│   │   │       ├── discover/   # Game discovery
│   │   │       ├── explore/    # Browse games
│   │   │       ├── journeys/   # Emotional journeys
│   │   │       └── library/    # User library
│   │   ├── 📂 components/      # React components
│   │   │   ├── discovery/      # Discovery components
│   │   │   ├── journeys/       # Journey components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # UI primitives
│   │   ├── 📂 lib/             # Utilities and API client
│   │   ├── 📂 stores/          # Zustand state management
│   │   └── 📂 hooks/           # Custom React hooks
│   ├── 📂 public/              # Static assets
│   └── package.json
│
├── 📂 backend/                  # Express backend API
│   ├── 📂 src/
│   │   ├── 📂 config/          # Configuration files
│   │   │   ├── database.ts     # Database connection
│   │   │   ├── env.ts          # Environment validation
│   │   │   ├── redis.ts        # Redis connection
│   │   │   └── schema.sql      # Database schema
│   │   ├── 📂 controllers/     # Request handlers
│   │   │   ├── discovery.controller.ts
│   │   │   ├── game.controller.ts
│   │   │   ├── journey.controller.ts
│   │   │   └── library.controller.ts
│   │   ├── 📂 services/        # Business logic
│   │   │   ├── embedding.service.ts
│   │   │   ├── emotion-analysis.service.ts
│   │   │   ├── recommendation.service.ts
│   │   │   ├── soul-score.service.ts
│   │   │   └── ...
│   │   ├── 📂 routes/          # API routes
│   │   ├── 📂 middleware/      # Express middleware
│   │   └── index.ts            # Application entry point
│   ├── 📂 scripts/             # Utility scripts
│   │   ├── import-games.ts
│   │   ├── setup-database.ts
│   │   └── ...
│   └── package.json
│
└── 📄 README.md                 # This file
```

---

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.gamesoul.com` (example)

### Authentication

Currently, the API uses user IDs for identification. JWT authentication is planned for future releases.

### Endpoints

#### Discovery

##### `POST /api/discover`

Discover games based on emotional query.

**Request:**
```json
{
  "query": "I want to feel the same sense of wonder and melancholy I felt playing Outer Wilds",
  "limit": 20,
  "offset": 0
}
```

**Response:**
```json
{
  "emotionVector": {
    "embedding": [0.123, -0.456, ...],
    "emotions": {
      "wonder": 0.85,
      "melancholy": 0.72,
      "curiosity": 0.68
    }
  },
  "results": [
    {
      "game": { ... },
      "matchScore": 92.5,
      "soulScore": 87,
      "emotionAlignment": 0.89
    }
  ],
  "total": 45,
  "hasMore": true
}
```

##### `POST /api/emotions/extract`

Extract emotions from text in real-time.

**Request:**
```json
{
  "text": "I want something that makes me feel nostalgic and hopeful"
}
```

**Response:**
```json
[
  {
    "word": "nostalgic",
    "intensity": 0.85,
    "category": "sentiment"
  },
  {
    "word": "hopeful",
    "intensity": 0.72,
    "category": "emotion"
  }
]
```

#### Games

##### `GET /api/games`

Get all games with pagination and sorting.

**Query Parameters:**
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)
- `sortBy` (string): Sort field (default: "soul_score")
- `order` (string): "ASC" | "DESC" (default: "DESC")

**Response:**
```json
{
  "games": [ ... ],
  "total": 1000,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

##### `GET /api/games/:id`

Get game details by ID.

##### `GET /api/games/:id/similar`

Get similar games based on emotional profile.

#### Library

##### `GET /api/library/:userId`

Get user's game library.

**Query Parameters:**
- `status` (optional): Filter by status ("playing" | "completed" | "wishlist")

##### `POST /api/library`

Add game to library.

**Request:**
```json
{
  "userId": "uuid",
  "gameId": "753640",
  "status": "wishlist"
}
```

##### `PATCH /api/library/:userId/:gameId`

Update library entry status.

##### `DELETE /api/library/:userId/:gameId`

Remove game from library.

#### Journeys

##### `GET /api/journeys/curated`

Get all curated emotional journeys.

##### `GET /api/journeys/:id`

Get journey details.

##### `POST /api/journeys/:id/fork`

Fork a journey with modifications.

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 💻 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (if configured)
- **Conventions**: 
  - PascalCase for components
  - camelCase for functions/variables
  - kebab-case for files

### Git Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests and linter
   ```bash
   # Frontend
   cd frontend && npm run lint && npm test
   
   # Backend
   cd backend && npm run type-check && npm test
   ```

4. Commit with descriptive messages
   ```bash
   git commit -m "feat: add emotion extraction feature"
   ```

5. Push and create Pull Request

### Available Scripts

#### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run type-check   # TypeScript type checking
```

#### Backend

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm start            # Start production server
npm test             # Run tests
npm run type-check   # TypeScript type checking
npm run import-games # Import games from Steam
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend Tests

```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Test Structure

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and services
- **E2E Tests**: Critical user flows (planned)

---

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
3. Deploy automatically on push to `main`

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables (see [Environment Variables](#-environment-variables))
3. Railway will auto-detect Node.js and deploy

### Database

- **Supabase**: Recommended for PostgreSQL with pgvector
- **Railway PostgreSQL**: Alternative option
- **Self-hosted**: Requires pgvector extension

### Environment Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=game-emotions

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Optional APIs
TASTERAY_API_KEY=...
STEAM_API_KEY=...
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/GameDiscoverability.git
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with clear messages**
7. **Push to your fork**
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Keep commits atomic and well-described
- Reference issues in PR descriptions

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **Pinecone** for vector database infrastructure
- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Supabase** for PostgreSQL hosting
- All open-source contributors and the gaming community

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AtharvRaotole/GameDiscoverability/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AtharvRaotole/GameDiscoverability/discussions)

---

<div align="center">

**Built with ❤️ for gamers who want to feel**

[⭐ Star us on GitHub](https://github.com/AtharvRaotole/GameDiscoverability) • [🐛 Report Bug](https://github.com/AtharvRaotole/GameDiscoverability/issues) • [💡 Request Feature](https://github.com/AtharvRaotole/GameDiscoverability/issues)

Made with Next.js, TypeScript, and lots of ☕

</div>
